///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Components/RigidBody.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class RotateWhileJumping extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        speed = 1;
        private resetTransform = false;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            if (this.rigidBody.momentum.y !== 0) {
                var movement = new Vector3(this.rigidBody.momentum.x, 0, this.rigidBody.momentum.z);
                this.object.transform._rotateX(this.speed * deltaTime * movement.length());
                this.resetTransform = true;
            }
            else if (this.resetTransform) {
                this.object.transform = Matrix4.Identity().translate(this.object.transform.position)
                this.resetTransform = false;
            }
        }
    }
}