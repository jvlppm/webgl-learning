///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class SwingWhileMoving extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        speed = 4;
        inverse = false;
        axis: Vector3;
        private moveTime = 0;
        private baseRotation = Matrix4.Identity();
        private rotation = 0;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            var momentum = this.rigidBody.momentum.length();

            if (momentum > 0.5) {
                this.moveTime += deltaTime * momentum * this.speed;

                var sin = Math.sin(this.moveTime);
                if (this.inverse)
                    sin = -sin;

                this.object.transform._extractRotation(this.baseRotation);
                this.object.transform._rotateByAxis(this.axis, sin);
                this.rotation = sin;
            }
            else if (Math.abs(this.rotation) > 0.001) {
                this.moveTime = 0;
                this.object.transform._extractRotation(this.baseRotation);
                this.rotation -= this.rotation * deltaTime * 5;
                this.object.transform._rotateByAxis(this.axis, this.rotation);
            }
            else {
                this.moveTime = 0;
                this.object.transform._extractRotation(this.baseRotation);
                this.rotation = 0;
            }
        }
    }
}
