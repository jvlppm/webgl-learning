﻿///<reference path="../references.ts" />

module Jv.Games.WebGL.Materials {
    export class Texture {
        constructor(public texture: WebGLTexture) {
        }

        static FromImage(context: WebGLRenderingContext, image: HTMLImageElement) {
            var gl = context;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, <any>true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <any>image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

            return new Texture(texture);
        }
    }
}
