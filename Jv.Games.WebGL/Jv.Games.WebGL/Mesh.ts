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
        attributes: { [name: string]: AttributeDefinition };


        constructor(public context: WebGLRenderingContext, private mode: MeshRenderMode = MeshRenderMode.TriangleStrip) {
            this.renderModeId = this.getModeTypeId(mode);
            this.attributes = {};
        }

        set vertex(data: number[]) {
            var gl = this.context;
            this.vertexBuffer = this.context.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, <any>new Float32Array(data), gl.STATIC_DRAW);
        }

        set index(data: number[]) {
            var gl = this.context;
            this.indexBuffer = this.context.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, <any>new Uint16Array(data), gl.STATIC_DRAW);
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

        draw(shader: ShaderProgram) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            for (var name in this.attributes) {
                var attrib = shader.getVertexAttribute(name);
                if (attrib != null) {
                    var info = this.attributes[name];
                    attrib.setPointer(info.size, info.type, info.normalized, info.stride, info.offset);
                }
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(this.renderModeId, this.elementCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}