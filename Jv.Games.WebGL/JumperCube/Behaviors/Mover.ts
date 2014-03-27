///<reference path="../../Jv.Games.WebGL/GameObject.ts" />

module JumperCube.Behaviors {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class Mover extends Jv.Games.WebGL.Behavior<GameObject> {
        private apply: boolean = true;

        constructor(gameObject: GameObject, public args: { direction: Vector3; acceleration: boolean; continuous: boolean }) {
            super(gameObject);
        }

        update(deltaTime: number) {
            if (this.apply || this.args.continuous) {
                this.object.push(this.args.direction, !this.args.continuous, this.args.acceleration);
                this.apply = false;
            }
        }
    }
} 