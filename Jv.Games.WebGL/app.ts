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

    export interface TextureDescription {
        url: string;
        density?: number;
        tile?: boolean;
        attribute: string;
    }

    export class Game {
        // -- Assets --
        textures: TextureDescription[];
        marioTexture: Texture;
        goombaTexture: Texture;
        grassTexture: Texture;
        camera: Camera;
        scene: Scene;

        constructor(public webgl: WebGL) {
            this.textures = [
                { url: "new-mario.png", attribute: "marioTexture" },
                { url: "goomba.png", attribute: "goombaTexture" },
                { url: "grass.png", attribute: "grassTexture" }
            ];
            this.camera = new Camera();
            this.updateCameraProjection();
        }

        loadAssets() {
            var waiting: JQueryPromise<Texture>[] = [];
            this.textures.forEach(tD => {
                waiting.push(Game.LoadTexture(this.webgl.context, tD.url, tD.tile, tD.density)
                       .promise().then(t => this[tD.attribute] = t));
            });
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
                player.transform.y = 1.5;
                player.transform.z = 60;

                var goomba = this.scene.add(new JumperCube.Models.Goomba(this.webgl.context, this.goombaTexture))
                    .add(Behaviors.Follow, { target: player, minDistance: 0, maxDistance: 0, viewDistance: 4, speed: 0.5, stopSpeed: 1 });
                goomba.transform.z = 40;
                goomba.transform.y = 1;

                this.scene.add(this.camera);
                this.camera.transform.position.z = 65;
                this.camera.transform.position.y = 5;

                this.camera.add(Components.RigidBody, { friction: new Vector3(1, 0, 1) });
                this.camera.add(JumperCube.Behaviors.Follow, { target: player, minDistance: 4, maxDistance: 10, speed: 5 });
                this.camera.add(JumperCube.Behaviors.KeepAbove, { target: player, minDistance: 3, maxDistance: 7, speed: 1 });
                this.camera.add(JumperCube.Behaviors.LookAtObject, { target: player });

                this.createMap();

                this.scene.init();
            });
        }

        createMap() {
            this.createPlatform(this.grassTexture, 0, 40, 0, 80, 80, 10, false);

            this.createPlatform(this.marioTexture, -10, 50, 0, 5, 10, 3);
            this.createPlatform(this.marioTexture, -10, 40, 3, 5, 10, 0.5, false);
            this.createPlatform(this.marioTexture, -10, 30, 0, 5, 10, 5);
            this.createPlatform(this.marioTexture, 10, 40, 0, 5, 20, 200);
        }

        createUV(texture: Texture, w: number, h: number) {
            if (!texture.tile)
                return [0, 0, 1, 0, 1, 1, 0, 1];

            var tw = texture.image.naturalWidth || texture.image.width;
            var th = texture.image.naturalHeight || texture.image.height;

            var u = w / (tw / texture.density);
            var v = h / (th / texture.density);

            return [0, 0, u, 0, u, v, 0, v];
        }

        createPlatform(texture: Texture, x: number, z: number, y: number, w: number, d: number, h: number, alignBottom = true) {

            var xUV = this.createUV(texture, w, h);
            var yUV = this.createUV(texture, w, d);
            var zUV = this.createUV(texture, d, h);

            var platform = this.scene.add(new GameObject())
                .add(MeshRenderer, {
                    mesh: new JumperCube.Models.Mesh.TexturedCube(w, h, d, this.webgl.context, zUV, zUV, xUV, xUV, yUV, yUV),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(this.webgl.context, texture)
                })
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: w / 2, radiusHeight: h / 2, radiusDepth: d / 2 })
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

        static LoadTexture(context: WebGLRenderingContext, url: string, tile?: boolean, density?: number) {
            var def = $.Deferred<Texture>();
            var image = new Image();
            image.onload = () => {
                var width = image.naturalWidth || image.width;
                var height = image.naturalHeight || image.height;

                if (typeof tile === "undefined")
                    tile = width == height && ((width & (width - 1)) == 0);

                def.resolve(Texture.FromImage(context, image, tile, density));
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

