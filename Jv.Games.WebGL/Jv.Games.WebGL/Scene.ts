module Jv.Games.WebGL {
    export class Scene extends GameObject {
        cameras: Camera[];
        clearColor: Color;

        constructor(public webgl: Jv.Games.WebGL.Core.WebGL) {
            super();
            this.cameras = [];
            this.clearColor = Color.Rgb(0, 0, 0);
        }

        update(deltaTime: number) {
            super.update(deltaTime);

            this.cameras.forEach(c => {
                c.update(deltaTime);
            });
        }

        add(child: GameObject);
        add(camera: Camera);
        add<Type extends Components.Component<GameObject>, Arguments>(behaviorType: { new (object: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (item instanceof Camera) {
                this.cameras.push(item);
                return item;
            }
            else return super.add(item);
        }

        init() {
            var gl = this.webgl.context;
            gl.clearColor(this.clearColor.red, this.clearColor.green, this.clearColor.blue, this.clearColor.alpha);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }

        draw(baseTransform?: Matrix4) {
            baseTransform = baseTransform ? baseTransform.multiply(this.transform) : this.transform;

            var gl = this.webgl.context;
            var canvas = this.webgl.canvas;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.cameras.forEach(cam => {
                gl.viewport(canvas.width * cam.viewport.left, canvas.height * cam.viewport.top, canvas.width * cam.viewport.width, canvas.height * cam.viewport.height);

                Scene.unique(this.getComponents<MeshRenderer>(MeshRenderer, true).map(c => c.material)).forEach(material => {
                    material.setUniform("Pmatrix", cam.projection)
                    material.setUniform("Vmatrix", cam.view);
                });

                this.children.forEach(obj => {
                    obj.draw(baseTransform);
                });
            });

            gl.flush();
        }

        private static contains<T>(a: T[], v) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === v) return true;
            }
            return false;
        }

        private static unique<T>(a: T[]) {
            var arr: T[] = [];
            for (var i = 0; i < a.length; i++) {
                if (!Scene.contains(arr, a[i])) {
                    arr.push(a[i]);
                }
            }
            return arr;
        }
    }
}