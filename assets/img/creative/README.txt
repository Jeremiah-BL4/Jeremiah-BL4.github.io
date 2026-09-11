Blender renders and other visual work go here.

Then list them in assets/js/data/projects.js -> `gallery`:

  { src: 'assets/img/creative/render-01.webp',
    alt: 'What the image shows, for screen readers',
    title: 'Scene name',
    meta: 'Blender · Cycles · 2025' }

Render at 16:9 (the gallery shows them at that shape), then export at 1600px
wide as WebP, under ~400KB each:

  ffmpeg -i render.png -vf scale=1600:-2:flags=lanczos -c:v libwebp -quality 82 render.webp

The .blend files for black-hole, gem and temple are in
https://github.com/x13-4zur3/blender-projects. The temple file has no camera
framed on the building, so its two renders use a camera and sun added at
render time (the .blend itself was not changed).
