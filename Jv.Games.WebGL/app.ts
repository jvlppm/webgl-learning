///<reference path="Scripts/typings/jquery/jquery.d.ts" />
///<reference path="Jv.Games.WebGL/Core/WebGL.ts" />

import WebGL = Jv.Games.WebGL.Core.WebGL;
import ShaderType = Jv.Games.WebGL.Core.ShaderType;
import Matrix4 = Jv.Games.WebGL.Matrix4;
import Vector3 = Jv.Games.WebGL.Vector3;
import Utils = Jv.Games.WebGL.Utils;
import Keyboard = Jv.Games.WebGL.Keyboard;
import Key = Jv.Games.WebGL.Key;
import Mover = JumperCube.Behaviors.Mover;
import Camera = Jv.Games.WebGL.Camera;

// -- Setup --

Jv.Games.WebGL.MeterSize = 10;

var webgl: WebGL;

var shaderProgram: WebGL.Core.ShaderProgram;
var shaderProjectionMatrix: WebGL.Core.Uniform;
var shaderViewMatrix: WebGL.Core.Uniform;

//var projMatrix = Matrix4.Identity();


function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        camera = Camera.Perspective(40, canvas.width / canvas.height, 1, 100);
        //projMatrix = Matrix4.Perspective(40, canvas.width / canvas.height, 1, 100);
    }
    resizeCanvas();
}

function loadWebGL() {
    var result = $.Deferred();

    $(document).ready(function () {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
        matchWindowSize(canvas);

        webgl = WebGL.fromCanvas(canvas);
        shaderProgram = webgl.createShaderProgram();

        var loadShader = function (name: string, type: WebGL.Core.ShaderType) {
            return $.ajax("Shaders/" + name + ".glsl.txt", { dataType: "text" })
                .then(source => shaderProgram.addShader(type, source));
        };

        return $.when(
            loadShader("vertexShader", ShaderType.Vertex),
            loadShader("fragmentShader", ShaderType.Fragment))
        .fail(result.reject)
        .done(() => {
            try {
                shaderProgram.link();
                shaderProgram.enableVertexAttribute("color");
                shaderProgram.enableVertexAttribute("position");

                shaderProjectionMatrix = shaderProgram.getUniform("Pmatrix");
                shaderViewMatrix = shaderProgram.getUniform("Vmatrix");
                shaderProgram.use();

                result.resolve();
            }
            catch (E) {
                result.reject(E);
            }
        });
    });

    return result;
}

// -- Game --

var scene = new Jv.Games.WebGL.Scene();
var camera: Camera;

function init() {
    var gl = webgl.context;
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.0);

    Keyboard.init();

    var platform = new Jv.Games.WebGL.GameObject(new JumperCube.CubeMesh(30, 0.25, 5, webgl.context));
    platform.transform = platform.transform.translate(new Vector3(0, -10.5 - 0.125, 0));

    var jumperCube = new Jv.Games.WebGL.GameObject(new JumperCube.CubeMesh(1, 1, 1, webgl.context));
    jumperCube.add(Mover, { direction: new Vector3(0, -9.8 , 0), acceleration: true, continuous: true });
    jumperCube.add(Mover, { direction: new Vector3(1, 0, 0), acceleration: true, continuous: false });

    scene.add(jumperCube);
    scene.add(platform);

    Utils.StartTick(tick);
}

function tick(dt: number): void {
    var gl = webgl.context;

    webgl.clear();

    shaderProjectionMatrix.setMatrix4(camera.projection.data);
    shaderViewMatrix.setMatrix4(Matrix4.LookAt(new Vector3(0, 0, 20), scene.objects[0].transform.position).data);

    //move(scene.objects[0]);

    scene.update(dt);
    scene.draw(shaderProgram);

    gl.flush();
}

function move(obj: Jv.Games.WebGL.GameObject) {
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

var loadTask = loadWebGL();
loadTask.fail(e => alert("Error: " + e.message));
loadTask.done(init);
