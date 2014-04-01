///<reference path="../../Jv.Games.WebGL/Mesh.ts" />
///<reference path="../../Jv.Games.WebGL/Core/VertexAttribute.ts" />

module JumperCube {
    import WebGL = Jv.Games.WebGL;
    import BufferAttribute = Jv.Games.WebGL.Core.BufferAttribute;
    import DataType = Jv.Games.WebGL.Core.DataType;

    export class CubeMesh extends WebGL.Mesh {
        constructor(width: number, height: number, depth: number, context: WebGLRenderingContext) {
            super(context, WebGL.MeshRenderMode.TriangleStrip);

            var w = width / 2;
            var h = height / 2;
            var d = depth / 2;

            var data = this.addBuffer([
                -w, -h, d,
                0, 0, 1,

                w, -h, d,
                1, 0, 1,

                -w, h, d,
                0, 1, 1,

                w, h, d,
                1, 1, 1,

                -w, -h, -d,
                0, 0, 0,

                w, -h, -d,
                1, 0, 0,

                -w, h, -d,
                0, 1, 0,

                w, h, -d,
                1, 1, 0
            ], DataType.Float, 4 * (3 + 3));

            data.attrib("position", 3, false, 0);
            data.attrib("color", 3, false, 3 * 4);

            this.index = [0, 1, 2, 3, 7, 1, 5, 4, 7, 6, 2, 4, 0, 1];
        }
    }
}