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
            this.add(Components.AxisAlignedBoxCollider, { radiusWidth: 0.3, radiusDepth: 0.3, radiusHeight: 1 });
            this.add(Components.RigidBody, { friction: new Vector3(0.90, 1, 0.90) });
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });
        }

        private createBody() {
            // Container vai ser rotacionado no plano xz para olhar na direção do movimento
            var container = this.add(new GameObject());
            container.add(Behaviors.LookForward);
            
            // Body poderá rotacionar no seu eixo X, sem que a direção seja impactada
            this.body = container.add(new GameObject());
            this.body.transform.y = -0.5;
            this.body.add(Behaviors.RotateWhileJumping, { speed: 6 });

            this.addHead(new Vector3(0,0.8,0));
            this.addChest();
            this.addArm(new Vector3(-0.35, 0.05, 0));
            this.addArm(new Vector3(0.35, 0.05, 0));
            this.addLeg(new Vector3(-0.125, -0.35, 0));
            this.addLeg(new Vector3(0.125, -0.35, 0));
        }

        private addHead(location: Vector3) {
            var marioHeadMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Models.Mesh.MarioHead(this.context),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.context, this.texture)
            };

            var head = this.body.add(new GameObject());
            head.transform = head.transform.translate(location);
            head.add(MeshRenderer, marioHeadMesh);
        }

        private addChest() {
            var marioChestMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Models.Mesh.Cube(0.5, 0.5, 0.5, this.context)
            };

            var chest = this.body.add(new GameObject());
            chest.add(MeshRenderer, marioChestMesh);
        }

        private addArm(location: Vector3) {
            var marioArmMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Models.Mesh.Cube(0.2, 0.5, 0.2, this.context)
            };

            var arm = this.body.add(new GameObject());
            arm.transform = arm.transform.translate(location);
            arm.add(MeshRenderer, marioArmMesh);
        }

        private addLeg(location: Vector3) {
            var marioLegMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Models.Mesh.Cube(0.25, 0.25, 0.3, this.context)
            };

            var leg = this.body.add(new GameObject());
            leg.transform = leg.transform.translate(location);
            leg.add(MeshRenderer, marioLegMesh);
        }
    }
}
