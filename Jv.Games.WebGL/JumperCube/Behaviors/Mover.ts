///<reference path="../../Jv.Games.WebGL/GameObject.ts" />

module JumperCube.Behaviors {
    import Behavior = Jv.Games.WebGL.Behavior;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class Mover extends Behavior {
        private apply: boolean = true;

        constructor(gameObject: GameObject, public args: { direction: Vector3; acceleration: boolean; continuous: boolean }) {
            super(gameObject);
        }

        update(deltaTime: number) {
            if (this.apply || this.args.continuous) {
                this.gameObject.push(this.args.direction, !this.args.continuous, this.args.acceleration);
                this.apply = false;
            }
        }
    }
} 