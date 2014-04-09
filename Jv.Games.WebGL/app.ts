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

        whitePlatform: Texture;
        yellowPlatform: Texture;
        cyanPlatform: Texture;
        pinkPlatform: Texture;

        blockEmpty: Texture;
        blockQuestion: Texture;
        blockSolid: Texture;

        camera: Camera;
        scene: Scene;

        constructor(public webgl: WebGL) {
            this.textures = [
                { url: "Textures/new-mario.png", attribute: "marioTexture" },
                { url: "Textures/goomba.png", attribute: "goombaTexture" },
                { url: "Textures/grass.png", attribute: "grassTexture" },

                { url: "Textures/white_platform.png", attribute: "whitePlatform" },
                { url: "Textures/yellow_platform.png", attribute: "yellowPlatform" },
                { url: "Textures/cyan_platform.png", attribute: "cyanPlatform" },
                { url: "Textures/pink_platform.png", attribute: "pinkPlatform" },

                { url: "Textures/block_empty.png", attribute: "blockEmpty", density: 128 },
                { url: "Textures/block_question.png", attribute: "blockQuestion", density: 128 },
                { url: "Textures/block_solid.png", attribute: "blockSolid", density: 128 },

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
                    mesh: new JumperCube.Mesh.MarioHead(this.webgl.context),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(this.webgl.context, this.marioTexture)
                };

                var player = this.scene.add(new JumperCube.Models.Mario(this.webgl.context, this.marioTexture));
                player.add(Behaviors.Controller, { minJumpForce: 2.0, maxJumpForce: 4.91, moveForce: 20, camera: this.camera });
                player.transform.y = 1.5;
                player.transform.z = 55;

                var goombas: Vector3[] = [new Vector3(-20, 63, 0)];

                goombas.forEach(g => {
                    var goomba = this.scene.add(new JumperCube.Models.Goomba(this.webgl.context, this.goombaTexture))
                        .add(Behaviors.Follow, { target: player, minDistance: 0, maxDistance: 0, viewDistance: 8, speed: 0.5, stopSpeed: 1 });
                    goomba.transform.x = g.x;
                    goomba.transform.z = g.y;
                    goomba.transform.y = g.z + 0.6;
                });

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
            this.createPlatform(this.grassTexture, -0.0001, 40, 0, 80, 80, 10, { xAlign: 0.5, zAlign: 0.5, yAlign: 0 });

            this.createPlatform(this.cyanPlatform, -5, 50, 0, 15, 10, 5);
            this.createPlatform(this.pinkPlatform, 5, 50, 0, 10, 4, 8);
            this.createPlatform(this.yellowPlatform, 10, 60, 0, 5, 20, 10);

            this.createPlatform(this.whitePlatform, -5, 58, 0, 4, 8, 1, { debug: true });
            this.createPlatform(this.whitePlatform, 5, 62, 0, 14, 4, 1);

            this.createStairX(this.blockSolid, 0, 10, 0, 8, 2);
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

        createStairZ(texture: Texture, x: number, z: number, y: number, w: number, d: number) {
            for (var i = 0; i < d; i++) {
                this.createPlatform(texture, x, z, y + i, w, d - i, 1);
            }
        }

        createStairX(texture: Texture, x: number, z: number, y: number, w: number, d: number) {
            for (var i = 0; i < w; i++) {
                this.createPlatform(texture, x, z, y + i, w - i, d, 1);
            }
        }

        createPlatform(texture: Texture, x: number, z: number, y: number, w: number, d: number, h: number, args?: { debug?: boolean; xAlign?: number; yAlign?: number; zAlign?: number }) {
            args = args || {};
            var defaultArgs = { debug: false, xAlign: 0, yAlign: 1, zAlign: 0 };
            for (var prop in defaultArgs)
                if (typeof args[prop] === "undefined")
                    args[prop] = defaultArgs[prop];

            var xUV = this.createUV(texture, d, h);
            var yUV = this.createUV(texture, w, d);
            var zUV = this.createUV(texture, w, h);

            var platform = this.scene.add(new GameObject());

            var align = platform.add(new GameObject())
                .add(MeshRenderer, {
                    mesh: new JumperCube.Mesh.TexturedCube(w, h, d, this.webgl.context, zUV, zUV, xUV, xUV, yUV, yUV),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(this.webgl.context, texture)
                })
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: w / 2, radiusHeight: h / 2, radiusDepth: d / 2 })
            ;

            align.transform.x = - w / 2 + w * args.xAlign;
            align.transform.z = - d / 2 + d * args.zAlign;
            align.transform.y = - h / 2 + h * args.yAlign;

            platform.transform.x = x;
            platform.transform.z = z;
            platform.transform.y = y;

            if (args.debug) {
                platform.add(Behaviors.DebugPosition, { speed: new Vector3(w, h, d).length() * 0.1 });
            }
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

