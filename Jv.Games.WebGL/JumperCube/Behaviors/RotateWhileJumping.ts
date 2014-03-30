///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="../../Jv.Games.WebGL/Components/RigidBody.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

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
                this.object.transform = this.object.transform.rotateZ(this.speed * deltaTime * (this.rigidBody.momentum.x > 0? -1 : 1));
                this.resetTransform = true;
            }
            else if (this.resetTransform) {
                this.object.transform = Matrix4.Identity().translate(this.object.transform.position)
                this.resetTransform = false;
            }
        }
    }
}