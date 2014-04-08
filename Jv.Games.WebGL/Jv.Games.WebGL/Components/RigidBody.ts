﻿///<reference path="../references.ts" />

module Jv.Games.WebGL.Components {
    export class RigidBody extends Component<GameObject> {
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        private collider: Collider;

        momentum: Vector3;
        mass = 1;
        friction: Vector3;
        maxSpeed: number;

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

        tryMove(deltaTime: number, acceleration: Vector3, axis?: number): boolean {

            if (typeof axis !== "undefined") {
                acceleration = acceleration.clone();
                for (var i = 0; i < 3; i++)
                    if (axis !== i)
                        acceleration.setData(i, 0);
            }

            var toMove = this.momentum.add(acceleration.divide(2));

            if (typeof axis !== "undefined") {
                for (var i = 0; i < 3; i++)
                    if (axis !== i)
                        toMove.setData(i, 0);
            }

            if (typeof this.maxSpeed !== "undefined") {
                var speed = new Vector3(toMove.x, 0, toMove.z).length();
                if (speed > this.maxSpeed)
                    toMove._multiply(new Vector3(this.maxSpeed / speed, 1, this.maxSpeed / speed));
            }

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

            var accellSecs = addedAccel.scale(deltaTime).add(addedInstantAccel);
            //this.momentum._add(addedInstantAccel);

            if (this.object.tag === "player")
                document.title = this.momentum.y.toString();

            if (!this.tryMove(deltaTime, accellSecs)) {
                if (!this.tryMove(deltaTime, accellSecs, 1))
                    this.momentum.y = 0;
                if (!this.tryMove(deltaTime, accellSecs, 0))
                    this.momentum.x = 0;
                if (!this.tryMove(deltaTime, accellSecs, 2))
                    this.momentum.z = 0;
            }

            if (typeof this.friction !== "undefined")
                this.momentum._multiply(new Vector3(
                    Math.max(1 - this.friction.x * deltaTime, 0),
                    Math.max(1 - this.friction.y * deltaTime, 0),
                    Math.max(1 - this.friction.z * deltaTime, 0)));

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
