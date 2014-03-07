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

function loadWebGL() {
    var result = $.Deferred<WebGL.WebGL>();

    $(document).ready(function () {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
        matchWindowSize(canvas);
            
        var webgl = WebGL.WebGL.fromCanvas(canvas);
        var shaderProgram = webgl.createShaderProgram();

        var loadShader = function (name: string, type: WebGL.ShaderType) {
            return $.ajax("Shaders/" + name + ".glsl.txt").then(source => shaderProgram.addShader(type, source));
        };

        return $.when(
            loadShader("vertexShader", WebGL.ShaderType.Vertex),
            loadShader("fragmentShader", WebGL.ShaderType.Fragment)
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
    loadWebGL().then(webgl => {
        alert("success");
    }).fail(e => {
        alert("Error during setup");
    });
};