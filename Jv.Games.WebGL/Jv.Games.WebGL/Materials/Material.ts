module Jv.Games.WebGL.Materials {
    export class Material {
        constructor(public program: Core.ShaderProgram) {
            this.uniforms = {};
        }

        uniforms: {};

        setUniforms() {
            for (var name in this.uniforms)
                this.setUniform(name, this.uniforms[name]);
        }

        setUniform(name: string, value: Color);
        setUniform(name: string, value: Matrix4);
        setUniform(name: string, value) {
            this.program.use();
            if (value instanceof Matrix4) {
                this.program.getUniform(name).setMatrix4(value);
                return;
            }
            if (value instanceof Color) {
                this.program.getUniform(name).setColor(value);
                return;
            }

            throw new Error("Uniform type not supported");
        }
    }

    export class SolidColorMaterial extends Material {
        private static materialProgram: Core.ShaderProgram;

        set color(value: Color) {
            this.uniforms["vColor"] = value;
        }

        constructor(context: WebGLRenderingContext, color: Color) {
            super(SolidColorMaterial.getProgram(context));
            this.color = color;
        }

        private static getProgram(context: WebGLRenderingContext) {
            if (typeof SolidColorMaterial.materialProgram === "undefined") {
                SolidColorMaterial.materialProgram = new Core.ShaderProgram(context);

                SolidColorMaterial.materialProgram.addShader(Core.ShaderType.Vertex,
                    [
                        "attribute vec3 position;",

                        "uniform mat4 Pmatrix;",
                        "uniform mat4 Vmatrix;",
                        "uniform mat4 Mmatrix;",

                        "void main(void)", [ //pre-built function
                            "gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);",
                        ]
                    ]);

                SolidColorMaterial.materialProgram.addShader(Core.ShaderType.Fragment,
                    [
                        "precision mediump float;",
                        "uniform vec4 vColor;",

                        "void main(void)", [
                            "gl_FragColor = vColor;"
                        ],
                    ]);
                SolidColorMaterial.materialProgram.link();
            }

            return SolidColorMaterial.materialProgram;
        }
    }

    export class VertexColorMaterial extends Material {
        private static materialProgram: Core.ShaderProgram;

        constructor(context: WebGLRenderingContext) {
            super(VertexColorMaterial.getProgram(context));
        }

        private static getProgram(context: WebGLRenderingContext) {
            if (typeof VertexColorMaterial.materialProgram === "undefined") {
                VertexColorMaterial.materialProgram = new Core.ShaderProgram(context);

                VertexColorMaterial.materialProgram.addShader(Core.ShaderType.Vertex,
                    [
                        "attribute vec3 position;",
                        "attribute vec3 color;", //the color of the point

                        "uniform mat4 Pmatrix;",
                        "uniform mat4 Vmatrix;",
                        "uniform mat4 Mmatrix;",

                        "varying vec3 vColor;",

                        "void main(void)", [ //pre-built function
                            "gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);",
                            "vColor = color;",
                        ]
                    ]);

                VertexColorMaterial.materialProgram.addShader(Core.ShaderType.Fragment,
                    [
                        "precision mediump float;",
                        "varying vec3 vColor;",

                        "void main(void)", [
                            "gl_FragColor = vec4(vColor, 1.);"
                        ],
                    ]);
                VertexColorMaterial.materialProgram.link();
            }

            return VertexColorMaterial.materialProgram;
        }
    }
}