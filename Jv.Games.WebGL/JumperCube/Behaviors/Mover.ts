///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Behaviors/Physics.ts" />

module JumperCube.Behaviors {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Physics = Jv.Games.WebGL.Behaviors.Physics;

    export class Mover extends Jv.Games.WebGL.Behavior<GameObject> {
        private apply: boolean = true;
        physics: Physics;

        constructor(object: GameObject, public args: { direction: Vector3; acceleration: boolean; continuous: boolean }) {
            super(object);
            this.physics = <Physics>object.getBehavior(Physics);
            if (typeof this.physics === "undefined")
                throw new Error("Attached object does not have a physics component");
        }

        update(deltaTime: number) {
            if (this.apply || this.args.continuous) {
                this.physics.push(this.args.direction, !this.args.continuous, this.args.acceleration);
                this.apply = false;
            }
        }
    }
} 