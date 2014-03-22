///<reference path="Scripts/typings/jquery/jquery.d.ts" />
import WebGL = Jv.Games.WebGL;

var webgl: WebGL.WebGL;

var color: WebGL.VertexAttribute;
var position: WebGL.VertexAttribute;

var pMatrix: WebGL.Uniform;
var vMatrix: WebGL.Uniform;
var mMatrix: WebGL.Uniform;

function loadWebGL() {
    var result = $.Deferred();

    $(document).ready(function () {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
            
        webgl = WebGL.WebGL.fromCanvas(canvas);
        var shaderProgram = webgl.createShaderProgram();

        var loadShader = function (name: string, type: WebGL.ShaderType) {
            return $.ajax("Shaders/" + name + ".glsl.txt", { dataType: "text" })
                    .then(source => shaderProgram.addShader(type, source));
        };

        return $.when(
            loadShader("vertexShader", WebGL.ShaderType.Vertex),
            loadShader("fragmentShader", WebGL.ShaderType.Fragment)
        ).then(() => {
            shaderProgram.link();

            color = shaderProgram.getVertexAttribute("color");
            position = shaderProgram.getVertexAttribute("position");

            pMatrix = shaderProgram.getUniform("Pmatrix");
            vMatrix = shaderProgram.getUniform("Vmatrix");
            mMatrix = shaderProgram.getUniform("Mmatrix");

            shaderProgram.use();

            result.resolve();
        }).fail(result.reject);
    });

    return result.promise();
}

window.onload = () => {
    loadWebGL().then(() => {
        alert("success");
    }).fail(e => {
        alert("Error during setup " + e);
    });
};