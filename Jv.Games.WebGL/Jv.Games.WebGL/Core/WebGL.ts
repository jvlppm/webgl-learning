///<reference path="ShaderProgram.ts" />

module Jv.Games.WebGL.Core {
    import ShaderProgram = Jv.Games.WebGL.Core.ShaderProgram;

    export class WebGL {
        static fromCanvas(canvas: HTMLCanvasElement) {
            var context = WebGL.getWebGLContext(canvas);
            return new WebGL(context, canvas);
        }

        constructor(public context: WebGLRenderingContext, public canvas : HTMLCanvasElement) { }

        createShaderProgram(): ShaderProgram {
            var gl = this.context;
            return new ShaderProgram(this, gl.createProgram());
        }

        clear() {
            var gl = this.context;
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        private static getWebGLContext(canvas: HTMLCanvasElement) {
            var context: WebGLRenderingContext;
            var contextName = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var i = 0; i < contextName.length && context == null; i++)
                context = <WebGLRenderingContext>canvas.getContext(contextName[i], { antialias: false });
            return context;
        }
    }
}
