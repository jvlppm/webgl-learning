module Jv.Games.WebGL {
    export class Scene {
        public objects: GameObject[];

        constructor() {
            this.objects = [];
        }

        update(deltaTime: number) {
            this.objects.forEach(o => {
                o.update(deltaTime);
            });

            //TODO: update cameras
        }

        add(object: GameObject);
        add(object) {
            if (object instanceof GameObject) {
                this.objects.push(object);
            }
        }

        draw(shaderProgram: Jv.Games.WebGL.Core.ShaderProgram) {

            //TODO: use a material defined in the object
            this.objects.forEach(obj => {
                obj.draw(shaderProgram);
            });
        }
    }
}