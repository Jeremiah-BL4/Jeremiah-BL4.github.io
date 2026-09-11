Original, unoptimised source files. NOT used by the site - nothing links here.

  logo-original-padded.png
      The original green/blue JA monogram. It was ~94% transparent padding,
      so the site uses it cropped to its bounding box (250x172 at 188,227).

      assets/img/logo-light.webp and logo-dark.webp are this artwork
      recoloured. Each letter is separated by its original hue (green = J,
      blue = A) and its own brightness range is mapped onto its own ramp, so
      the facets use the full range of shades. An S-curve (smoothstep) is
      applied on top to push neighbouring facet shades apart.

        brightness ranges:  J 142.6 -> 173.5    A 82.2 -> 134.2

        light (dark grounds)   J  #d3c4ab -> #fffbf3
                               A  #958369 -> #dccfb9
        dark  (light grounds)  J  #2e2b27 -> #7c7569
                               A  #08090b -> #4a4640

      The tab icon, home-screen icon and og-cover.png are built from the same
      recoloured artwork.

  logo-176.png
      The cropped monogram in its original colours, as a plain PNG.

  tech/*
      The original technology icons you supplied (512px PNGs, plus kali.ico).
      assets/img/tech/*.webp are 48px versions of the same files, shown at
      24px in the Toolkit. To add another: drop the original here, then

        ffmpeg -i tools/source/tech/<name>.png -vf "scale=48:48"                -c:v libwebp -quality 90 assets/img/tech/<name>.webp

      and add an <img> to the matching row in index.html.

The wallpaper this theme's palette was sampled from has been removed at your
request. The colours live on in assets/css/tokens.css.

To add a hero image later (needs ffmpeg):

  ffmpeg -i <your-image>.jpg -vf "scale=1600:-2" \
         -c:v libwebp -quality 76 assets/img/hero.webp
  ffmpeg -i <your-image>.jpg -vf "scale=900:-2" \
         -c:v libwebp -quality 74 assets/img/hero-900.webp
