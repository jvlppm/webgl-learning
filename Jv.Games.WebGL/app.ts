///<reference path="Scripts/typings/jquery/jquery.d.ts" />
///<reference path="Jv.Games.WebGL/Core/WebGL.ts" />

import WebGL = Jv.Games.WebGL.Core.WebGL;
import Matrix4 = Jv.Games.WebGL.Matrix4;
import Vector3 = Jv.Games.WebGL.Vector3;
import Utils = Jv.Games.WebGL.Utils;
import Mover = JumperCube.Behaviors.Mover;
import Camera = Jv.Games.WebGL.Camera;
import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
import GameObject = Jv.Games.WebGL.GameObject;
import Components = Jv.Games.WebGL.Components;
import Behaviors = JumperCube.Behaviors;

// -- Setup --

Jv.Games.WebGL.MeterSize = 3;

// -- Game --

var camera: Camera = new Camera();

function initGame(webgl: WebGL) {
    Jv.Games.WebGL.Keyboard.init();

    var scene = new Jv.Games.WebGL.Scene(webgl);
    scene.add(camera);
    camera.transform.position.z = 10;

    var floorHeight = -5;

    var platform = scene.add(new GameObject());
    platform.transform = platform.transform.translate(new Vector3(0, floorHeight - 0.126, 0));
    platform.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(30, 0.25, 3, webgl.context) });
    platform.add(Components.AxisAlignedBoxCollider, { radiusWidth: 15, radiusHeight: 0.125, radiusDepth: 1.5 });

    var jumperCube = scene.add(new GameObject());
    jumperCube.transform.x = -14;
    jumperCube.transform.y = floorHeight + 0.5;
    jumperCube.add(Components.AxisAlignedBoxCollider);
    jumperCube.add(Components.RigidBody);
    jumperCube.add(Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });
    jumperCube.add(Mover, { direction: new Vector3(1.5, 0, 0), acceleration: true, continuous: false });
    jumperCube.add(Behaviors.Controller, { jumpForce: 4.9, moveForce: 10 });

    var body = jumperCube.add(new GameObject());
    body.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(1, 1, 1, webgl.context) });
    body.add(Behaviors.RotateWhileJumping, { speed: 4 });

    var obstacle = scene.add(new GameObject());
    obstacle.transform.x = 14;
    obstacle.add(MeshRenderer, { mesh: new JumperCube.CubeMesh(1, 1, 1, webgl.context) });
    obstacle.transform.y = floorHeight + 0.5;
    obstacle.add(Components.AxisAlignedBoxCollider);
    obstacle.add(Components.RigidBody);

    scene.init();

    camera.add(JumperCube.Behaviors.LookAtObject, { target: jumperCube });

    var maxDeltaTime = 1 / 4;
    Utils.StartTick(dt => {
        if (dt > maxDeltaTime)
            dt = maxDeltaTime;
        scene.update(dt);
        scene.draw();
    });
}

function matchWindowSize(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        camera.setPerspective(40, canvas.width / canvas.height, 1, 100);
    }
    resizeCanvas();
}

$(document).ready(function () {
    try {
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
        matchWindowSize(canvas);
        initGame(WebGL.fromCanvas(canvas));
    }
    catch (e) {
        alert("Error: " + e.message)
    }
});
