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

        get globalTransform() {
            var m: Matrix4[] = [];
            m.push(this.transform);

            var currentObject: GameObject = this;
            while (typeof currentObject.parent !== "undefined") {
                currentObject = currentObject.parent;
                m.push(currentObject.transform);
            }

            var gTransform = m.pop();
            while (m.length > 0)
                gTransform = gTransform.multiply(m.pop());
            return gTransform;
        }

        getComponents<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?): Type }, recursively?: boolean): Type[]{
            var result: Type[] = super.getComponents(componentType);

            if (recursively) {
                this.children.forEach(c => {
                    result = result.concat(c.getComponents(componentType, recursively));
                });
            }

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

                var found = current.getComponent(componentType, false);

                if (typeof found !== "undefined")
                    return found;

                this.children.forEach(c => toProcess.push(c));
            }

            var current = this;
            while (typeof current.parent !== "undefined") {
                current = current.parent;

                var found = current.getComponent(componentType, false);

                if (typeof found !== "undefined")
                    return found;
            }
        }
    }
}