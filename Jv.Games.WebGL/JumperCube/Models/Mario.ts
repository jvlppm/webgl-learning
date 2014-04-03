///<reference path="../references.ts" />

module JumperCube.Models {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Components = Jv.Games.WebGL.Components;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Behaviors = JumperCube.Behaviors;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export class Mario extends GameObject {
        body: GameObject;

        constructor(public context: WebGLRenderingContext, public texture: Jv.Games.WebGL.Materials.Texture) {
            super();

            this.loadBehaviors();
            this.createBody();
        }

        loadBehaviors() {
            this.add(Components.AxisAlignedBoxCollider);
            this.add(Components.RigidBody, { friction: new Vector3(0.90, 1, 0.90) });
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });
        }

        private createBody() {
            this.body = this.add(new GameObject());
            this.body.add(Behaviors.RotateWhileJumping, { speed: 6 });
            this.addHead(new Vector3());
        }

        private addHead(location: Vector3) {
            var marioHeadMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Models.Mesh.MarioHead(this.context),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.context, this.texture)
            };

            var head = this.body.add(new GameObject());
            head.add(Behaviors.LookForward);
            head.add(MeshRenderer, marioHeadMesh);
        }
    }
}
