﻿///<reference path="../references.ts" />

module Jv.Games.WebGL.Core {
    export class Uniform {
        context: WebGLRenderingContext;
        program: WebGLProgram;

        constructor(shaderProgram: ShaderProgram, public location: WebGLUniformLocation) {
            this.context = shaderProgram.context;
            this.program = shaderProgram.program;
        }

        get value() {
            return this.context.getUniform(this.program, this.location);
        }

        setInt(value: number) {
            this.context.uniform1i(this.location, value);
        }

        setFloat(value: number) {
            this.context.uniform1f(this.location, value);
        }

        setColor(color: Color) {
            this.context.uniform4f(this.location, color.red, color.green, color.blue, color.alpha);
        }

        setMatrix4(value: Matrix4, transpose: boolean = false) {
            this.context.uniformMatrix4fv(this.location, transpose, value.data);
        }

        setTexture(value: Materials.Texture) {
            var gl = this.context;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, value.texture);
            gl.uniform1i(this.location, 0);
        }
    }
}
