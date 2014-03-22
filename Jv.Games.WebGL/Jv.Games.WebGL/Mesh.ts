module Jv.Games.WebGL {
    export enum MeshRenderMode {
        TriangleStrip
    }

    export class Mesh {
        private vertexBuffer: WebGLBuffer;
        private indexBuffer: WebGLBuffer;
        private elementCount: number;

        constructor(public context: WebGLRenderingContext, private mode: MeshRenderMode = MeshRenderMode.TriangleStrip) {
            this.vertexBuffer = context.createBuffer();
            this.indexBuffer = context.createBuffer();
        }

        set vertex(data: number[]) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, <any>new Float32Array(data), gl.STATIC_DRAW);
        }

        set index(data: number[]) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, <any>new Uint16Array(data), gl.STATIC_DRAW);
            switch (this.mode) {
                case MeshRenderMode.TriangleStrip:
                    this.elementCount = data.length - 2;
                    break;
                default:
                    throw new Error("Not implemented");
            }
        }

        draw() {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
            gl.drawElements(gl.TRIANGLE_STRIP, this.elementCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}