module Jv.Games.WebGL {
    import Uniform = Jv.Games.WebGL.Uniform;

    export enum ShaderType {
        Vertex,
        Fragment
    }

    export class ShaderProgram {
        constructor(public webgl: WebGL, public program: WebGLProgram) {
        }

        addShader(type: ShaderType, source: string) {
            var gl = this.webgl.context;

            var shader = this.createShader(type, source);
            gl.attachShader(this.program, shader);
        }

        link() {
            var gl = this.webgl.context;
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                throw new Error("ShaderProgram could not be linked");
        }

        use() {
            var gl = this.webgl.context;
            gl.useProgram(this.program);
        }

        enableVertexAttribArray(stringParameter: string): void;
        enableVertexAttribArray(numberParameter: number): void;

        enableVertexAttribArray(indexOrName: any): void {
            var gl = this.webgl.context;

            var index: number;
            if (typeof indexOrName === "number")
                index = <number>indexOrName;
            else if (typeof indexOrName === "string")
                index = this.getAttribLocation(<string>indexOrName);
            else
                throw new Error("enableVertexAttribArray must be called with a string or a number");

            gl.enableVertexAttribArray(index);
        }

        getAttribLocation(name: string) {
            var gl = this.webgl.context;
            return gl.getAttribLocation(this.program, name);
        }

        getUniform(name: string): Uniform {
            var gl = this.webgl.context;
            var location = gl.getUniformLocation(this.program, name);
            if (location === null)
                throw new Error("Uniform location not found: " + name);

            return new Uniform(this, location);
        }

        private createShader(type: ShaderType, source: string): WebGLShader {
            var gl = this.webgl.context;

            var glShaderType = this.getShaderTypeId(type);
            var shader = gl.createShader(glShaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw new Error("Shader could not be compiled");

            return shader;
        }

        private getShaderTypeId(type: ShaderType) {
            var gl = this.webgl.context;
            switch (type) {
                case ShaderType.Vertex:
                    return gl.VERTEX_SHADER;
                case ShaderType.Fragment:
                    return gl.FRAGMENT_SHADER;
                default:
                    throw new Error("Unknown shader type " + type);
            }
        }
    }
}
