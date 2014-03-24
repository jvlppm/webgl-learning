///<reference path="../GameObject.ts" />

module JumperCube.Components {
    import Component = JumperCube.Component;
    import GameObject = JumperCube.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class Mover extends Component {
        private apply: boolean = true;

        constructor(gameObject: GameObject, public direction: Vector3, public acceleration: boolean = false, private continuous: boolean = false) {
            super(gameObject);
        }

        update(deltaTime: number) {
            if (this.apply || this.continuous) {
                this.gameObject.push(this.direction, !this.continuous, this.acceleration);
                this.apply = false;
            }
        }
    }
} 