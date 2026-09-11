"""3D staging of GEM.blend for the portfolio.

    blender -b GEM.blend --python gem.py -- out.png [PERCENT]

The crystal and its material are unchanged; the scene around it is added in
memory for this render only (the .blend is never saved).
- A 3/4 camera instead of the original top-down one, with shallow focus.
- A near-black glossy floor that reflects the gem.
- A blue lamp inside the gem to spill its glow onto the floor, and a soft
  cool light from behind.
- The material switches from blended to dithered transparency, which EEVEE
  needs to show it in reflections.
- Compositing off: the file's chain ends in a Sun Beams glare that smears the
  whole frame. A soft glow is added afterwards instead (see README).
"""
import bpy, sys, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
pct = int(args[1]) if len(args) > 1 else 100

sc = bpy.context.scene
gem = bpy.data.objects['Icosphere']
c = gem.matrix_world.translation.copy()

bpy.data.materials['Material.001'].surface_render_method = 'DITHERED'

# Camera
AZ, EL, DIST = math.radians(20), math.radians(11), 14
cam = sc.camera
cam.data.lens = 55
cam.data.shift_x = cam.data.shift_y = 0
cam.location = c + DIST * Vector((math.cos(EL) * math.cos(AZ), math.cos(EL) * math.sin(AZ), math.sin(EL)))
aim = c + Vector((0, 0, -0.85))
cam.rotation_euler = (aim - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.dof.use_dof = True
cam.data.dof.focus_object = None
cam.data.dof.focus_distance = (c - cam.location).length - 0.6
cam.data.dof.aperture_fstop = 4.0

# Floor
bpy.ops.mesh.primitive_plane_add(size=600, location=(c.x, c.y, c.z - 1.35))
floor = bpy.context.active_object
fm = bpy.data.materials.new('Floor')
fm.use_nodes = True
p = fm.node_tree.nodes['Principled BSDF']
p.inputs['Base Color'].default_value = (0.012, 0.014, 0.022, 1)
p.inputs['Roughness'].default_value = 0.07
p.inputs['Specular IOR Level'].default_value = 0.6
floor.data.materials.append(fm)

# Lights. Specular off on both: they tint the floor without showing up in it
# as bright discs.
glow = bpy.data.lights.new('Glow', 'POINT')
glow.color = (0.28, 0.48, 1.0)
glow.energy = 110
glow.shadow_soft_size = 0.9
glow.use_shadow = False
glow.specular_factor = 0.0
glow_obj = bpy.data.objects.new('Glow', glow)
sc.collection.objects.link(glow_obj)
glow_obj.location = c
bpy.data.objects['Light'].hide_render = True

rim = bpy.data.lights.new('Rim', 'AREA')
rim.shape, rim.size = 'DISK', 6
rim.color = (0.55, 0.62, 1.0)
rim.energy = 180
rim.specular_factor = 0.0
rim_obj = bpy.data.objects.new('Rim', rim)
sc.collection.objects.link(rim_obj)
behind = c - (cam.location - c).normalized() * 9
rim_obj.location = (behind.x, behind.y, c.z + 5)
rim_obj.rotation_euler = (c - rim_obj.location).to_track_quat('-Z', 'Y').to_euler()

bg = next(n for n in sc.world.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs['Color'].default_value = (0.006, 0.008, 0.02, 1)
bg.inputs['Strength'].default_value = 1.0

sc.render.use_compositing = False
sc.eevee.use_raytracing = True
sc.eevee.use_shadows = True
sc.eevee.taa_render_samples = 96

r = sc.render
r.resolution_x, r.resolution_y, r.resolution_percentage = 1920, 1080, pct
r.image_settings.file_format = 'PNG'
r.image_settings.color_mode = 'RGB'
r.filepath = out
bpy.ops.render.render(write_still=True)
