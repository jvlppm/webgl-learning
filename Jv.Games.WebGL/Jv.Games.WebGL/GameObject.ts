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

        add(child: GameObject);
        add<Type extends Components.Component<GameObject>, Arguments>(behaviorType: { new (object: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (typeof item === "function") {
                super.add(item, args);
            }
            else {
                this.children.push(item);
            }
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
    }
}