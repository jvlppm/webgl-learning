module Jv.Games.WebGL {
    export class Mesh {
        private vertexUpdated: boolean;
        private indexUpdated: boolean;
        private vertexBuffer: WebGLBuffer;
        private indexBuffer: WebGLBuffer;

        constructor(public context : WebGLRenderingContext) {
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
        }

        draw() {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index);
            gl.drawElements(gl.TRIANGLES, 1, gl.UNSIGNED_SHORT, 0);
        }
    }
}