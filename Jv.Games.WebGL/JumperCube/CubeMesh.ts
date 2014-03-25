///<reference path="../Jv.Games.WebGL/Mesh.ts" />
///<reference path="../Jv.Games.WebGL/VertexAttribute.ts" />

module JumperCube {
    import WebGL = Jv.Games.WebGL;
    import AttributeDefinition = Jv.Games.WebGL.AttributeDefinition;

    export class CubeMesh extends WebGL.Mesh {
        constructor(width: number, height: number, depth: number, context: WebGLRenderingContext) {
            super(context, WebGL.MeshRenderMode.TriangleStrip);

            var w = width / 2;
            var h = height / 2;
            var d = depth / 2;

            this.vertex = [
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
            ];
            this.index = [0, 1, 2, 3, 7, 1, 5, 4, 7, 6, 2, 4, 0, 1];

            this.attributes["position"] = new AttributeDefinition(3, DataType.Float, false, 4 * (3 + 3), 0);
            this.attributes["color"] = new AttributeDefinition(3, DataType.Float, false, 4 * (3 + 3), 3 * 4);
        }
    }
}