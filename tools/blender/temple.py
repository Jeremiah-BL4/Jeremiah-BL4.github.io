"""Daylight renders of TEMPLE.blend for the portfolio.

    blender -b TEMPLE.blend --python temple.py -- out.png wide|low [PERCENT]

The file's only camera and light are inside the building, so both shots use a
camera, sun, sky and ground added in memory for this render only (the .blend
is never saved; the model and its material are unchanged).
- A low, warm sun from the camera's left: roofs split into lit and shaded
  planes and the building throws a long shadow.
- A physical sky (Multiple Scattering) for the ambient light and horizon.
- A ground plane of packed earth, so the base sits on something.
- EEVEE ray tracing and horizon-scan AO for contact shading.
"""
import bpy, sys, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
shot = args[1] if len(args) > 1 else 'wide'
pct = int(args[2]) if len(args) > 2 else 100

#            azimuth, elevation, distance, lens, aim height
SHOTS = {'wide': (-60, 20, 92, 50, 8.5),
         'low':  (-72,  9, 58, 40, 10.0)}
az, el, dist, lens, tz = SHOTS[shot]
SUN_ELEVATION, SUN_SIDE = 16, 70        # degrees; SUN_SIDE is off the camera axis, to its left

sc = bpy.context.scene
target = Vector((0, 0, tz))

cam = sc.camera
cam.data.lens = lens
cam.data.clip_end = 3000
cam.location = target + dist * Vector((math.cos(math.radians(el)) * math.cos(math.radians(az)),
                                       math.cos(math.radians(el)) * math.sin(math.radians(az)),
                                       math.sin(math.radians(el))))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()

# Sun
cam_dir = Vector((math.cos(math.radians(az)), math.sin(math.radians(az)), 0))
left = Vector((0, 0, 1)).cross(cam_dir).normalized()
to_sun = (math.cos(math.radians(SUN_SIDE)) * cam_dir + math.sin(math.radians(SUN_SIDE)) * left).normalized()
phi = math.atan2(to_sun.x, -to_sun.y)

bpy.data.objects['Light'].hide_render = True
sun = bpy.data.lights.new('Sun', 'SUN')
sun.energy = 5.0
sun.color = (1.0, 0.80, 0.60)
sun.angle = math.radians(1.2)
sun_obj = bpy.data.objects.new('Sun', sun)
sc.collection.objects.link(sun_obj)
sun_obj.rotation_euler = (math.radians(90 - SUN_ELEVATION), 0, phi)

# Sky
wt = sc.world.node_tree
for n in list(wt.nodes):
    if n.type != 'OUTPUT_WORLD':
        wt.nodes.remove(n)
sky = wt.nodes.new('ShaderNodeTexSky')
sky.sky_type = 'MULTIPLE_SCATTERING'
sky.sun_disc = False
sky.sun_elevation = math.radians(SUN_ELEVATION)
sky.sun_rotation = phi + math.pi / 2
sky.air_density = 1.0
sky.aerosol_density = 1.6
bg = wt.nodes.new('ShaderNodeBackground')
bg.inputs['Strength'].default_value = 0.08
wt.links.new(sky.outputs['Color'], bg.inputs['Color'])
wt.links.new(bg.outputs[0], next(n for n in wt.nodes if n.type == 'OUTPUT_WORLD').inputs['Surface'])

# Ground
bpy.ops.mesh.primitive_plane_add(size=4000, location=(0, 0, -0.02))
ground = bpy.context.active_object
gm = bpy.data.materials.new('Ground')
gm.use_nodes = True
gt = gm.node_tree
p = gt.nodes['Principled BSDF']
p.inputs['Roughness'].default_value = 0.92
noise = gt.nodes.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 0.025
noise.inputs['Detail'].default_value = 6
coord = gt.nodes.new('ShaderNodeTexCoord')
gt.links.new(coord.outputs['Object'], noise.inputs['Vector'])
earth = gt.nodes.new('ShaderNodeValToRGB')
earth.color_ramp.elements[0].color = (0.085, 0.07, 0.052, 1)
earth.color_ramp.elements[1].color = (0.15, 0.125, 0.09, 1)
gt.links.new(noise.outputs['Fac'], earth.inputs['Fac'])
gt.links.new(earth.outputs['Color'], p.inputs['Base Color'])
ground.data.materials.append(gm)

e = sc.eevee
e.use_shadows = True
e.use_raytracing = True
e.use_fast_gi = True
e.fast_gi_distance = 2.5
e.shadow_ray_count = 2
e.shadow_step_count = 12
e.taa_render_samples = 128

sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'
sc.view_settings.exposure = 0.3

r = sc.render
r.resolution_x, r.resolution_y, r.resolution_percentage = 1920, 1080, pct
r.image_settings.file_format = 'PNG'
r.image_settings.color_mode = 'RGB'
r.filepath = out
bpy.ops.render.render(write_still=True)
