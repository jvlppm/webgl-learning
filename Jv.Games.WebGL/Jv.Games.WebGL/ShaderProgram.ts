module Jv.Games.WebGL {
    import Uniform = Jv.Games.WebGL.Uniform;
    import VertexAttribute = Jv.Games.WebGL.VertexAttribute;

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

        enableVertexAttribute(name: string) {
            var attribute = this.getVertexAttribute(name);
            attribute.enable();
        }

        getVertexAttribute(name: string): VertexAttribute {
            var gl = this.webgl.context;

            var index = this.getAttribLocation(name);
            if (index < 0)
                throw new Error("Shader attributes named " + name + " not found");
            var vertexAttribute = new VertexAttribute(this, index);
            return vertexAttribute;
        }

        getUniform(name: string): Uniform {
            var gl = this.webgl.context;
            var location = this.getUniformLocation(name);
            if (location === null)
                throw new Error("Uniform location not found: " + name);

            return new Uniform(this, location);
        }

        //////////
        // Helpers
        getAttribLocation(name: string) {
            var gl = this.webgl.context;
            return gl.getAttribLocation(this.program, name);
        }

        getUniformLocation(name: string) {
            var gl = this.webgl.context;
            return gl.getUniformLocation(this.program, name);
        }

        //////////
        // Private
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
