///<reference path="Jv.Games.WebGL/references.ts" />
///<reference path="JumperCube/references.ts" />

module JumperCube {
    import WebGL = Jv.Games.WebGL.Core.WebGL;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Utils = Jv.Games.WebGL.Utils;
    import Camera = Jv.Games.WebGL.Camera;
    import Scene = Jv.Games.WebGL.Scene;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Components = Jv.Games.WebGL.Components;
    import Texture = Jv.Games.WebGL.Materials.Texture;

    import Behaviors = JumperCube.Behaviors;
    import Mover = Behaviors.Mover;

    export class Game {
        // -- Assets --
        textures: { [name: string]: (texture: Texture) => void };
        marioTexture: Texture;
        camera: Camera;
        scene: Scene;

        constructor(public webgl: WebGL) {
            this.textures = { "new-mario.png": t => this.marioTexture = t };
            this.camera = new Camera();
            this.updateCameraProjection();
        }

        loadAssets() {
            var waiting: JQueryPromise<Texture>[] = [];
            for (var prop in this.textures) {
                var name = prop;
                waiting.push(Game.LoadTexture(this.webgl.context, name).promise().then(this.textures[name]));
            }
            return <JQueryPromise<any>>$.when.apply(this, waiting);
        }

        init() {
            return this.loadAssets().then(() => {
                Jv.Games.WebGL.MeterSize = 3;
                Jv.Games.WebGL.Keyboard.init();

                this.scene = new Jv.Games.WebGL.Scene(this.webgl);
                this.scene.add(this.camera);
                this.camera.transform.position.z = 10;

                var floorHeight = -5;
                var marioHeadMesh = {
                    mesh: new JumperCube.Models.Mesh.MarioHead(this.webgl.context),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(this.webgl.context, this.marioTexture)
                };

                var platform = this.scene.add(new GameObject());
                platform.transform = platform.transform.translate(new Vector3(0, floorHeight - 0.126, 0));
                platform.add(MeshRenderer, { mesh: new JumperCube.Models.Mesh.Cube(30, 0.25, 30, this.webgl.context) });
                platform.add(Components.AxisAlignedBoxCollider, { radiusWidth: 15, radiusHeight: 0.125, radiusDepth: 15 });

                var player = this.scene.add(new JumperCube.Models.Mario(this.webgl.context, this.marioTexture));
                player.transform.y = floorHeight + 0.5;
                player.body.transform._rotateY(Math.PI / 2);
                player.add(Behaviors.Controller, { minJumpForce: 2.0, maxJumpForce: 4.9, moveForce: 20, camera: this.camera });

                var obstacle = this.scene.add(new GameObject());
                obstacle.transform.x = 14;
                obstacle.add(MeshRenderer, { mesh: new JumperCube.Models.Mesh.Cube(1, 1, 1, this.webgl.context) });
                obstacle.transform.y = floorHeight + 0.5;
                obstacle.add(Components.AxisAlignedBoxCollider);
                obstacle.add(Components.RigidBody);

                this.scene.init();

                this.camera.add(Components.RigidBody);
                this.camera.add(JumperCube.Behaviors.Follow, { target: player, speed: 0.7, minDistance: 10 });
                this.camera.add(JumperCube.Behaviors.LookAtObject, { target: player });
            });
        }

        run() {
            var maxDeltaTime = 1 / 4;
            return Utils.StartTick(dt => {
                if (dt > maxDeltaTime)
                    dt = maxDeltaTime;
                this.scene.update(dt);
                this.scene.draw();
            });
        }

        static LoadTexture(context: WebGLRenderingContext, url: string) {
            var def = $.Deferred<Texture>();
            var image = new Image();
            image.onload = () => {
                def.resolve(Texture.FromImage(context, image));
            };
            image.onerror = def.reject;
            image.src = url;
            return def;
        }

        updateCameraProjection() {
            this.camera.setPerspective(40, this.webgl.canvas.width / this.webgl.canvas.height, 1, 100)
        }
    }
}

// -- Page --

function matchWindowSize(canvas: HTMLCanvasElement, sizeChanged?: () => any) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (typeof sizeChanged !== "undefined")
            sizeChanged();
    }
    resizeCanvas();
}

$(document).ready(function () {
    var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
    var webgl = Jv.Games.WebGL.Core.WebGL.fromCanvas(canvas);
    var game = new JumperCube.Game(webgl);

    matchWindowSize(canvas, () => game.updateCameraProjection());

    game.init()
        .then(() => game.run())
        .fail(e => alert("Error: " + e.message));
});

