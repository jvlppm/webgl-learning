///<reference path="../references.ts" />

module Jv.Games.WebGL.Components {
    export class RigidBody extends Component<GameObject> {
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        private collider: Collider;

        momentum: Vector3;
        mass = 1;
        friction: Vector3;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);

            this.acceleration = new Vector3();
            this.instantaneousAcceleration = new Vector3();
            this.momentum = new Vector3();
        }

        init() {
            this.collider = this.collider || <Collider>this.object.searchComponent(Collider);
            super.init();
        }

        tryMove(deltaTime: number, acceleration: Vector3): boolean {
            var toMove = this.momentum.add(acceleration.divide(2));

            var oldTransform = this.object.transform;
            this.object.transform = this.object.transform.translate(toMove.scale(MeterSize * deltaTime));
            if (this.validPosition()) {
                this.momentum._add(acceleration);
                return true;
            }
            this.object.transform = oldTransform;
            return false;
        }

        update(deltaTime: number) {
            var addedInstantAccel = this.instantaneousAcceleration.clone();
            var addedAccel = this.acceleration;

            var accellSecs = addedAccel.scale(deltaTime);
            this.momentum._add(addedInstantAccel);

            if (!this.tryMove(deltaTime, accellSecs)) {
                if (!this.tryMove(deltaTime, new Vector3(accellSecs.x, 0, 0)))
                    this.momentum.x = 0;
                if (!this.tryMove(deltaTime, new Vector3(0, accellSecs.y, 0)))
                    this.momentum.y = 0;
                if (!this.tryMove(deltaTime, new Vector3(0, 0, accellSecs.z)))
                    this.momentum.z = 0;
            }

            if (typeof this.friction !== "undefined")
                this.momentum._multiply(this.friction);

            this.instantaneousAcceleration._add(addedInstantAccel.scale(-1));
            this.acceleration._add(addedAccel.scale(-1));
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

                if (this.collider.intersects(other)) {
                    if (!other.isTrigger)
                        return false;

                    this.object.getComponents(Component, true).forEach(c => c.onTrigger(other));
                    other.object.getComponents(Component, true).forEach(c => c.onTrigger(this.collider));
                }
            }

            return true;
        }

        push(force: Vector3, instantaneous: boolean = false, acceleration: boolean = false) {
            if (!acceleration)
                force = force.divide(this.mass);

            if (!instantaneous)
                this.acceleration._add(force);
            else
                this.instantaneousAcceleration._add(force);
        }
    }
}
