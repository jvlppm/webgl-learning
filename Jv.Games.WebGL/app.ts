///<reference path="Scripts/typings/jquery/jquery.d.ts" />
import WebGL = Jv.Games.WebGL;
import Matrix = Jv.Games.WebGL.Matrix;
import Mesh = Jv.Games.WebGL.Mesh;
import MeshRenderMode = Jv.Games.WebGL.MeshRenderMode;

// -- Setup --

var webgl: WebGL.WebGL;

var color: WebGL.VertexAttribute;
var position: WebGL.VertexAttribute;

var shaderProjectionMatrix: WebGL.Uniform;
var shaderViewMatrix: WebGL.Uniform;
var shaderMoveMatrix: WebGL.Uniform;

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

            shaderProjectionMatrix = shaderProgram.getUniform("Pmatrix");
            shaderViewMatrix = shaderProgram.getUniform("Vmatrix");
            shaderMoveMatrix = shaderProgram.getUniform("Mmatrix");

            shaderProgram.use();

            result.resolve();
        }).fail(result.reject);
    });

    return result.promise();
}

// -- Game --

var triangle: Mesh;
var moveMatrixData : Matrix;
var projMatrixData: Matrix;
var viewMatrixData: Matrix;

function init() {
    webgl.context.clearColor(0, 0, 0, 1);

    triangle = new Mesh(webgl.context);
    triangle.vertex = [
        -1, -1, 0,
        0, 0, 1,
        1, -1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 0, 0
    ];
    triangle.index = [0, 1, 2];

    var oldTime = 0;
    var drawLoop = (time) => {
        var deltaTime = time - oldTime;
        oldTime = time;
        draw(deltaTime);
        window.requestAnimationFrame(drawLoop);
    };
    drawLoop(0);
}

function draw(dt: number) {
    var gl = webgl.context;

    moveMatrixData.rotateZ(dt * 0.005);
    moveMatrixData.rotateY(dt * 0.004);
    moveMatrixData.rotateX(dt * 0.003);

    webgl.clear();
    shaderProjectionMatrix.setMatrix4(projMatrixData.data);
    shaderViewMatrix.setMatrix4(viewMatrixData.data);
    shaderMoveMatrix.setMatrix4(moveMatrixData.data);

    position.setPointer(3, gl.FLOAT, false, 4 * (3 + 3), 0);
    color.setPointer(3, gl.FLOAT, false, 4 * (3 + 3), 3 * 4);

    triangle.draw();

    gl.flush();
}

$(() => {
    var loadWebGL = loadWebGL();
    loadWebGL.fail(e => {
        alert("Error during loadWebGL " + e);
    });

    var init = loadWebGL.then(init);
    init.fail(e => {
        alert("Error during init " + e);
    });
});


// cada objeto terá um index buffer, um vertex buffer e o moveMatrix
// indexBuffer -> ELEMENT_ARRAY_BUFFER
// vertexBuffer -> ARRAY_BUFFER
// [children]