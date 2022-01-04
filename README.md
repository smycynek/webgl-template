# WebGL Template for Angular, TypeScript, WebPack

Copyright 2021 Steven Mycynek -- portions (c) 2012 kanda and matsuda

This project is nothing special, and it's not supposed to be.  There are a lot of WebGL project templates out there.

I just wanted one that worked with more modern JavaScript and TypeScript,
used a modern framework (Angular 14), and could be deployed with Webpack.
The ones I saw so far claiming the above were pretty badly broken.

I made the NIN and rook models in https://cad.onshape.com

I took some of the WebGL utils from the *Learning WebGL* book and did
a rough port to TypeScript to make them a little nicer to work with in VS Code.
(See the `util` directory for attribution.)


## Usage
`yarn install` and...

`prep` -- build and zip for deployment

`run` -- run locally

## TODO
1.  Implement Phong shading and lighting
2.  Add ability to upload an obj or glTF file.
3.  Anything else that will be useful as a starter template.

## Live demo
https://stevenvictor.net/glta