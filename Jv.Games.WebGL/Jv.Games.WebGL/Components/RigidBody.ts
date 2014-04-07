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
                this.object.transform = oldTransform;

                var globTransform = this.object.globalTransform;
                var invertTransform = globTransform.invert();

                var dir = globTransform.transform(toMove);
                var i = 0;
                for (; i < 3; i++) {
                    var tryGlobMove = new Vector3(dir.x, dir.y, dir.z);
                    tryGlobMove.setData(i, 0);
                    if (tryGlobMove.x === 0 && tryGlobMove.y === 0 && tryGlobMove.z === 0)
                        continue;
                    var tryMove = invertTransform.transform(tryGlobMove);
                    if (this.validPosition()) {
                        var accelSecsAxis = new Vector3(accellSecs.x, accellSecs.y, accellSecs.z);
                        accelSecsAxis.setData(i, 0);
                        this.momentum._add(accelSecsAxis);

                        this.momentum.setData(i, 0);
                    }
                    else {
                        
                    }
                }

                /*var toFall = toMove.y;
                toMove.y = 0;

                var globTransform = this.object.globalTransform;
                var invertTransform = globTransform.invert();

                var dir = globTransform.transform(toMove);

                var i = 0;
                for (; i < 3; i++) {
                    var tryGlobMove = new Vector3(dir.x, dir.y, dir.z);
                    tryGlobMove.setData(i, 0);
                    /*for (var j = 0; j < 3; j++) {
                        if(j != i)
                            tryGlobMove.setData(j, 0);
                    }* /
                    if (tryGlobMove.x === 0 && tryGlobMove.y === 0 && tryGlobMove.z === 0)
                        continue;
                    var tryMove = invertTransform.transform(tryGlobMove);

                    this.object.transform = oldTransform.translate(tryMove.scale(MeterSize * deltaTime));
                    if (this.validPosition()) {
                        this.momentum._add(new Vector3(accellSecs.x, 0, accellSecs.z));
                        this.momentum.setData(i, 0);
                        break;
                    }
                }

                if (i >= 3) {
                    this.object.transform = oldTransform;
                    this.momentum = new Vector3();
                }

                toMove = new Vector3(0, toFall, 0);
                oldTransform = this.object.transform;
                this.object.transform = this.object.transform.translate(toMove.scale(MeterSize * deltaTime));
                if (!this.validPosition()) {
                    this.object.transform = oldTransform;
                    this.momentum = new Vector3(this.momentum.x, 0, this.momentum.y);
                }*/
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

                    if (other.isTrigger)
                        this.object.getComponents(Component, true).forEach(c => c.onTrigger(other));
                    if (this.collider.isTrigger)
                        other.object.getComponents(Component, true).forEach(c => c.onTrigger(this.collider));

                    if (!other.isTrigger)
                        return false;
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
