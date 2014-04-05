///<reference path="../../references.ts" />

module JumperCube.Models.Mesh {
    import WebGL = Jv.Games.WebGL;
    import BufferAttribute = Jv.Games.WebGL.Core.BufferAttribute;
    import DataType = Jv.Games.WebGL.Core.DataType;

    export class TexturedCube extends WebGL.Mesh {
        constructor(width: number, height: number, depth: number, context: WebGLRenderingContext,
            frontUV = [0, 0, 0, 0, 0, 0, 0, 0],
            backUV = [0, 0, 0, 0, 0, 0, 0, 0],
            leftUV = [0, 0, 0, 0, 0, 0, 0, 0],
            rightUV = [0, 0, 0, 0, 0, 0, 0, 0],
            topUV = [0, 0, 0, 0, 0, 0, 0, 0],
            bottomUV = [0, 0, 0, 0, 0, 0, 0, 0]) {
            super(context, WebGL.MeshRenderMode.Triangles);

            if (frontUV.length !== 8 || backUV.length !== 8 ||
                leftUV.length !== 8 || rightUV.length !== 8 ||
                topUV.length !== 8 || bottomUV.length !== 8)
                throw new Error("Invalid texture mapping");

            var w = width / 2, h = height / 2, d = depth / 2;

            var data = this.addBuffer([
                // Front face
                -w, -h, d,
                w, -h, d,
                w, h, d,
                -w, h, d,

                // Back face
                w, -h, -d,
                -w, -h, -d,
                -w, h, -d,
                w, h, -d,

                // Top face
                -w, h, d,
                w, h, d,
                w, h, -d,
                -w, h, -d,

                // Bottom face
                -w, -h, -d,
                w, -h, -d,
                w, -h, d,
                -w, -h, d,

            // Right face
                w, -h, d,
                w, -h, -d,
                w, h, -d,
                w, h, d,

                // Left face
                -w, -h, -d,
                -w, -h, d,
                -w, h, d,
                -w, h, -d,
            ], DataType.Float, 4 * 3);

            data.attrib("position", 3, false, 0);

            var textureData = this.addBuffer([
                // Front face
                frontUV[0], frontUV[1],
                frontUV[2], frontUV[3],
                frontUV[4], frontUV[5],
                frontUV[6], frontUV[7],

                // Back face
                backUV[0], backUV[1],
                backUV[2], backUV[3],
                backUV[4], backUV[5],
                backUV[6], backUV[7],

                // Top face
                topUV[0], topUV[1],
                topUV[2], topUV[3],
                topUV[4], topUV[5],
                topUV[6], topUV[7],

                // Bottom face
                bottomUV[0], bottomUV[1],
                bottomUV[2], bottomUV[3],
                bottomUV[4], bottomUV[5],
                bottomUV[6], bottomUV[7],

                // Right face
                rightUV[0], rightUV[1],
                rightUV[2], rightUV[3],
                rightUV[4], rightUV[5],
                rightUV[6], rightUV[7],

                // Left face
                leftUV[0], leftUV[1],
                leftUV[2], leftUV[3],
                leftUV[4], leftUV[5],
                leftUV[6], leftUV[7],

            ], DataType.Float, 4 * 2);

            textureData.attrib("textureCoord", 2, false, 0);

            this.index = [
                0, 1, 2, 0, 2, 3,    // Front face
                4, 5, 6, 4, 6, 7,    // Back face
                8, 9, 10, 8, 10, 11,  // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
            ];
        }
    }
}