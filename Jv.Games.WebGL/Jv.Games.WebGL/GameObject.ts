﻿///<reference path="Behavior.ts" />
///<reference path="Mesh.ts" />
///<reference path="Matrix4.ts" />
///<reference path="Vector3.ts" />

module Jv.Games.WebGL {
    import ShaderProgram = Core.ShaderProgram;

    export var MeterSize = 1;

    export class GameObject extends BehaviorCollection<GameObject> {
        transform: Matrix4;
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        public momentum: Vector3;
        public children: GameObject[];

        constructor(public mesh: Mesh, public mass: number = 1)
        {
            super();
            this.children = [];
            this.transform = Matrix4.Identity();
            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;
        }

        update(deltaTime: number) {
            super.update(deltaTime);

            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.transform = this.transform.translate(toMove.scale(MeterSize * deltaTime));
            this.momentum = this.momentum.add(accellSecs);

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;

            this.children.forEach(c => c.update(deltaTime));
        }

        add(child: GameObject);
        add<Type extends Behavior<GameObject>, Arguments>(behaviorType: { new (object: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (typeof item === "function") {
                super.add(item, args);
            }
            else {
                this.children.push(item);
            }
        }

        push(force: Vector3, instantaneous: boolean = false, acceleration: boolean = false) {
            if (!acceleration)
                force = force.divide(this.mass);

            if (!instantaneous)
                this.acceleration = this.acceleration.add(force);
            else
                this.instantaneousAcceleration = this.instantaneousAcceleration.add(force);
        }

        draw(shader: ShaderProgram, baseTransform?: Matrix4) {
            if (typeof baseTransform !== "undefined")
                baseTransform = baseTransform.multiply(this.transform);
            else
                baseTransform = this.transform;

            shader.getUniform("Mmatrix").setMatrix4(baseTransform.data);
            this.mesh.draw(shader);

            this.children.forEach(c => c.draw(shader, baseTransform));
        }
    }
}