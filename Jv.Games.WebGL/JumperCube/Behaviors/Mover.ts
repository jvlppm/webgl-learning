///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Components/Physics.ts" />

module JumperCube.Behaviors {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Physics = Jv.Games.WebGL.Components.Physics;

    export class Mover extends Jv.Games.WebGL.Components.Component<GameObject> {
        private apply: boolean = true;
        private physics: Physics;
        direction: Vector3;
        acceleration = false;
        continuous = true;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
            this.physics = <Physics>object.getComponent(Physics);
        }

        update(deltaTime: number) {
            if (this.apply || this.continuous) {
                this.physics.push(this.direction, !this.continuous, this.acceleration);
                this.apply = false;
            }
        }
    }
} 