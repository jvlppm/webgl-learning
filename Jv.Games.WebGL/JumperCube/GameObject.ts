///<reference path="../Jv.Games.WebGL/Mesh.ts" />
///<reference path="../Jv.Games.WebGL/Matrix4.ts" />
///<reference path="../Jv.Games.WebGL/Vector3.ts" />

module JumperCube {
    import Mesh = Jv.Games.WebGL.Mesh;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import ShaderProgram = Jv.Games.WebGL.Core.ShaderProgram;

    export var MeterSize = 3;

    export interface IUpdateable {
        update(deltatime: number);
    }

    export class Component implements IUpdateable {
        constructor(public gameObject: GameObject) { }

        update(deltaTime: number) { }
    }

    export class GameObject implements IUpdateable {
        transform: Matrix4;
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        public momentum: Vector3;
        public components: Component[];

        constructor(public mesh: Mesh, public mass: number = 1)
        {
            this.components = [];
            this.transform = Matrix4.Identity();
            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;
        }

        update(deltaTime: number) {
            this.components.forEach(c => c.update(deltaTime));

            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.transform = this.transform.translate(toMove.scale(MeterSize * deltaTime));
            this.momentum = this.momentum.add(accellSecs);

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;
        }

        add<Arguments>(componentType: { new (gameObject: GameObject, args?: Arguments): Component }, args?: Arguments) {
            var component = new componentType(this, args);
            this.components.push(component);
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
        }
    }
}