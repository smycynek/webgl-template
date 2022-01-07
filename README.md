# WebGL Template for Angular, TypeScript, WebPack

Copyright 2022 Steven Mycynek -- portions (c) 2012 kanda and matsuda

This project is nothing special, and it's not supposed to be.  There are a lot of WebGL project templates out there.

I just wanted a template that:

* Worked with more modern JavaScript and TypeScript (uses real classes
and `import` module syntax)
* Uses a modern framework (Angular 13)
* Could be deployed with Webpack.

The ones I saw so far claiming the above were pretty badly broken.  I also hated
writing `glsl` shaders as strings, especially strings concatenated with `\n` and `+`,
so thankfully, there are webpack loaders available.

I made the NIN, rook, and cube models in https://cad.onshape.com

Finally, I took some of the WebGL library code for math and loading shaders, buffers, and obj files
from  *WebGL Programming Guide*  and did a rough port to TypeScript to make them a little nicer to work with in VS Code and Angular.
(See the `util` directory for attribution.)


## Usage
`yarn install` and...

`.\prep` -- build and zip for deployment

`.\run` -- run locally

## TODO
1.  Phong shading and lighting
2.  Colors, textures, and error handling
3.  Ability to upload other file types besides .obj and auto-set a reasonable scale.
4.  Anything else that will be useful as a starter template.


## Tips
Default lighting, scale, and position for custom uploaded models are just best guesses, and the parser
may occasionally fail -- I can't fully support the obj spec with a 3rd-party parser in my spare time :)
Try using directional lighting and changing scale and transform if you can't see
your model.  Try https://stevenvictor.net/glta/assets/box_hole.obj for a sample model to upload, or create
a simple one in Blender or Onshape.  Colors and textures are currently not supported.

## Live demo
https://stevenvictor.net/glta
