module Jv.Games.WebGL.Components {
    export class RigidBody extends Component<GameObject> {
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        private collider: Collider;

        momentum: Vector3;
        mass = 1;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);

            this.collider = this.collider || <Collider>object.getComponent(Collider, false);

            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;
        }

        update(deltaTime: number) {
            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            var oldTransform = this.object.transform;
            this.object.transform = this.object.transform.translate(toMove.scale(MeterSize * deltaTime));

            if (this.validPosition()) {
                this.momentum = this.momentum.add(accellSecs);
            }
            else {
                this.object.transform = oldTransform;
                this.momentum = Vector3.Zero;
            }

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;
        }

        validPosition() {
            if (typeof this.collider === "undefined")
                return true;

            var root = this.object;

            while (typeof root.parent !== "undefined")
                root = root.parent;

            var colliders = root.getComponents(Collider, true);
            for (var index in colliders) {
                var other = colliders[index];
                if (other == this.collider)
                    continue;

                if (this.collider.intersects(other))
                    return false;
            }

            return true;
        }

        push(force: Vector3, instantaneous: boolean = false, acceleration: boolean = false) {
            if (!acceleration)
                force = force.divide(this.mass);

            if (!instantaneous)
                this.acceleration = this.acceleration.add(force);
            else
                this.instantaneousAcceleration = this.instantaneousAcceleration.add(force);
        }
    }
}
