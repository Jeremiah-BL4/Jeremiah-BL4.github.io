# Blender render scripts

The Creative section's renders come from the `.blend` files in
[x13-4zur3/blender-projects](https://github.com/x13-4zur3/blender-projects).
These scripts set up each shot in memory and render it; they never save the
`.blend`, so the originals stay as they are. Each script's docstring lists
exactly what it adds or changes.

Tested with Blender 5.2. Run from this folder, with `$P` as the unzipped repo:

```bash
blender -b "$P/BLACK HOLE/BLACK HOLE.blend" --python black_hole.py -- black-hole.png
blender -b "$P/GEM/GEM.blend"               --python gem.py        -- gem.png
blender -b "$P/TEMPLE/TEMPLE.blend"         --python temple.py     -- temple.png wide
blender -b "$P/TEMPLE/TEMPLE.blend"         --python temple.py     -- temple-low.png low
```

An optional last argument renders at a percentage of full size (`25` for a
quick check). On this machine's CPU the black hole takes about 30 minutes at
full size; the others a couple of minutes each.

Then export at 1600px wide. The black hole and gem get a soft glow on the way:

```bash
# black hole (sigma 28, 30%) and gem (sigma 22, 35%)
ffmpeg -i black-hole.png -filter_complex "[0]format=gbrp,split[a][b];[b]gblur=sigma=28[g];[a][g]blend=all_mode=screen:all_opacity=0.30,scale=1600:-2:flags=lanczos,format=yuv420p" -c:v libwebp -quality 84 black-hole.webp

# temple shots
ffmpeg -i temple.png -vf scale=1600:-2:flags=lanczos -c:v libwebp -quality 82 temple.webp
```

The WebP files go in `assets/img/creative/`.
