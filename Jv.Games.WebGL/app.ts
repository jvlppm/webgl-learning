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
        goombaTexture: Texture;
        camera: Camera;
        scene: Scene;

        constructor(public webgl: WebGL) {
            this.textures = {
                "new-mario.png": t => this.marioTexture = t,
                "goomba.png": t => this.goombaTexture = t,
            };
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

                var marioHeadMesh = {
                    mesh: new JumperCube.Models.Mesh.MarioHead(this.webgl.context),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(this.webgl.context, this.marioTexture)
                };

                var player = this.scene.add(new JumperCube.Models.Mario(this.webgl.context, this.marioTexture));
                player.add(Behaviors.Controller, { minJumpForce: 2.0, maxJumpForce: 4.91, moveForce: 20, camera: this.camera });
                player.transform.y = 1;
                player.transform.z = 60;

                var goomba = this.scene.add(new JumperCube.Models.Goomba(this.webgl.context, this.goombaTexture))
                    .add(Behaviors.Follow, { target: player, minDistance: 0, maxDistance: 0, viewDistance: 4, speed: 0.5, stopSpeed: 1 });
                goomba.transform.z = 40;
                goomba.transform.y = 0.5;

                this.scene.add(this.camera);
                this.camera.transform.position.z = 65;
                this.camera.transform.position.y = 5;

                this.camera.add(Components.RigidBody, { friction: new Vector3(0.90, 1, 0.90) });
                this.camera.add(JumperCube.Behaviors.Follow, { target: player, minDistance: 4, maxDistance: 10, speed: 5 });
                this.camera.add(JumperCube.Behaviors.KeepAbove, { target: player, minDistance: 3, maxDistance: 7, speed: 1 });
                this.camera.add(JumperCube.Behaviors.LookAtObject, { target: player });

                this.createMap();

                this.scene.init();
            });
        }

        createMap() {

            var floor = this.scene.add(new GameObject())
                .add(MeshRenderer, { mesh: new JumperCube.Models.Mesh.Cube(160, 0.25, 160, this.webgl.context) })
                .add(Components.AxisAlignedBoxCollider, { radiusWidth: 80, radiusHeight: 0.125, radiusDepth: 80 });
            floor.transform = floor.transform.translate(new Vector3(0, -0.25, 0));

            this.createPlatform(-10, 50, 0, 5, 10, 3);
            this.createPlatform(-10, 40, 3, 5, 10, 0.5, false);
            this.createPlatform(10, 40, 0, 5, 20, 200);
        }

        createPlatform(x: number, z: number, y: number, w: number, d: number, h: number, alignBottom = true) {
            var platform = this.scene.add(new GameObject())
                .add(MeshRenderer, { mesh: new JumperCube.Models.Mesh.Cube(w, h, d, this.webgl.context) })
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: w/2, radiusHeight: h/2, radiusDepth: d/2 })
            ;

            platform.transform.x = x;
            platform.transform.z = z;
            platform.transform.y = h / 2 + (alignBottom ? y : y - h);
        }

        run() {
            var maxDeltaTime = 1 / 8;
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

