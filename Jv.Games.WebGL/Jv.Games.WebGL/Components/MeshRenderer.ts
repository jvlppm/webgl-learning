module Jv.Games.WebGL.Components {
    export class MeshRenderer extends Component<GameObject> {
        mesh: Mesh;
        shader: Jv.Games.WebGL.Core.ShaderProgram;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
            if (typeof this.mesh === "undefined")
                throw new Error("No mesh specified for MeshRenderer");
            if (typeof this.shader === "undefined")
                throw new Error("No shader specified for MeshRenderer");
        }

        draw(baseTransform?: Matrix4) {
            this.shader.getUniform("Mmatrix").setMatrix4(baseTransform.data);
            this.mesh.draw(this.shader);
        }
    }
}