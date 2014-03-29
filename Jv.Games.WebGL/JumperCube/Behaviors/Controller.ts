///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />
///<reference path="../../Jv.Games.WebGL/Components/Physics.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Physics = Jv.Games.WebGL.Components.Physics;
    import Component = Jv.Games.WebGL.Components.Component;

    export class Controller extends Component<Jv.Games.WebGL.GameObject> {
        physics: Physics;
        minY = 0;
        jumpForce = 1;
        moveForce = 1;
        isJumping = true;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
            this.physics = <Physics>object.getComponent(Physics);
        }

        update(deltaTime: number) {
            if (this.physics.momentum.y <= 0 && this.object.transform.y <= this.minY) {
                this.physics.momentum.y = 0;
                this.object.transform.y = this.minY;

                if (Keyboard.isKeyDown(Key.Up)) {
                    this.physics.push(new Vector3(0, this.jumpForce, 0), true, true);
                    this.isJumping = true;
                }
                else
                    this.isJumping = false;
            }

            if (Keyboard.isKeyDown(Key.Right))
                this.physics.push(new Vector3(this.moveForce, 0, 0));
            if (Keyboard.isKeyDown(Key.Left))
                this.physics.push(new Vector3(-this.moveForce, 0, 0));
        }
    }
}