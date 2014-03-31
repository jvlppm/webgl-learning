module Jv.Games.WebGL.Components {
    export class MeshRenderer extends Component<GameObject> {
        mesh: Mesh;
        material: Jv.Games.WebGL.Materials.Material;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);

            if (typeof this.mesh === "undefined")
                throw new Error("No mesh specified for MeshRenderer");
            this.material = this.material || new Jv.Games.WebGL.Materials.VertexColorMaterial(this.mesh.context);
        }

        draw(baseTransform: Matrix4) {
            this.material.program.use();
            this.material.setUniform("Mmatrix", baseTransform);
            this.material.setUniforms();
            this.mesh.draw(this.material);
        }
    }
}