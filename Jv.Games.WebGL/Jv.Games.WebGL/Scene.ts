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
            }
            else super.add(item);
        }

        init() {
            var gl = this.webgl.context;
            gl.clearColor(this.clearColor.red, this.clearColor.green, this.clearColor.blue, this.clearColor.alpha);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }

        //TODO: buscar todos os renderers, pegar os diferentes shaders, e aplicar a matriz

        draw(baseTransform: Matrix4 = Matrix4.Identity()) {
            if (typeof baseTransform !== "undefined")
                baseTransform = baseTransform.multiply(this.transform);
            else
                baseTransform = this.transform;

            var gl = this.webgl.context;
            var canvas = this.webgl.canvas;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.cameras.forEach(cam => {
                //TODO: add viewport to camera
                gl.viewport(0, 0, canvas.width, canvas.height);

                Scene.unique(this.getComponentsRecursively<MeshRenderer>(MeshRenderer).map(c => c.args.shader)).forEach(shader => {
                    shader.setUniform("Pmatrix", cam.projection);
                    shader.setUniform("Vmatrix", cam.transform);
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