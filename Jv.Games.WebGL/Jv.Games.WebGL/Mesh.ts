module Jv.Games.WebGL {
    export enum MeshRenderMode {
        Triangles,
        TriangleStrip
    }

    export class Mesh {
        private vertexBuffer: WebGLBuffer;
        private indexBuffer: WebGLBuffer;
        private elementCount: number;
        private renderModeId: number;

        constructor(public context: WebGLRenderingContext, private mode: MeshRenderMode = MeshRenderMode.TriangleStrip) {
            this.vertexBuffer = context.createBuffer();
            this.indexBuffer = context.createBuffer();
            this.renderModeId = this.getModeTypeId(mode);
        }

        set vertex(data: number[]) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, <any>new Float32Array(data), gl.STATIC_DRAW);
        }

        set index(data: number[]) {
            var gl = this.context;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, <any>new Uint16Array(data), gl.STATIC_DRAW);
            this.elementCount = data.length;
        }

        draw() {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(this.renderModeId, this.elementCount, gl.UNSIGNED_SHORT, 0);
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