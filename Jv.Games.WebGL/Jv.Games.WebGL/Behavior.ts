module Jv.Games.WebGL {
    export class Behavior<ObjectType> {
        constructor(public object: ObjectType) { }

        update(deltaTime: number) { }

        static GetName<Type extends Behavior<any>>(type: { new (o, args?) }) {
            var ret = type.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }
    }

    export class AttachedBehavior<Type extends Behavior<any>> {
        constructor(public behaviorType: { new (object, args?): Type }, public instance: Type) { }
    }

    export class BehaviorCollection<T> {
        private behaviors: AttachedBehavior<Behavior<T>>[];

        constructor() {
            this.behaviors = [];
        }

        add<Type extends Behavior<T>, Arguments>(behaviorType: { new (object: T, args?: Arguments): Type }, args?: Arguments) {
            var bh = new behaviorType(<any>this, args);
            this.behaviors.push(new AttachedBehavior(behaviorType, bh));
        }

        getBehavior<Type extends Behavior<T>>(behaviorType: { new (object: T, args?): Type }): Type {
            var bh = this.getBehaviors(behaviorType);
            if (bh.length == 0)
                throw new Error("No behavior of type " + Behavior.GetName(behaviorType) + " was found.");
            if (bh.length > 1)
                throw new Error("Multiple behaviors of type " + Behavior.GetName(behaviorType) + " were found.");

            return bh[0];
        }

        getBehaviors<Type extends Behavior<T>>(behaviorType: { new (object: T, args?): Type }): Type[] {
            return this.behaviors
                .filter(e => e.behaviorType === behaviorType)
                .map(e => <any>e.instance);
        }

        update(deltaTime: number) {
            this.behaviors.forEach(c => c.instance.update(deltaTime));
        }
    }
}
