module Jv.Games.WebGL {
    import ShaderProgram = Jv.Games.WebGL.ShaderProgram;

    export class WebGL {
        static fromCanvas(canvas: HTMLCanvasElement) {
            var context = WebGL.getWebGLContext(canvas);
            return new WebGL(context);
        }

        constructor(public context: WebGLRenderingContext) { }

        createShaderProgram(): ShaderProgram {
            var gl = this.context;
            return new ShaderProgram(this, gl.createProgram());
        }

        private static getWebGLContext(canvas: HTMLCanvasElement) {
            var context: WebGLRenderingContext;
            var contextName = ["experimental-webgl"];
            for (var i = 0; i < contextName.length && context == null; i++)
                context = <WebGLRenderingContext>canvas.getContext(contextName[i], { antialias: false });
            return context;
        }
    }
}
