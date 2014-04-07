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
        viewDistance = 15;
        rigidBody: RigidBody;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            var target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;
            if (target.length() > this.viewDistance)
                return;
            var targetXZ = new Vector3(target.x, 0, target.z);

            if (targetXZ.length() - this.maxDistance > 0.001) {
                var moveMomentum = targetXZ.normalize().scale(this.speed * Math.min((targetXZ.length() - this.maxDistance), 1));
                this.rigidBody.momentum = new Vector3(moveMomentum.x, this.rigidBody.momentum.y, moveMomentum.z);
            }
            else if (targetXZ.length() - this.minDistance < -0.001) {
                var moveMomentum = targetXZ.normalize().scale(-this.speed * Math.min((this.minDistance - targetXZ.length()), 1));
                this.rigidBody.momentum = new Vector3(moveMomentum.x, this.rigidBody.momentum.y, moveMomentum.z);
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
