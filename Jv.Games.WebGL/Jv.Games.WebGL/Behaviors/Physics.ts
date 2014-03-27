module Jv.Games.WebGL.Behaviors {
    export class Physics extends Behavior<GameObject> {
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        momentum: Vector3;

        constructor(object: GameObject, public args: { mass: number }) {
            super(object);

            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;

            if (typeof this.args === "undefined")
                this.args = { mass: 1 };
        }

        update(deltaTime: number) {
            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.object.transform = this.object.transform.translate(toMove.scale(MeterSize * deltaTime));
            this.momentum = this.momentum.add(accellSecs);

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;
        }

        push(force: Vector3, instantaneous: boolean = false, acceleration: boolean = false) {
            if (!acceleration)
                force = force.divide(this.args.mass);

            if (!instantaneous)
                this.acceleration = this.acceleration.add(force);
            else
                this.instantaneousAcceleration = this.instantaneousAcceleration.add(force);
        }
    }
}
