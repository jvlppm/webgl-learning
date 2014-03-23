///<reference path="Scripts/typings/jquery/jquery.d.ts" />

import WebGL = Jv.Games.WebGL;
import Matrix = Jv.Games.WebGL.Matrix;
import Mesh = Jv.Games.WebGL.Mesh;
import MeshRenderMode = Jv.Games.WebGL.MeshRenderMode;
import DataType = Jv.Games.WebGL.DataType;
import Utils = JumperCube.Utils;

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
            loadShader("fragmentShader", WebGL.ShaderType.Fragment))
        .fail(result.reject)
        .done(() => {
            try {
                shaderProgram.link();

                color = shaderProgram.getVertexAttribute("color");
                position = shaderProgram.getVertexAttribute("position");

                shaderProjectionMatrix = shaderProgram.getUniform("Pmatrix");
                shaderViewMatrix = shaderProgram.getUniform("Vmatrix");
                shaderMoveMatrix = shaderProgram.getUniform("Mmatrix");

                shaderProgram.use();

                result.resolve();
            }
            catch (E) { result.reject(E); }
        });
    });

    return result.promise();
}

// -- Game --

var cube: JumperCube.CubeMesh;
viewMatrixData.translateZ(-40);
viewMatrixData.translateX(-15);

var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function init() {
    var gl = webgl.context;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;

    cube = new JumperCube.CubeMesh(1, 1, 1, webgl.context);
    position.setPointer(3, DataType.Float, false, 4 * (3 + 3), 0);
    color.setPointer(3, DataType.Float, false, 4 * (3 + 3), 3 * 4);
}

function tick(dt: number): void {
    var gl = webgl.context;

    moveMatrixData.rotateZ(dt * -0.005);
    moveMatrixData.translateX(dt * 0.001);

    webgl.clear();

    shaderProjectionMatrix.setMatrix4(projMatrixData.data);
    shaderViewMatrix.setMatrix4(viewMatrixData.data);
    shaderMoveMatrix.setMatrix4(moveMatrixData.data);

    cube.draw();

    gl.flush();
}

loadWebGL()
    .done(init)
    .done(() => Utils.StartTick(tick))
    .fail(e => alert("Error during setup " + e.message));