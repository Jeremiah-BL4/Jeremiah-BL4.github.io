"""Colour render of BLACK HOLE.blend for the portfolio.

    blender -b "BLACK HOLE.blend" --python black_hole.py -- out.png [PERCENT] [SAMPLES]

Changes are made in memory for this render only; the .blend is never saved.
- The disk's checker texture becomes a hot, streaked emission (white-gold at
  the inner edge, through orange, to deep red at the rim).
- 20 more lens shells on the same size curve, so the lens reaches past the
  disk's edge and the lensed arcs taper off instead of stopping at a hard edge.
- The small Sphere at the centre gets a black material (the event horizon).
- Shell, the mesh the lens copies from, is hidden; the white glow volume is off.
- A starfield in the world, which the lens bends too.
- Camera: 300mm -> 240mm, shifted to centre the hole.
"""
import bpy, sys

args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
pct = int(args[1]) if len(args) > 1 else 100
samples = int(args[2]) if len(args) > 2 else 64

sc = bpy.context.scene


def ramp(node, stops):
    els = node.color_ramp.elements
    for i, (pos, col) in enumerate(stops):
        e = els[i] if i < len(els) else els.new(pos)
        e.position, e.color = pos, (*col, 1.0)


# ---- Disk colour ------------------------------------------------------------
t = bpy.data.materials['Material.001'].node_tree
L = t.links
sph = t.nodes['Group']                  # Spherical Coordinates: Radius, Theta, Phi
emit = t.nodes['Emission']
t.nodes.remove(t.nodes['Checker Texture'])

def math_node(op, value=None):
    n = t.nodes.new('ShaderNodeMath')
    n.operation = op
    if value is not None:
        n.inputs[1].default_value = value
    return n

r = math_node('DIVIDE', 10.0)           # radius, 0 at the centre to 1 at the rim
L.new(sph.outputs['Radius'], r.inputs[0])

# Noise sampled on (radius, cos phi, sin phi): bands that run around the disk
cos_p, sin_p = math_node('COSINE'), math_node('SINE')
L.new(sph.outputs['Phi'], cos_p.inputs[0]); L.new(sph.outputs['Phi'], sin_p.inputs[0])
rx = math_node('MULTIPLY', 9.0); L.new(r.outputs[0], rx.inputs[0])
cy = math_node('MULTIPLY', 0.9); L.new(cos_p.outputs[0], cy.inputs[0])
sz = math_node('MULTIPLY', 0.9); L.new(sin_p.outputs[0], sz.inputs[0])
xyz = t.nodes.new('ShaderNodeCombineXYZ')
L.new(rx.outputs[0], xyz.inputs['X']); L.new(cy.outputs[0], xyz.inputs['Y']); L.new(sz.outputs[0], xyz.inputs['Z'])
noise = t.nodes.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 2.2
noise.inputs['Detail'].default_value = 9.0
noise.inputs['Roughness'].default_value = 0.62
L.new(xyz.outputs[0], noise.inputs['Vector'])
bands = t.nodes.new('ShaderNodeMapRange')
bands.inputs['From Min'].default_value, bands.inputs['From Max'].default_value = 0.3, 0.7
bands.inputs['To Min'].default_value, bands.inputs['To Max'].default_value = 0.35, 1.6
L.new(noise.outputs['Fac'], bands.inputs['Value'])

heat = t.nodes.new('ShaderNodeValToRGB')
ramp(heat, [(0.0, (1.0, 0.92, 0.78)), (0.1, (1.0, 0.62, 0.20)), (0.3, (0.85, 0.24, 0.04)),
            (0.65, (0.30, 0.04, 0.01)), (1.0, (0.0, 0.0, 0.0))])
L.new(r.outputs[0], heat.inputs['Fac'])
tint = t.nodes.new('ShaderNodeMix')
tint.data_type, tint.blend_type = 'RGBA', 'MULTIPLY'
tint.inputs['Factor'].default_value = 1.0
L.new(heat.outputs['Color'], tint.inputs[6])
L.new(bands.outputs['Result'], tint.inputs[7])
L.new(tint.outputs[2], emit.inputs['Color'])
emit.inputs['Strength'].default_value = 2.2

# ---- Lens: extend past the disk ----------------------------------------------
# Shell i is scaled (i / 15.06)^2.5 + 0.5. Adding shells on the same curve keeps
# every existing shell where it was and pushes the outer edge further out.
SHELLS = 84
g = bpy.data.node_groups['Geometry Nodes']
g.nodes['Integer'].integer = SHELLS
g.nodes['Math'].inputs[1].default_value = SHELLS / (64 / 4.25)
sc.cycles.max_bounces = sc.cycles.transmission_bounces = 2 * SHELLS + 16

# ---- Event horizon, helpers ---------------------------------------------------
hole = bpy.data.materials.new('Event horizon')
hole.use_nodes = True
ht = hole.node_tree
for n in list(ht.nodes):
    if n.type != 'OUTPUT_MATERIAL':
        ht.nodes.remove(n)
black = ht.nodes.new('ShaderNodeEmission')
black.inputs['Strength'].default_value = 0.0
ht.links.new(black.outputs[0], next(n for n in ht.nodes if n.type == 'OUTPUT_MATERIAL').inputs['Surface'])
sphere = bpy.data.objects['Sphere']
sphere.data.materials.clear()
sphere.data.materials.append(hole)

bpy.data.objects['Shell'].hide_render = True
bpy.data.objects['Accretion disk'].hide_render = True

# ---- Stars --------------------------------------------------------------------
wt = sc.world.node_tree
for n in list(wt.nodes):
    if n.type != 'OUTPUT_WORLD':
        wt.nodes.remove(n)
coord = wt.nodes.new('ShaderNodeTexCoord')
cells = wt.nodes.new('ShaderNodeTexVoronoi')
cells.inputs['Scale'].default_value = 1400.0
wt.links.new(coord.outputs['Generated'], cells.inputs['Vector'])
dot = wt.nodes.new('ShaderNodeMapRange')               # a point at each cell centre
dot.inputs['From Max'].default_value = 0.09
dot.inputs['To Min'].default_value, dot.inputs['To Max'].default_value = 1.0, 0.0
wt.links.new(cells.outputs['Distance'], dot.inputs['Value'])
some = wt.nodes.new('ShaderNodeMapRange')              # ...in about a quarter of cells
some.inputs['From Min'].default_value = 0.72
wt.links.new(cells.outputs['Color'], some.inputs['Value'])
star = wt.nodes.new('ShaderNodeMath'); star.operation = 'MULTIPLY'
wt.links.new(dot.outputs['Result'], star.inputs[0]); wt.links.new(some.outputs['Result'], star.inputs[1])
bright = wt.nodes.new('ShaderNodeMath'); bright.operation = 'MULTIPLY'
bright.inputs[1].default_value = 6.0
wt.links.new(star.outputs[0], bright.inputs[0])
sky = wt.nodes.new('ShaderNodeBackground')
sky.inputs['Color'].default_value = (0.85, 0.9, 1.0, 1.0)
wt.links.new(bright.outputs[0], sky.inputs['Strength'])
wt.links.new(sky.outputs[0], next(n for n in wt.nodes if n.type == 'OUTPUT_WORLD').inputs['Surface'])

# ---- Camera and output --------------------------------------------------------
sc.camera.data.lens = 240
sc.camera.data.shift_x = 0.096
sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'

rd = sc.render
rd.resolution_x, rd.resolution_y, rd.resolution_percentage = 1600, 900, pct
rd.image_settings.file_format = 'PNG'
rd.image_settings.color_mode = 'RGB'
rd.filepath = out
sc.cycles.device = 'CPU'
sc.cycles.samples = samples
sc.cycles.use_denoising = True
bpy.ops.render.render(write_still=True)
