module Jv.Games.WebGL {
    export class Uniform {
        context: WebGLRenderingContext;
        program: WebGLProgram;

        constructor(shaderProgram: ShaderProgram, public location: WebGLUniformLocation) {
            this.context = shaderProgram.webgl.context;
            this.program = shaderProgram.program;
        }

        get value() {
            return this.context.getUniform(this.program, this.location);
        }

        setFloat(value: number) {
            this.context.uniform1f(this.location, value);
        }

        setFloatArray(value: Float32Array) {
            this.context.uniform1fv(this.location, value);
        }

        setInt(value: number) {
            this.context.uniform1i(this.location, value);
        }

        setMatrix2(value: Float32Array, transpose: boolean = false) {
            this.context.uniformMatrix2fv(this.location, transpose, value);
        }

        setMatrix3(value: Float32Array, transpose: boolean = false) {
            this.context.uniformMatrix3fv(this.location, transpose, value);
        }

        setMatrix4(value: Float32Array, transpose: boolean = false) {
            this.context.uniformMatrix4fv(this.location, transpose, value);
        }
    }
}
