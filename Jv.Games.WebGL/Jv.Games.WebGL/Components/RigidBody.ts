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

        update(deltaTime: number) {
            var addedInstantAccel = this.instantaneousAcceleration.clone();
            var addedAccel = this.acceleration;

            var accellSecs = addedAccel.scale(deltaTime);
            this.momentum._add(addedInstantAccel);

            var oldTransform = this.object.transform;
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.object.transform = this.object.transform.translate(toMove.scale(MeterSize * deltaTime));

            if (this.validPosition()) {
                this.momentum._add(accellSecs);
            }
            else {
                var i = 0;
                for (; i < 3; i++) {
                    var tryMove = this.momentum.add(accellSecs.scale(0.5));
                    tryMove.setData(i, 0);
                    this.object.transform = oldTransform.translate(tryMove.scale(MeterSize * deltaTime));
                    if (this.validPosition()) {
                        this.momentum._add(accellSecs);
                        this.momentum.setData(i, 0);
                        break;
                    }
                }

                if (i >= 3) {
                    this.object.transform = oldTransform;
                    this.momentum = new Vector3();
                }
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
