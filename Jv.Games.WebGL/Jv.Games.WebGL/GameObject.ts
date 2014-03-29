///<reference path="Components/Component.ts" />
///<reference path="Mesh.ts" />
///<reference path="Matrix4.ts" />
///<reference path="Vector3.ts" />

module Jv.Games.WebGL {
    import ShaderProgram = Core.ShaderProgram;

    export var MeterSize = 1;

    export class GameObject extends Components.ComponentCollection<GameObject> {
        transform: Matrix4;
        public children: GameObject[];
        public parent: GameObject;

        constructor()
        {
            super();
            this.children = [];
            this.transform = Matrix4.Identity();
        }

        update(deltaTime: number) {
            super.update(deltaTime);
            this.children.forEach(c => c.update(deltaTime));
        }

        add(child: GameObject) : GameObject;
        add<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?: { [prop: string]: any }): Type }, args?: { [prop: string]: any }): Type;
        add(item, args?) {
            if (typeof item === "function")
                return super.add(item, args);

            this.children.push(item);
            item.parent = this;
            return item;
        }

        draw(baseTransform?: Matrix4) {
            if (typeof baseTransform !== "undefined")
                baseTransform = baseTransform.multiply(this.transform);
            else
                baseTransform = this.transform;
            
            super.draw(baseTransform);
            this.children.forEach(c => c.draw(baseTransform));
        }

        private static flatten(list: any[]) {
            return list.reduce(function (acc, val) {
                return acc.concat(val.constructor === Array ? GameObject.flatten(val) : val);
            }, []);
        }

        getComponentsRecursively<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?): Type }): Type[]{
            var result: Type[] = super.getComponents(componentType);

            this.children.forEach(c => {
                result = result.concat(c.getComponentsRecursively(componentType));
            });

            return result;
        }

        searchComponent<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?): Type }, ignoreObjects?: GameObject[]): Type {
            var toProcess = [this];

            ignoreObjects = ignoreObjects || [];

            while (toProcess.length > 0) {
                var current = toProcess.pop();

                if (ignoreObjects.indexOf(current) >= 0)
                    continue;
                ignoreObjects.push(current);

                var found = current.getComponents(componentType);
                if (found.length > 1)
                    throw new Error("More than 1 components of type " + Components.Component.GetName(componentType) + " where found");
                if (found.length == 1)
                    return found[0];

                this.children.forEach(c => toProcess.push(c));
            }

            if (typeof this.parent !== "undefined")
                return this.parent.searchComponent(componentType, ignoreObjects);

            return;
        }
    }
}