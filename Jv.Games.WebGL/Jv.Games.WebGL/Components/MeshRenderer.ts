module Jv.Games.WebGL.Components {
    export class MeshRenderer extends Component<GameObject> {
        constructor(object: GameObject, public args: { mesh: Mesh; shader: Jv.Games.WebGL.Core.ShaderProgram }) {
            super(object);
        }

        draw(baseTransform?: Matrix4) {
            this.args.shader.getUniform("Mmatrix").setMatrix4(baseTransform.data);
            this.args.mesh.draw(this.args.shader);
        }
    }
}