///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />
///<reference path="../../Jv.Games.WebGL/Components/RigidBody.ts" />

module JumperCube.Behaviors {
    import Key = Jv.Games.WebGL.Key;
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class Controller extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        camera: Jv.Games.WebGL.Camera;
        jumpForce = 1;
        moveForce = 1;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            if (this.rigidBody.momentum.y === 0) {
                if (Keyboard.isKeyDown(Key.Space))
                    this.rigidBody.push(new Vector3(0, this.jumpForce, 0), true, true);
            }

            var objt = this.object.globalTransform;

            var forward = this.camera.view.multiply(this.camera.globalTransform).invert()
                .multiply(this.object.globalTransform)
                .transform(new Vector3(0, 0, 1));

            var right = forward.cross(new Vector3(0, -1, 0));

            var toMove = new Vector3(0, 0, 0);

            window.document.title = "x:" + forward.x + ", y:" + forward.y + ", z: " + forward.z;

            if (Keyboard.isKeyDown(Key.Up))
                toMove._add(forward.scale(this.moveForce));

            if (Keyboard.isKeyDown(Key.Down))
                toMove._add(forward.scale(-this.moveForce));

            if (Keyboard.isKeyDown(Key.Right))
                toMove._add(right.scale(-this.moveForce));

            if (Keyboard.isKeyDown(Key.Left))
                toMove._add(right.scale(this.moveForce));

            this.rigidBody.push(toMove);
        }
    }
}