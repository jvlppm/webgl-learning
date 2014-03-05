///<reference path="Scripts/typings/webgl/webgl.d.ts" />

module Jv.Games.WebGL {
    export enum ShaderType {
        Vertex,
        Fragment
    }

    export class ShaderProgram {
        constructor(private webgl: WebGL, private program: WebGLProgram) {
        }

        addShader(type: ShaderType, source: string) {
            var gl = this.webgl.context;

            var shader = this.createShader(type, source);
            gl.attachShader(this.program, shader);
        }

        public link() {
            this.webgl.context.linkProgram(this.program);
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

    export class WebGL {
        public static fromCanvas(canvas: HTMLCanvasElement) {
            var context = WebGL.getWebGLContext(canvas);
            return new WebGL(context);
        }

        constructor(public context: WebGLRenderingContext) { }

        public createShaderProgram(): ShaderProgram {
            var gl = this.context;
            return new ShaderProgram(this, gl.createProgram());
        }

        static getWebGLContext(canvas: HTMLCanvasElement) {
            var context: WebGLRenderingContext;
            var contextName = ["experimental-webgl"];
            for (var i = 0; i < contextName.length && context == null; i++)
                context = <WebGLRenderingContext>canvas.getContext(contextName[i], { antialias: false });
            return context;
        }
    }
}
