module JumperCube.Models {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Texture = Jv.Games.WebGL.Materials.Texture;
    import Trigger = JumperCube.Trigger;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Collider = Jv.Games.WebGL.Components.Collider;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import TextureMaterial = Jv.Games.WebGL.Materials.TextureMaterial;

    export class Genius extends GameObject {
        sequence: number[];
        private currentIndex = 0;
        private beepDuration = 1;
        private currentBeepDuration = 0;
        private playing = true;
        private delayToPlayNextDuration = 0.5;
        private currentDelayToPlayNext = 0.5;

        private buttons: GameObject[];
        private colors: Texture[];
        private materials: TextureMaterial[];

        constructor(context: WebGLRenderingContext, public texturebase: Texture, active1: Texture, active2: Texture, active3: Texture, active4: Texture) {
            super();
            var alignCenter = { xAlign: 0.5, zAlign: 0.5 };

            this.buttons = [this.add(Game.createPlatform(context, texturebase, -1.5, -1.5, 3, 1, 1, 1, alignCenter)),
                this.add(Game.createPlatform(context, texturebase, -1.5, 1.5, 3, 1, 1, 1, alignCenter)),
                this.add(Game.createPlatform(context, texturebase, 1.5, -1.5, 3, 1, 1, 1, alignCenter)),
                this.add(Game.createPlatform(context, texturebase, 1.5, 1.5, 3, 1, 1, 1, alignCenter))];

            this.add(new Trigger(c => this.activate(c, 0), 1, 0.5, 1, new Vector3(-1.5, 2.5, -1.5)));
            this.add(new Trigger(c => this.activate(c, 1), 1, 0.5, 1, new Vector3(-1.5, 2.5, 1.5)));
            this.add(new Trigger(c => this.activate(c, 2), 1, 0.5, 1, new Vector3(1.5, 2.5, -1.5)));
            this.add(new Trigger(c => this.activate(c, 3), 1, 0.5, 1, new Vector3(1.5, 2.5, 1.5)));

            this.add(Game.createPlatform(context, active1, -1.5, -1.5, 0.001, 2, 2, 1, { xAlign: 0.5, yAlign: 0, zAlign: 0.5, collide: false }));
            this.add(Game.createPlatform(context, active2, -1.5, 1.5, 0.001, 2, 2, 1, { xAlign: 0.5, yAlign: 0, zAlign: 0.5, collide: false }));
            this.add(Game.createPlatform(context, active3, 1.5, -1.5, 0.001, 2, 2, 1, { xAlign: 0.5, yAlign: 0, zAlign: 0.5, collide: false }));
            this.add(Game.createPlatform(context, active4, 1.5, 1.5, 0.001, 2, 2, 1, { xAlign: 0.5, yAlign: 0, zAlign: 0.5, collide: false }));

            this.sequence = [Math.floor(Math.random() * 4)];
            this.currentBeepDuration = this.beepDuration;

            this.colors = [active1, active2, active3, active4];
            this.materials = this.buttons.map(b => (<TextureMaterial>(<MeshRenderer>b.searchComponent(MeshRenderer)).material));
        }

        private activate(collider: Collider, button: number) {
            if (this.playing || this.isActive(button) || collider.object.tag !== "player" || this.currentIndex < 0 || this.currentIndex >= this.sequence.length)
                return;

            for(var i = 0; i < this.buttons.length; i++)
                this.setActive(i, i === button);
            this.currentBeepDuration = this.beepDuration;

            if (this.sequence[this.currentIndex] !== button) {
                this.sequence = [button];
                this.currentIndex = 1;
            }
            else {
                this.currentIndex++;
            }
        }

        setActive(index: number, value: boolean) {
            this.materials[index].texture = value ? this.colors[index] : this.texturebase;
        }

        isActive(index: number) {
            return this.materials[index].texture !== this.texturebase;
        }

        update(deltaTime: number) {
            if (this.playing) {
                if (this.currentDelayToPlayNext > 0) {
                    this.currentDelayToPlayNext -= deltaTime;
                    if (this.currentDelayToPlayNext < 0 && this.currentIndex >= 0 && this.currentIndex < this.sequence.length) {
                        this.setActive(this.sequence[this.currentIndex], true);
                        this.currentBeepDuration = this.beepDuration;
                    }
                    return;
                }

                this.currentBeepDuration -= deltaTime;

                if (this.currentBeepDuration <= 0) {
                    this.setActive(this.sequence[this.currentIndex], false);
                    this.currentIndex++;
                }

                if (this.currentIndex >= this.sequence.length) {
                    this.playing = false;
                    this.currentIndex = 0;
                }
                else if (this.currentBeepDuration < 0) this.currentDelayToPlayNext = this.delayToPlayNextDuration;
            }
            else if (this.currentBeepDuration > 0) {
                this.currentBeepDuration -= deltaTime;
                if (this.currentBeepDuration <= 0) {
                    if (this.sequence.length >= this.currentIndex && this.currentIndex > 0)
                        this.setActive(this.sequence[this.currentIndex - 1], false);

                    if (this.currentIndex >= this.sequence.length) {
                        this.sequence.push(Math.floor(Math.random() * 4));
                        this.currentIndex = 0;
                        this.playing = true;
                        this.currentDelayToPlayNext = this.delayToPlayNextDuration;
                    }
                }
            }
        }
    }
}
