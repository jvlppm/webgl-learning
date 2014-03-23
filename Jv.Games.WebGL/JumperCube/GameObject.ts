///<reference path="../Jv.Games.WebGL/Mesh.ts" />
///<reference path="../Jv.Games.WebGL/Matrix.ts" />

module JumperCube {
    import Mesh = Jv.Games.WebGL.Mesh;
    import Matrix = Jv.Games.WebGL.Matrix;

    export class GameObject {
        transform: Matrix;

        constructor(public mesh: Mesh)
        {
            this.transform = Matrix.Identity();
        }

        update(deltaTime: number) {
            this.transform.rotateZ(deltaTime * -0.005);
            this.transform.translateX(deltaTime * 0.001);
        }

        draw(deltaTime: number) {
            this.mesh.draw();
        }
    }
}