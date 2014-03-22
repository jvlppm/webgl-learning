///<reference path="Scripts/typings/jquery/jquery.d.ts" />

import WebGL = Jv.Games.WebGL;
import Matrix = Jv.Games.WebGL.Matrix;
import Mesh = Jv.Games.WebGL.Mesh;
import MeshRenderMode = Jv.Games.WebGL.MeshRenderMode;
import DataType = Jv.Games.WebGL.DataType;

// -- Setup --

var webgl: WebGL.WebGL;

var color: WebGL.VertexAttribute;
var position: WebGL.VertexAttribute;

var shaderProjectionMatrix: WebGL.Uniform;
var shaderViewMatrix: WebGL.Uniform;
var shaderMoveMatrix: WebGL.Uniform;

var projMatrixData = Matrix.Identity();
var moveMatrixData = Matrix.Identity();
var viewMatrixData = Matrix.Identity();

function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        projMatrixData = Matrix.Projection(40, canvas.width / canvas.height, 1, 100);
    }
    resizeCanvas();
}

function loadWebGL() {
    var result = $.Deferred();

    $(document).ready(function () {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
        matchWindowSize(canvas);

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

var cube: Mesh;
viewMatrixData.translateZ(-5);

function init() {
    var gl = webgl.context;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    cube = new Mesh(webgl.context);
    //x -> direita
    //y -> cima
    //z -> perto
    cube.vertex = [
        -1.0, -1.0, 1.0,
        0, 0, 1,

        1.0, -1.0, 1.0,
        1, 0, 1,

        -1.0, 1.0, 1.0,
        0, 1, 1,

        1.0, 1.0, 1.0,
        1, 1, 1,

        -1.0, -1.0, -1.0,
        0, 0, 0,

        1.0, -1.0, -1.0,
        1, 0, 0,

        -1.0, 1.0, -1.0,
        0, 1, 0,

        1.0, 1.0, -1.0,
        1, 1, 0
    ];
    cube.index = [0, 1, 2, 3, 7, 1, 5, 4, 7, 6, 2, 4, 0, 1];

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

    moveMatrixData.rotateX(dt * 0.0003);
    moveMatrixData.rotateY(dt * 0.0004);
    moveMatrixData.rotateZ(dt * 0.0005);

    webgl.clear();
    shaderProjectionMatrix.setMatrix4(projMatrixData.data);
    shaderViewMatrix.setMatrix4(viewMatrixData.data);
    shaderMoveMatrix.setMatrix4(moveMatrixData.data);

    position.setPointer(3, DataType.Float, false, 4 * (3 + 3), 0);
    color.setPointer(3, DataType.Float, false, 4 * (3 + 3), 3 * 4);

    cube.draw();

    gl.flush();
}

$(document).ready(() => {
    var loadWebGLTask = loadWebGL();
    loadWebGLTask.fail(e => {
        alert("Error during loadWebGL " + e);
    });

    var initTask = loadWebGLTask.then(init);
    initTask.fail(e => {
        alert("Error during init " + e);
    });
});
