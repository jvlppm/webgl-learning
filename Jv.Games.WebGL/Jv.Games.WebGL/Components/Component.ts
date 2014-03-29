module Jv.Games.WebGL.Components {
    export class Component<ObjectType> {
        constructor(public object: ObjectType) { }

        loadArgs(args: { [prop: string]: any }) {
            for (var propName in args) {
                this[propName] = args[propName];
            }
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

    export class AttachedComponent<Type extends Component<any>> {
        constructor(public componentType: { new (object, args?): Type }, public instance: Type) { }
    }

    export class ComponentCollection<T> {
        private components: AttachedComponent<Component<T>>[];

        constructor() {
            this.components = [];
        }

        add<Type extends Component<T>, Arguments>(componentType: { new (object: T, args?: Arguments): Type }, args?: Arguments) {
            var instance = new componentType(<any>this, args);
            this.components.push(new AttachedComponent(componentType, instance));
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
            return this.components
                .filter(e => e.componentType === componentType)
                .map(e => <any>e.instance);
        }

        update(deltaTime: number) {
            this.components.forEach(c => c.instance.update(deltaTime));
        }

        draw(baseTransform?: Matrix4) {
            this.components.forEach(c => c.instance.draw(baseTransform));
        }
    }
}
