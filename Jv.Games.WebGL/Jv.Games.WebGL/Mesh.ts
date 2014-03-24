module Jv.Games.WebGL {
    export enum MeshRenderMode {
        Triangles,
        TriangleStrip
    }

    export class Mesh {
        vertexBuffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        elementCount: number;
        renderModeId: number;

        constructor(public context: WebGLRenderingContext, private mode: MeshRenderMode = MeshRenderMode.TriangleStrip) {
            this.renderModeId = this.getModeTypeId(mode);
        }

        set vertex(data: number[]) {
            var gl = this.context;
            this.vertexBuffer = this.context.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, <any>new Float32Array(data), gl.STATIC_DRAW);
            //gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
        }

        set index(data: number[]) {
            var gl = this.context;
            this.indexBuffer = this.context.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, <any>new Uint16Array(data), gl.STATIC_DRAW);
            //gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(data));
            this.elementCount = data.length;
        }

        private getModeTypeId(mode: MeshRenderMode) {
            var gl = this.context;
            switch (mode) {
                case MeshRenderMode.Triangles:
                    return gl.TRIANGLES;
                case MeshRenderMode.TriangleStrip:
                    return gl.TRIANGLE_STRIP;

                default:
                    throw new Error("Unknown render mode " + mode);
            }
        }
    }
}