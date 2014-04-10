///<reference path="../references.ts" />

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
        setUniform(name: string, value: Texture);
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
            if (value instanceof Texture) {
                this.program.getUniform(name).setTexture(value);
                return;
            }

            throw new Error("Uniform type not supported");
        }
    }

    export class SolidColorMaterial extends Material {
        private static materialProgram: Core.ShaderProgram;
        uniforms: { vColor: Color };

        set color(value: Color) {
            this.uniforms.vColor = value;
        }

        get color() {
            return this.uniforms.vColor;
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

    export class TextureMaterial extends Material {
        private static materialProgram: Core.ShaderProgram;
        uniforms: { uSampler: Texture };

        constructor(context: WebGLRenderingContext, texture: Texture) {
            super(TextureMaterial.getProgram(context));
            this.texture = texture;
        }

        set texture(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uSampler = value;
        }

        private static getProgram(context: WebGLRenderingContext) {
            if (typeof TextureMaterial.materialProgram === "undefined") {
                TextureMaterial.materialProgram = new Core.ShaderProgram(context);

                TextureMaterial.materialProgram.addShader(Core.ShaderType.Vertex,
                    [
                        "attribute vec3 position;",
                        "attribute vec2 textureCoord;",

                        "uniform mat4 Pmatrix;",
                        "uniform mat4 Vmatrix;",
                        "uniform mat4 Mmatrix;",

                        "varying highp vec2 vTextureCoord;",

                        "void main(void)", [ //pre-built function
                            "gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);",
                            "vTextureCoord = textureCoord;"
                        ]
                    ]);

                TextureMaterial.materialProgram.addShader(Core.ShaderType.Fragment,
                    [
                        "varying highp vec2 vTextureCoord;",
                        "uniform sampler2D uSampler;",

                        "void main(void)", [
                            "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));"
                        ]
                    ]);
                TextureMaterial.materialProgram.link();
            }

            return TextureMaterial.materialProgram;
        }
    }
}