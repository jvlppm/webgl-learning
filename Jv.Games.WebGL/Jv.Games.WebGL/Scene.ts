module Jv.Games.WebGL {
    export class Scene {
        public objects: GameObject[];
        public cameras: Camera[];

        constructor() {
            this.objects = [];
            this.cameras = [];
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