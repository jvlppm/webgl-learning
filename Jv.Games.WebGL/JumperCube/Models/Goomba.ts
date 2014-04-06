///<reference path="../references.ts" />

module JumperCube.Models {
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export class Goomba extends GameObject {
        constructor(context: WebGLRenderingContext) {
            super();
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true })
                .add(Jv.Games.WebGL.Components.RigidBody)
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: 0.5, radiusHeight: 0.5, radiusDepth: 0.5 })
                .add(new GameObject())
                .add(JumperCube.Behaviors.LookForward)
                .add(new GameObject())
                .add(Behaviors.SwingWhileMoving, { axis: new Vector3(0, 0, 1), speed: 15, maxSwing: 0.2 })
                .add(MeshRenderer, { mesh: new JumperCube.Models.Mesh.Cube(1, 1, 1, context) });
        }
    }
}
