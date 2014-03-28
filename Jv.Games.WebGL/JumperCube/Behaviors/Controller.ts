///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Keyboard.ts" />
///<reference path="../../Jv.Games.WebGL/Components/Physics.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Physics = Jv.Games.WebGL.Components.Physics;
    import Component = Jv.Games.WebGL.Components.Component;

    export class Controller extends Component<Jv.Games.WebGL.GameObject> {
        physics: Physics;

        constructor(public object: Jv.Games.WebGL.GameObject, public args: { minY: number; jumpForce: number; moveForce: number }) {
            super(object);
            this.physics = <Physics>object.getComponent(Physics);
            if (typeof this.physics === "undefined")
                throw new Error("Attached object does not have a physics component");
        }

        update(deltaTime: number) {
            if (this.physics.momentum.y <= 0 && this.object.transform.y <= this.args.minY) {
                this.physics.momentum.y = 0;
                this.object.transform.y = this.args.minY;

                if (Keyboard.isKeyDown(Key.Up))
                    this.physics.push(new Vector3(0, this.args.jumpForce, 0), true, true);
            }

            if (Keyboard.isKeyDown(Key.Right))
                this.physics.push(new Vector3(this.args.moveForce, 0, 0));
            if (Keyboard.isKeyDown(Key.Left))
                this.physics.push(new Vector3(-this.args.moveForce, 0, 0));
        }
    }
}