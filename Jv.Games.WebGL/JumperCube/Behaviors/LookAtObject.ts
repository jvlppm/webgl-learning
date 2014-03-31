﻿///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
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
            var eye = this.object.globalTransform.position;
            var center = this.target.globalTransform.position;
            var up = new Vector3(0, 1, 0);

            this.object.view = Matrix4.LookAt(eye, center, up);
        }
    }
}