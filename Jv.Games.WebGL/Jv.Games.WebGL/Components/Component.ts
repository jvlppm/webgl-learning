﻿module Jv.Games.WebGL.Components {
    export class Component<ObjectType> {
        constructor(public object: ObjectType) { }

        loadArgs(args: { [prop: string]: any }) {
            if (typeof args === "undefined")
                return;
            for (var propName in args)
                this[propName] = args[propName];
        }

        update(deltaTime: number) { }

        draw(baseTransform: Matrix4) { }

        static GetName<Type extends Component<any>>(type: { new (o, args?) }) {
            var ret = type.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }
    }

    export class ComponentCollection<T> {
        private components: Component<T>[];

        constructor() {
            this.components = [];
        }

        add<Type extends Component<T>, Arguments>(componentType: { new (object: T, args?: Arguments): Type }, args?: Arguments) {
            var instance = new componentType(<any>this, args);
            this.components.push(instance);
            return instance;
        }

        getComponent<Type extends Component<T>>(componentType: { new (object: T, args?): Type }): Type {
            var found = this.getComponents(componentType);
            if (found.length == 0)
                throw new Error("No component of type " + Component.GetName(componentType) + " was found");
            if (found.length > 1)
                throw new Error("Multiple components of type " + Component.GetName(componentType) + " were found");

            return found[0];
        }

        getComponents<Type extends Component<T>>(componentType: { new (object: T, args?): Type }): Type[] {
            return <Type[]>this.components
                .filter(e => e instanceof componentType);
        }

        update(deltaTime: number) {
            this.components.forEach(c => c.update(deltaTime));
        }

        draw(baseTransform?: Matrix4) {
            this.components.forEach(c => c.draw(baseTransform));
        }
    }
}
