///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />
///<reference path="../../Jv.Games.WebGL/Matrix4.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class Follow extends Component<Jv.Games.WebGL.Camera> {
        public target: GameObject;
        public speed = 1;
        public minDistance = new Vector3(1, 1, 1);

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
        }

        update(deltaTime: number) {
            var dist = this.target.globalTransform.position.sub(this.object.globalTransform.position);

            for (var i = 0; i < 3; i++) {
                if (Math.abs(dist.getData(i)) < this.minDistance.getData(i))
                    dist.setData(i, 0);
            }

            this.object.transform.position._add(dist.scale(deltaTime));
        }
    }
}