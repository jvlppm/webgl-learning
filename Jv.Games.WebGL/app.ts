///<reference path="Scripts/typings/jquery/jquery.d.ts" />
import WebGL = Jv.Games.WebGL;

function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
}

function setup() {
    var result = $.Deferred<WebGL.WebGL>();

    $(document).ready(function () {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
        matchWindowSize(canvas);
            
        var webgl = WebGL.WebGL.fromCanvas(canvas);
        var shaderProgram = webgl.createShaderProgram();

        var loadShader = function (url: string, type: WebGL.ShaderType) {
            return $.ajax(url).then(source => shaderProgram.addShader(type, source));
        };

        return $.when(
            loadShader("vertexShader.glsl.txt", WebGL.ShaderType.Vertex),
            loadShader("fragmentShader.glsl.txt", WebGL.ShaderType.Fragment)
        ).then(() => {
            shaderProgram.link();

            shaderProgram.enableVertexAttribArray("color");
            shaderProgram.enableVertexAttribArray("position");

            shaderProgram.use();

            result.resolve(webgl);
        }).fail(result.reject);
    });

    return result.promise();
}

window.onload = () => {
    var loadWebgl = setup().then(webgl => {
        
    }).fail(e => {
        alert("Error during setup");
    });
};