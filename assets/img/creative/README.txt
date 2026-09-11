Blender renders and other visual work go here.

Then list them in assets/js/data/projects.js -> `gallery`:

  { src: 'assets/img/creative/render-01.webp',
    alt: 'What the image shows, for screen readers',
    title: 'Scene name',
    meta: 'Blender · Cycles · 2025' }

Render at 16:9 (the gallery shows them at that shape), then export at 1600px
wide as WebP, under ~400KB each:

  ffmpeg -i render.png -vf scale=1600:-2:flags=lanczos -c:v libwebp -quality 82 render.webp

black-hole, gem, temple and temple-low are rendered from the .blend files in
https://github.com/Jeremiah-BL4/blender-projects by the scripts in
tools/blender/, which also say exactly what each render adds to its scene.

sword-in-the-stone.webp is the first frame of assets/video/sword-in-the-stone.mp4.
A gallery item with `video` opens that file in the viewer instead of the image,
and `fit: 'contain'` shows a non-16:9 image whole, on a dark ground.
