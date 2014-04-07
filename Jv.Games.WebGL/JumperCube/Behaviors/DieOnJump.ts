module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    export class DieOnJump extends Component<Jv.Games.WebGL.GameObject> {
        dying: boolean;
        scaleY = 1;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
            this.dying = false;
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            if (collider.tag == "player") {
                this.dying = true;
            }
        }

        update() {
            if (this.dying) {
                this.object.transform = this.object.transform.multiply(Jv.Games.WebGL.Matrix4.Scale(1, this.scaleY, 1));
                this.scaleY *= 0.8;

                if (this.scaleY < 0.1) {
                    this.object.parent.children.splice(this.object.parent.children.indexOf(this.object), 1);
                }
            }
        }
    }
}
