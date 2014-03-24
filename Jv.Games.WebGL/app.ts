///<reference path="Scripts/typings/jquery/jquery.d.ts" />
///<reference path="Jv.Games.WebGL/Matrix.ts" />

import WebGL = Jv.Games.WebGL;
import Matrix = Jv.Games.WebGL.Matrix;
import Mesh = Jv.Games.WebGL.Mesh;
import MeshRenderMode = Jv.Games.WebGL.MeshRenderMode;
import DataType = Jv.Games.WebGL.DataType;
import Vector3 = Jv.Games.WebGL.Vector3;
import Utils = JumperCube.Utils;
import Keyboard = JumperCube.Keyboard;
import Key = JumperCube.Key;
import Mover = JumperCube.Components.Mover;

// -- Setup --

var webgl: WebGL.WebGL;

var color: WebGL.VertexAttribute;
var position: WebGL.VertexAttribute;

var shaderProjectionMatrix: WebGL.Uniform;
var shaderViewMatrix: WebGL.Uniform;
var shaderMoveMatrix: WebGL.Uniform;

var projMatrixData = Matrix.Identity();
var viewMatrixData = Matrix.Identity();

function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        projMatrixData = Matrix.Perspective(40, canvas.width / canvas.height, 1, 100);
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

var objects: JumperCube.GameObject[];
viewMatrixData.translateZ(-20);

function init() {
    var gl = webgl.context;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    Keyboard.init();

    objects = [];
    objects.push(new JumperCube.GameObject(new JumperCube.CubeMesh(1, 1, 1, webgl.context)));
        objects[0].components.push(new Mover(objects[0], new Vector3(0, -9.8, 0), true, true));
    objects[0].components.push(new Mover(objects[0], new Vector3(1, 0, 0), true, false));

    objects.push(new JumperCube.GameObject(new JumperCube.CubeMesh(30, 0.25, 1, webgl.context)));
    objects[1].transform.translateY(-10.5 - 0.125);
}

function tick(dt: number): void {
    var gl = webgl.context;

    webgl.clear();

    shaderProjectionMatrix.setMatrix4(projMatrixData.data);
    shaderViewMatrix.setMatrix4(viewMatrixData.data);

    move(objects[0]);

    objects.forEach(obj => {
        obj.update(dt);
        draw(obj);
    });

    gl.flush();
}

function draw(gameObject: JumperCube.GameObject) {
    var gl = webgl.context;

    shaderMoveMatrix.setMatrix4(gameObject.transform.data);

    gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.mesh.vertexBuffer);
    position.setPointer(3, DataType.Float, false, 4 * (3 + 3), 0);
    color.setPointer(3, DataType.Float, false, 4 * (3 + 3), 3 * 4);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gameObject.mesh.indexBuffer);
    gl.drawElements(gameObject.mesh.renderModeId, gameObject.mesh.elementCount, gl.UNSIGNED_SHORT, 0);
}

function move(obj: JumperCube.GameObject) {
    if (obj.momentum.y <= 0 && obj.transform.y <= -10) {
        obj.momentum.y = 0;
        obj.transform.y = -10;

        if (Keyboard.isKeyDown(Key.Up))
            obj.push(new Vector3(0, 5, 0), true, true);
    }

    if (Keyboard.isKeyDown(Key.Right))
        obj.push(new Vector3(10, 0, 0));
    if (Keyboard.isKeyDown(Key.Left))
        obj.push(new Vector3(-10, 0, 0));
}

loadWebGL()
    .done(init)
    .done(() => Utils.StartTick(tick))
    .fail(e => alert("Error: " + e.message));