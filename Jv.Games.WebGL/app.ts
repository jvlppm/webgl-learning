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

    export interface PlatformDefinition {
        debug?: boolean;
        xAlign?: number;
        yAlign?: number;
        zAlign?: number
        collide?: boolean;
    }

    export class Game {
        // -- Assets --
        textures: TextureDescription[];
        marioTexture: Texture;
        goombaTexture: Texture;
        grassTexture: Texture;

        platformWhite: Texture;
        platformYellow: Texture;
        platformCyan: Texture;
        platformPink: Texture;
        platformGreen: Texture;

        blockEmpty: Texture;
        blockQuestion: Texture;
        blockSolid: Texture;
        blockBrick: Texture;
        blockFloor: Texture;

        itemMushroom: Texture;

        camera: Camera;
        scene: Scene;

        constructor(public webgl: WebGL) {
            this.textures = [
                { url: "Textures/new-mario.png", attribute: "marioTexture" },
                { url: "Textures/goomba.png", attribute: "goombaTexture" },
                { url: "Textures/grass.png", attribute: "grassTexture" },

                { url: "Textures/platform_white.png", attribute: "platformWhite" },
                { url: "Textures/platform_yellow.png", attribute: "platformYellow" },
                { url: "Textures/platform_cyan.png", attribute: "platformCyan" },
                { url: "Textures/platform_pink.png", attribute: "platformPink" },
                { url: "Textures/platform_green.png", attribute: "platformGreen" },

                { url: "Textures/block_empty.png", attribute: "blockEmpty", density: 128 },
                { url: "Textures/block_question.png", attribute: "blockQuestion", density: 128 },
                { url: "Textures/block_solid.png", attribute: "blockSolid", density: 128 },
                { url: "Textures/block_floor.png", attribute: "blockFloor", density: 128 },
                { url: "Textures/block_brick.png", attribute: "blockBrick" },

                { url: "Textures/item_mushroom.png", attribute: "itemMushroom" },

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

                var goombas: Vector3[] = [
                    new Vector3(-20, 63, 0)
                ];

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
                this.camera.add(Components.AxisAlignedBoxCollider);
                this.camera.add(JumperCube.Behaviors.Follow, { target: player, minDistance: 4, maxDistance: 10, speed: 5 });
                this.camera.add(JumperCube.Behaviors.KeepAbove, { target: player, minDistance: 3, maxDistance: 7, speed: 1 });
                this.camera.add(JumperCube.Behaviors.LookAtObject, { target: player });

                this.createMap();

                this.scene.init();
            });
        }

        createMap() {
            this.createPlatform(this.grassTexture, 0, 40, -0.0001, 80, 80, 10, { xAlign: 0.5, zAlign: 0.5, yAlign: 0 });

            this.createPlatform(this.platformCyan, -5, 50, 0, 15, 10, 4);
            this.createPlatform(this.platformPink, 5, 50, 0, 10, 4, 8);
            this.createPlatform(this.platformYellow, 10, 60, 0, 5, 10, 10);

            this.createPlatform(this.platformWhite, -5, 58, 0, 4, 8, 0.5);
            this.createPlatform(this.platformWhite, 5, 62, 0, 14, 4, 0.5);

            this.createPlatform(this.platformYellow, -35, 80, 0, 5, 20, 10);
            this.createPlatform(this.platformWhite, -35, 60, 0, 5, 20, 10);

            this.createQuestionBlock(-30, 60, 4, new JumperCube.Models.Mushroom(this.webgl.context, this.itemMushroom));
            this.createBrickBlock(-30, 61, 4);
            this.createBrickBlock(-30, 62, 4);
            this.createQuestionBlock(-30, 63, 4);
            this.createBrickBlock(-30, 64, 4);
            this.createBrickBlock(-30, 65, 4);
            this.createQuestionBlock(-30, 66, 4);

            this.createStairZm(this.blockSolid, -25, 56, 0, 4, 4);
            this.createPlatform(this.blockSolid, -25, 52, 3, 4, 8, 1);

            this.createPlatform(this.platformPink, -40, 40, 0, 10, 4, 4, { xAlign: 1 });
            this.createPlatform(this.platformGreen, -30, 40, 0, 5, 4, 4, { xAlign: 1 });
            this.createPlatform(this.platformPink, -25, 40, 0, 10, 4, 4, { xAlign: 1 });
            this.createPlatform(this.platformPink, -15, 40, 0, 10, 4, 2, { xAlign: 1 });
            this.createPlatform(this.blockFloor, -5, 46, 0, 12, 14, 1, { xAlign: 1 });

            var genius = this.scene.add(new Models.Genius(this.webgl.context, this.platformWhite, this.platformYellow, this.platformCyan, this.platformPink, this.platformGreen));
            genius.transform.x = 1;
            genius.transform.y = 1;
            genius.transform.z = 39;

            this.createPlatform(this.platformWhite, -40, 36, 0, 35, 4, 15, { xAlign: 1 });

            this.createStairX(this.blockSolid, 0, 10, 0, 8, 2);
        }

        createQuestionBlock(x: number, z: number, y: number, item?: GameObject) {
            var question = this.scene.add(new JumperCube.Models.ItemBlock(this.webgl.context, this.blockQuestion, this.blockEmpty));
            question.transform.x = x;
            question.transform.y = y;
            question.transform.z = z;
            question.item = item;
        }

        createBrickBlock(x: number, z: number, y: number) {
            var question = this.scene.add(new JumperCube.Models.BrickBlock(this.webgl.context, this.blockBrick));
            question.transform.x = x;
            question.transform.y = y;
            question.transform.z = z;
        }

        static createUV(texture: Texture, w: number, h: number) {
            if (!texture.tile)
                return [0, 0, 1, 0, 1, 1, 0, 1];

            var tw = texture.image.naturalWidth || texture.image.width;
            var th = texture.image.naturalHeight || texture.image.height;

            var u = w / (tw / texture.density);
            var v = h / (th / texture.density);

            return [0, 0, u, 0, u, v, 0, v];
        }

        createStairZm(texture: Texture, x: number, z: number, y: number, w: number, d: number) {
            for (var i = 0; i < d; i++) {
                this.createPlatform(texture, x, z - i, y + i, w, d - i, 1);
            }
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

        static loadDefaults<Type>(current: Type, defaults: Type) {
            if (typeof current === "undefined")
                return defaults;

            for (var prop in defaults)
                if (typeof current[prop] === "undefined")
                    current[prop] = defaults[prop];

            return current;
        }

        static createPlatform(context: WebGLRenderingContext, texture: Texture, x: number, z: number, y: number, w: number, d: number, h: number, args?: PlatformDefinition) {
            args = Game.loadDefaults(args, { debug: false, xAlign: 0, yAlign: 1, zAlign: 0, collide: true });

            var xUV = this.createUV(texture, d, h);
            var yUV = this.createUV(texture, w, d);
            var zUV = this.createUV(texture, w, h);

            var platform = new GameObject();

            var align = platform.add(new GameObject())
                .add(MeshRenderer, {
                    mesh: new JumperCube.Mesh.Cube(w, h, d, context, zUV, zUV, xUV, xUV, yUV, yUV),
                    material: new Jv.Games.WebGL.Materials.TextureMaterial(context, texture)
                });
            if (args.collide)
                align.add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: w / 2, radiusHeight: h / 2, radiusDepth: d / 2 });

            align.transform.x = - w / 2 + w * args.xAlign;
            align.transform.z = - d / 2 + d * args.zAlign;
            align.transform.y = - h / 2 + h * args.yAlign;

            platform.transform.x = x;
            platform.transform.z = z;
            platform.transform.y = y;

            if (args.debug) {
                platform.add(Behaviors.DebugPosition, { speed: new Vector3(w, h, d).length() * 0.1 });
            }
            return platform;
        }

        createPlatform(texture: Texture, x: number, z: number, y: number, w: number, d: number, h: number, args?: PlatformDefinition) {
            this.scene.add(Game.createPlatform(this.webgl.context, texture, x, z, y, w, d, h, args));
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

