///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Key = Jv.Games.WebGL.Key;
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class DebugPosition extends Component<Jv.Games.WebGL.GameObject> {
        minJumpForce = 1;
        maxJumpForce = 1;
        moveForce = 1;
        private spareJumpForce = 0;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        update(deltaTime: number) {
            document.title = "x: " + this.object.transform.x + ", y: " + this.object.transform.y + ", z: " + this.object.transform.z;

            var speed = 0.5;

            var toMove = new Vector3(0, 0, 0);

            if (Keyboard.isKeyDown(Key.E))
                toMove._add(new Vector3(0, speed, 0));

            if (Keyboard.isKeyDown(Key.Q))
                toMove._add(new Vector3(0, -speed, 0));

            if (Keyboard.isKeyDown(Key.D))
                toMove._add(new Vector3(speed, 0, 0));

            if (Keyboard.isKeyDown(Key.A))
                toMove._add(new Vector3(-speed, 0, 0));

            if (Keyboard.isKeyDown(Key.W))
                toMove._add(new Vector3(0, 0, speed));

            if (Keyboard.isKeyDown(Key.S))
                toMove._add(new Vector3(0, 0, -speed));

            this.object.transform = this.object.transform.translate(toMove.scale(deltaTime));
        }
    }
}
