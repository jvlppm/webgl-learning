///<reference path="Scripts/typings/jquery/jquery.d.ts" />
///<reference path="Jv.Games.WebGL/Core/WebGL.ts" />

import WebGL = Jv.Games.WebGL.Core.WebGL;
import ShaderType = Jv.Games.WebGL.Core.ShaderType;
import Matrix4 = Jv.Games.WebGL.Matrix4;
import Vector3 = Jv.Games.WebGL.Vector3;
import Utils = Jv.Games.WebGL.Utils;
import Key = Jv.Games.WebGL.Key;
import Mover = JumperCube.Behaviors.Mover;
import Camera = Jv.Games.WebGL.Camera;
import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

// -- Setup --

Jv.Games.WebGL.MeterSize = 3;

var webgl: WebGL;
var shaderProgram: WebGL.Core.ShaderProgram;

function init() {
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
                shaderProgram.use();

                initGame();

                result.resolve();
            }
            catch (E) {
                result.reject(E);
            }
        });
    });

    return result;
}

function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        camera = Camera.Perspective(40, canvas.width / canvas.height, 1, 100);
    }
    resizeCanvas();
}

// -- Game --

var camera: Camera;
var jumperCube: Jv.Games.WebGL.GameObject;

function initGame() {
    Jv.Games.WebGL.Keyboard.init();

    var scene = new Jv.Games.WebGL.Scene(webgl);
    scene.add(camera);

    var floorHeight = -5;

    var platform = scene.add(new Jv.Games.WebGL.GameObject());
    platform.transform = platform.transform.translate(new Vector3(0, floorHeight - 0.126, 0));
    platform.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(30, 0.25, 3, webgl.context), shader: shaderProgram });
    platform.add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: 15, radiusHeight: 0.125, radiusDepth: 1.5 });

    jumperCube = scene.add(new Jv.Games.WebGL.GameObject());
    jumperCube.transform.x = -14;
    jumperCube.transform.y = floorHeight + 0.5;
    jumperCube.add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider);
    jumperCube.add(Jv.Games.WebGL.Components.RigidBody);
    jumperCube.add(Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });
    jumperCube.add(Mover, { direction: new Vector3(1.5, 0, 0), acceleration: true, continuous: false });
    jumperCube.add(JumperCube.Behaviors.Controller, { jumpForce: 5, moveForce: 10 });

    var body = jumperCube.add(new Jv.Games.WebGL.GameObject());
    body.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(1, 1, 1, webgl.context), shader: shaderProgram });
    body.add(JumperCube.Behaviors.RotateWhileJumping, { speed: -6 });

    /*var obstacle = scene.add(new Jv.Games.WebGL.GameObject());
    obstacle.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(1, 1, 1, webgl.context), shader: shaderProgram });
    obstacle.transform.y = floorHeight + 0.5;
    obstacle.add(Jv.Games.WebGL.Components.SphereCollider);
    obstacle.add(Jv.Games.WebGL.Components.RigidBody);*/
    
    scene.init();

    Utils.StartTick(dt => {
        scene.update(dt);
        camera.transform = Matrix4.LookAt(new Vector3(0, 0, 10), jumperCube.transform.position);
        scene.draw();
    });
}

init().fail(e => alert("Error: " + e.message));
