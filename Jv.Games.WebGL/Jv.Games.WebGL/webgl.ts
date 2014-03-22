module Jv.Games.WebGL {
    import ShaderProgram = Jv.Games.WebGL.ShaderProgram;

    export class WebGL {
        static fromCanvas(canvas: HTMLCanvasElement) {
            var context = WebGL.getWebGLContext(canvas);
            return new WebGL(context, canvas);
        }

        constructor(public context: WebGLRenderingContext, private canvas : HTMLCanvasElement) { }

        createShaderProgram(): ShaderProgram {
            var gl = this.context;
            return new ShaderProgram(this, gl.createProgram());
        }

        clear(red: number, green: number, blue: number, alpha: number = 1) {
            this.context.clearColor(red, green, blue, alpha);
            this.context.clear(this.context.COLOR_BUFFER_BIT);
            this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
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
