///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;

    export class Controller extends Jv.Games.WebGL.Behavior<Jv.Games.WebGL.GameObject> {
        constructor(public object: Jv.Games.WebGL.GameObject, public args: { minY: number; jumpForce: number; moveForce: number }) {
            super(object);
        }

        update(deltaTime: number) {
            if (this.object.momentum.y <= 0 && this.object.transform.y <= this.args.minY) {
                this.object.momentum.y = 0;
                this.object.transform.y = this.args.minY;

                if (Keyboard.isKeyDown(Key.Up))
                    this.object.push(new Vector3(0, this.args.jumpForce, 0), true, true);
            }

            if (Keyboard.isKeyDown(Key.Right))
                this.object.push(new Vector3(this.args.moveForce, 0, 0));
            if (Keyboard.isKeyDown(Key.Left))
                this.object.push(new Vector3(-this.args.moveForce, 0, 0));
        }
    }
}