///<reference path="../../Jv.Games.WebGL/GameObject.ts" />
///<reference path="Controller.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;

    export class RotateWhileJumping extends Component<Jv.Games.WebGL.GameObject> {
        controller: Controller;
        speed = 1;
        private resetTransform = false;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
            this.controller = this.controller || <Controller>object.getComponent(Controller);
        }

        update(deltaTime: number) {
            if (this.controller.isJumping) {
                this.object.transform = this.object.transform.rotateZ(this.speed * deltaTime);
                this.resetTransform = true;
            }
            else if (this.resetTransform) {
                this.object.transform = Matrix4.Identity().translate(this.object.transform.position)
                this.resetTransform = false;
            }
        }
    }
}