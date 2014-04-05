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
        speed = 10;
        stopSpeed = 0.9;
        minDistance = 5;
        maxDistance = 10;
        rigidBody: RigidBody;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            var target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;
            var targetXZ = new Vector3(target.x, 0, target.z);

            var target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;
            var targetXZ = new Vector3(target.x, 0, target.z);

            if (targetXZ.length() - this.maxDistance > 0.001) {
                //this.object.transform.position._add(targetXZ);
                //this.object.transform.position._add(targetXZ.normalize().scale(-this.maxDistance));
                this.rigidBody.momentum = targetXZ.normalize().scale(this.speed * Math.min((targetXZ.length() - this.maxDistance), 1));
            }
            else if (targetXZ.length() - this.minDistance < -0.001) {
                //this.object.transform.position._add(targetXZ);
                //this.object.transform.position._add(targetXZ.normalize().scale(-this.minDistance));
                this.rigidBody.momentum = targetXZ.normalize().scale(-this.speed * Math.min((this.minDistance - targetXZ.length()), 1));
            }
            else {
                var mid = (this.minDistance + this.maxDistance) / 2;
                var dir = (targetXZ.length() > mid)? 1 : -1;

                if (Math.abs(targetXZ.length() - mid) > 0.5)
                    this.rigidBody.push(targetXZ.normalize().scale(this.speed * dir));
                else
                    this.rigidBody.momentum = this.rigidBody.momentum.scale(this.stopSpeed);
            }
        }
    }
}
