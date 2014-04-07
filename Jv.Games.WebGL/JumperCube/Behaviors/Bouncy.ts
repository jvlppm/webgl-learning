module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class Bouncy extends Component<Jv.Games.WebGL.GameObject> {
        force = new Jv.Games.WebGL.Vector3(0, 4, 0);
        tags: string[];

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            if (typeof this.force !== "undefined" && this.tags.indexOf(collider.object.tag) >= 0)
                (<RigidBody>collider.object.searchComponent(RigidBody)).push(this.force, true);
        }
    }
}
