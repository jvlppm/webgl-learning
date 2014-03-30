///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />
///<reference path="../../Jv.Games.WebGL/Components/RigidBody.ts" />

module JumperCube.Behaviors {
    import Key = Jv.Games.WebGL.Key;
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Component = Jv.Games.WebGL.Components.Component;

    export class Controller extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        jumpForce = 1;
        moveForce = 1;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            if (this.rigidBody.momentum.y === 0) {
                if (Keyboard.isKeyDown(Key.Up))
                    this.rigidBody.push(new Vector3(0, this.jumpForce, 0), true, true);
            }

            if (Keyboard.isKeyDown(Key.Right))
                this.rigidBody.push(new Vector3(this.moveForce, 0, 0));
            if (Keyboard.isKeyDown(Key.Left))
                this.rigidBody.push(new Vector3(-this.moveForce, 0, 0));
        }
    }
}