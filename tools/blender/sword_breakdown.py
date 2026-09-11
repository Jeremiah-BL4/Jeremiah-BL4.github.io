"""Breakdown stills for Sword in the Stone.

    blender -b "Sword Final.blend" --python sword_breakdown.py -- out.png model  [PERCENT]
    blender -b "Still Frame.blend" --python sword_breakdown.py -- out.png clay   [PERCENT]
    blender -b "Still Frame.blend" --python sword_breakdown.py -- out.png lighting [PERCENT]

Everything happens in memory for the render; the .blend files are never saved.

model     The sword on its own, lit like a product shot: a camera framing it
          lengthways, a soft key light, a rim light and a dark backdrop.
clay      The final shot's camera with every model in one grey material and
          the effects hidden (fire, dust, lightning, light-ray volumes, the
          glowing exterior plane), rendered with Workbench like the viewport.
lighting  The same camera and the scene's own lights, light rays and world,
          with the models' textures swapped for plain clay, so only the
          lighting is left to look at.

Two materials in these files point to runes.jpg on a drive that isn't here;
both are pointed at the copy of runes.jpg packed in the same file.
"""
import bpy, sys, math
from mathutils import Vector, Matrix

args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
mode = args[1] if len(args) > 1 else 'model'
pct = int(args[2]) if len(args) > 2 else 100

sc = bpy.context.scene

# Missing runes.jpg -> the packed copy of the same image
packed = bpy.data.images.get('runes.jpg')
for m in bpy.data.materials:
    if m.node_tree and packed:
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and n.image.name == 'runes.jpg.001':
                n.image = packed

# Effects and helpers, hidden in the clay and lighting passes
EFFECTS = {'Fire.001', 'Fire.002', 'DustParticles', 'Cube_FloatyParticles', 'Cube_Lightning',
           'Lightning', 'Emitter Guard', 'Emitter Sphere'}
VOLUMES = {'Depth', 'Light Ray', 'Light Ray.001'}
EMISSIVE = {'Exterior Light'}


def clay_material(name='Clay', colour=(0.5, 0.48, 0.45)):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*colour, 1)
    p.inputs['Roughness'].default_value = 0.6
    return m


def output(width, height):
    r = sc.render
    r.resolution_x, r.resolution_y, r.resolution_percentage = width, height, pct
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGB'
    r.filepath = out


if mode == 'model':
    sword = [o for o in sc.objects if o.type == 'MESH']
    pts = [o.matrix_world @ Vector(c) for o in sword for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    centre = (lo + hi) / 2
    length = max(hi - lo)
    axis = Vector((0, 1, 0)) if (hi - lo).y >= (hi - lo).x else Vector((1, 0, 0))

    # Camera above and to one side of the sword, looking down at the face of
    # the blade; EL is height above the blade's plane, AZ swings towards the
    # tip (+) or the pommel (-).
    EL = math.radians(float(args[3]) if len(args) > 3 else 60)
    AZ = math.radians(float(args[4]) if len(args) > 4 else -20)
    cam = sc.camera
    cam.data.lens = 50
    side = axis.cross(Vector((0, 0, 1))).normalized()
    view = (math.cos(EL) * (math.cos(AZ) * side + math.sin(AZ) * axis) + math.sin(EL) * Vector((0, 0, 1)))
    fov = 2 * math.atan(18 / cam.data.lens)
    dist = (length * 0.5 / 0.9) / math.tan(fov / 2)
    cam.location = centre + dist * view
    cam.rotation_euler = (centre - cam.location).to_track_quat('-Z', 'Y').to_euler()
    ROLL = math.radians(float(args[5]) if len(args) > 5 else 0)
    cam.rotation_euler.rotate(Matrix.Rotation(ROLL, 3, (centre - cam.location).normalized()))

    # Centre the sword in frame and fill about 88% of it, from where its
    # corners actually land on screen.
    from bpy_extras.object_utils import world_to_camera_view
    sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
    for _ in range(3):
        bpy.context.view_layer.update()
        ndc = [world_to_camera_view(sc, cam, p) for p in pts]
        x0, x1 = min(v.x for v in ndc), max(v.x for v in ndc)
        y0, y1 = min(v.y for v in ndc), max(v.y for v in ndc)
        k = min(0.88 / (x1 - x0), 0.80 / (y1 - y0))
        cam.data.lens *= k
        cam.data.shift_x += ((x0 + x1) / 2 - 0.5) * k
        cam.data.shift_y += ((y0 + y1) / 2 - 0.5) * k * 1080 / 1920

    bpy.data.objects['Light'].hide_render = True
    def area(name, energy, size, loc, colour=(1, 1, 1)):
        l = bpy.data.lights.new(name, 'AREA')
        l.energy, l.size, l.color = energy, size, colour
        o = bpy.data.objects.new(name, l)
        sc.collection.objects.link(o)
        o.location = loc
        o.rotation_euler = (centre - o.location).to_track_quat('-Z', 'Y').to_euler()
    # The blade is close to a mirror, so the key sits on the far side of it
    # from the camera: it lights the edges and the guard without being
    # reflected flat across the blade.
    area('Key', 260, 4, centre + Vector((0, 0, 5)) - side * 5 - axis * 2, (1.0, 0.93, 0.85))
    area('Rim', 500, 2, centre + Vector((0, 0, 1.5)) - side * 7 + axis * 4, (0.75, 0.85, 1.0))
    area('Fill', 60, 10, centre + Vector((0, 0, 6)) + side * 8 + axis * 6)

    wt = sc.world.node_tree
    bg = next(n for n in wt.nodes if n.type == 'BACKGROUND')
    bg.inputs['Color'].default_value = (0.02, 0.019, 0.018, 1)
    bg.inputs['Strength'].default_value = 1.0

    sc.eevee.use_raytracing = True
    sc.eevee.taa_render_samples = 128
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    output(1920, 1080)

elif mode == 'clay':
    for o in sc.objects:
        if o.name in EFFECTS | VOLUMES | EMISSIVE:
            o.hide_render = True
    sc.render.engine = 'BLENDER_WORKBENCH'
    sh = sc.display.shading
    sh.light = 'STUDIO'
    sh.color_type = 'SINGLE'
    sh.single_color = (0.62, 0.6, 0.57)
    sh.show_cavity = True
    sh.cavity_type = 'BOTH'
    sh.show_shadows = True
    sh.show_object_outline = False
    sc.world.color = (0.22, 0.22, 0.22)          # the cave opening, instead of black
    sc.render.use_compositing = False
    sc.display.render_aa = '32'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    output(860, 1080)

elif mode == 'lighting':
    for o in sc.objects:
        if o.name in EFFECTS:
            o.hide_render = True
    clay = clay_material()
    for o in sc.objects:
        if o.type == 'MESH' and o.name not in VOLUMES | EMISSIVE:
            for slot in o.material_slots:
                slot.material = clay
            if not o.material_slots:
                o.data.materials.append(clay)
    output(860, 1080)

bpy.ops.render.render(write_still=True)
