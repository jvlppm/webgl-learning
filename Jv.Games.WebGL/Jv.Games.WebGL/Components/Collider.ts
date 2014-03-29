module Jv.Games.WebGL.Components {
    export class Collider extends Component<GameObject> {
        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        intersects(collider: Collider) { }
    }

    export class BoxCollider extends Collider {
        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object, args);
        }

        intersects(collider: Collider) {
        }
    }

    export class SphereCollider extends Collider {
        radius = 1;

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object, args);
            super.loadArgs(args);
        }

        intersects(collider: Collider) {
            if (collider instanceof SphereCollider) {
                var distance = collider.object.transform.position.sub(this.object.transform.position);
                return distance.length() <= this.radius + (<SphereCollider>collider).radius;
            }
        }
    }
}