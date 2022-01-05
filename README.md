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
from *WebGL Programming Guide*  and did a rough port to TypeScript to make them a little nicer to work with in VS Code and Angular.
(See the `util` directory for attribution.)


## Usage
`yarn install` and...

`.\prep` -- build and zip for deployment

`.\run` -- run locally

## TODO
1.  Phong shading and lighting
2.  Ability to upload an obj file (or other formats) and auto-set an appropriate scale.
3.  Anything else that will be useful as a starter template.

## Live demo
https://stevenvictor.net/glta
