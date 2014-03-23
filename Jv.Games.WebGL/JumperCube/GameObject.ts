///<reference path="../Jv.Games.WebGL/Mesh.ts" />
///<reference path="../Jv.Games.WebGL/Matrix.ts" />
///<reference path="../Jv.Games.WebGL/Vector3.ts" />

module JumperCube {
    import Mesh = Jv.Games.WebGL.Mesh;
    import Matrix = Jv.Games.WebGL.Matrix;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export var MeterSize = 2;

    export class GameObject {
        transform: Matrix;
        private acceleration: Vector3;
        private instantaneousAcceleration: Vector3;
        public momentum: Vector3;

        constructor(public mesh: Mesh, public mass: number = 1)
        {
            this.transform = Matrix.Identity();
            this.acceleration = Vector3.Zero;
            this.instantaneousAcceleration = Vector3.Zero;
            this.momentum = Vector3.Zero;
        }

        update(deltaTime: number) {
            var accellSecs = this.acceleration.scale(deltaTime);
            this.momentum = this.momentum.add(this.instantaneousAcceleration);
            var toMove = this.momentum.add(accellSecs.scale(0.5));
            this.transform.translate(toMove.scale(MeterSize * deltaTime));
            this.momentum = this.momentum.add(accellSecs);

            this.instantaneousAcceleration = this.acceleration = Vector3.Zero;
        }

        draw(deltaTime: number) {
            this.mesh.draw();
        }

        push(force: Vector3, instantaneous: boolean = false, acceleration: boolean = false) {
            if (!acceleration)
                force = force.scale(1 / this.mass);

            if (!instantaneous)
                this.acceleration = this.acceleration.add(force);
            else
                this.instantaneousAcceleration = this.instantaneousAcceleration.add(force);
        }
    }
}