module Jv.Games.WebGL {
    export class Scene {
        objects: GameObject[];
        cameras: Camera[];
        clearColor: Color;

        constructor(public context: WebGLRenderingContext) {
            this.objects = [];
            this.cameras = [];
            this.clearColor = Color.Rgb(0, 0, 0);
        }

        update(deltaTime: number) {
            this.objects.forEach(o => {
                o.update(deltaTime);
            });

            this.cameras.forEach(c => {
                c.update(deltaTime);
            });
        }

        add(object: GameObject);
        add(camera: Camera);
        add(object) {
            if (object instanceof Camera) {
                this.cameras.push(object);
            }
            else if (object instanceof GameObject) {
                this.objects.push(object);
            }
        }

        init() {
            var gl = this.context;
            gl.clearColor(this.clearColor.red, this.clearColor.green, this.clearColor.blue, this.clearColor.alpha);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }

        draw(shader: Jv.Games.WebGL.Core.ShaderProgram) {
            var gl = shader.webgl.context;
            var canvas = shader.webgl.canvas;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.cameras.forEach(cam => {
                //TODO: add viewport to camera
                gl.viewport(0, 0, canvas.width, canvas.height);

                shader.setUniform("Pmatrix", cam.projection);
                shader.setUniform("Vmatrix", cam.transform);

                //TODO: use the material (shaders) defined in the object
                this.objects.forEach(obj => {
                    obj.draw(shader);
                });
            });

            gl.flush();
        }
    }
}