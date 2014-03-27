///<reference path="Behavior.ts" />
///<reference path="Mesh.ts" />
///<reference path="Matrix4.ts" />
///<reference path="Vector3.ts" />

module Jv.Games.WebGL {
    import ShaderProgram = Core.ShaderProgram;

    export var MeterSize = 1;

    export class GameObject extends BehaviorCollection<GameObject> {
        transform: Matrix4;
        public children: GameObject[];

        constructor(public mesh: Mesh, public mass: number = 1)
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
        add<Type extends Behavior<GameObject>, Arguments>(behaviorType: { new (object: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (typeof item === "function") {
                super.add(item, args);
            }
            else {
                this.children.push(item);
            }
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