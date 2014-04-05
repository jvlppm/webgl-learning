///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class Follow extends Component<Jv.Games.WebGL.Camera> {
        target: GameObject;
        speed = 1;
        stopSpeed = 0.9;
        minDistance = 0.5;
        maxDistance = 1;
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
            var target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;
            var targetXZ = new Vector3(target.x, 0, target.z);

            //if (targetXZ.length() > this.maxDistance)
              //  this.rigidBody.push(targetXZ.scale(this.speed));
            //else if (targetXZ.length() < this.minDistance) {

                //this.rigidBody.push(targetXZ.scale(-this.speed * 2));
                //var n = targetXZ.scale(-1).normalize().scale(this.minDistance);
                this.object.transform.position._add(targetXZ);
                this.object.transform.position._add(targetXZ.normalize().scale(-this.minDistance));
            //}
            //else
                //this.rigidBody.momentum = this.rigidBody.momentum.scale(this.stopSpeed);
        }
    }
}
