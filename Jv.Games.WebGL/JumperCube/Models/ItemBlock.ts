///<reference path="../references.ts" />

module JumperCube.Models {
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import Texture = Jv.Games.WebGL.Materials.Texture;
    import TextureMaterial = Jv.Games.WebGL.Materials.TextureMaterial;
    import AxisAlignedBoxCollider = Jv.Games.WebGL.Components.AxisAlignedBoxCollider;

    export class ItemBlock extends Jv.Games.WebGL.GameObject {
        static UV = [0, 0, 1, 0, 1, 1, 0, 1];
        collider: AxisAlignedBoxCollider;
        renderer: MeshRenderer;

        constructor(context: WebGLRenderingContext, public activeTexture: Texture, public usedTexture: Texture) {
            super();

            this.renderer = new MeshRenderer(this, {
                mesh: new JumperCube.Mesh.TexturedCube(1, 1, 1, context, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV),
                material: new TextureMaterial(context, activeTexture)
            });
            this.collider = new AxisAlignedBoxCollider(this, { isTrigger: true, radiusWidth: 0.5, radiusHeight: 0.5, radiusDepth: 0.5 });

            this.add(this.renderer);
            this.add(this.collider);
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            this.collider.isTrigger = false;
            (<TextureMaterial>this.renderer.material).texture = this.usedTexture;
        }
    }
}