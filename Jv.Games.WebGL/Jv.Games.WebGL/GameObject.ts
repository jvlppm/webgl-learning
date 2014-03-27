///<reference path="Mesh.ts" />
///<reference path="Matrix4.ts" />
///<reference path="Vector3.ts" />

module Jv.Games.WebGL {
    import ShaderProgram = Core.ShaderProgram;

    export var MeterSize = 1;

    export interface IUpdateable {
        update(deltatime: number);
    }

    export class Behavior implements IUpdateable {
        constructor(public gameObject: GameObject) { }

        update(deltaTime: number) { }

        static GetName<Type extends Behavior>(type: { new (o: GameObject, args?): Type }) {
            var ret = type.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }
    }

    class AttachedBehavior<Type extends Behavior> {
        constructor(public type: { new (o: GameObject, args?): Type }, public instance: Type) { }
    }

    export class GameObject implements IUpdateable {
        transform: Matrix4;
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        public momentum: Vector3;
        private behaviors: AttachedBehavior<Behavior>[];
        public children: GameObject[];

        constructor(public mesh: Mesh, public mass: number = 1)
        {
            this.children = [];
            this.behaviors = [];
            this.transform = Matrix4.Identity();
            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;
        }

        update(deltaTime: number) {
            this.behaviors.forEach(c => c.instance.update(deltaTime));

            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.transform = this.transform.translate(toMove.scale(MeterSize * deltaTime));
            this.momentum = this.momentum.add(accellSecs);

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;

            this.children.forEach(c => c.update(deltaTime));
        }

        add(child: GameObject);
        add<Type extends Behavior, Arguments>(behaviorType: { new (gameObject: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (typeof item === "function") {
                var bh = new item(this, args);
                this.behaviors.push(new AttachedBehavior(item, bh));
            }
            else {
                this.children.push(item);
            }
        }

        getBehavior<Type extends Behavior>(behaviorType: { new (gameObject: GameObject, args?): Type }): Type[]{
            var bh = this.getBehaviors(behaviorType);
            if (bh.length == 0)
                throw new Error("No behavior of type " + Behavior.GetName(behaviorType) + " was found.");
            if (bh.length > 1)
                throw new Error("Multiple behaviors of type " + Behavior.GetName(behaviorType) + " were found.");

            return <any>bh[0];
        }

        getBehaviors<Type extends Behavior>(behaviorType: { new (gameObject: GameObject, args?): Type }): Type[] {
            return this.behaviors
                .filter(e => e.type === behaviorType)
                .map(e => <any>e.instance);
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