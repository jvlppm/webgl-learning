///<reference path="../../Jv.Games.WebGL/GameObject.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;

    export class Rotating extends Component<Jv.Games.WebGL.GameObject> {
        speed = 1;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        update(deltaTime: number) {
            this.object.transform = this.object.transform.rotateY(this.speed*deltaTime);
        }
    }
}