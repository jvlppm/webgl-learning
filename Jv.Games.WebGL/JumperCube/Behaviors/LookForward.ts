///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class LookForward extends Component<Jv.Games.WebGL.Camera> {
        target: GameObject;
        rigidBody: RigidBody;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
            super.init();
        }

        update(deltaTime: number) {
            var direction = new Vector3(this.rigidBody.momentum.x, 0, this.rigidBody.momentum.z);

            if (direction.x !== 0 || direction.z !== 0) {
                direction = direction.normalize();
                var angle = Math.atan2(-direction.x, direction.z);
                this.object.transform.setRotationY(angle);
            }
        }
    }
}