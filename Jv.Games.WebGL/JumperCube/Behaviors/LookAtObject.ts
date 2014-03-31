///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;

    export class LookAtObject extends Component<Jv.Games.WebGL.Camera> {
        public target: GameObject;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
        }

        update(deltaTime: number) {
            this.object.lookAt(this.target.transform.position);
        }
    }
}