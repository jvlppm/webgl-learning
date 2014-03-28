module Jv.Games.WebGL.Core {
    export class BufferAttribute {
        constructor(public size: number, public type: Jv.Games.WebGL.Core.DataType, public normalized: boolean, public stride: number, public offset: number) {
        }
    }

    export class DataBuffer {
        buffer: WebGLBuffer;
        attributes: { [name: string]: BufferAttribute };

        constructor(public context: WebGLRenderingContext, public stride: number, public dataType: DataType) {
            this.attributes = {};
            this.buffer = context.createBuffer();
        }

        set data(data: number[]) {
            var bufferContent;
            switch (this.dataType) {
                case Core.DataType.Float:
                    bufferContent = new Float32Array(data);
                    break;
                default:
                    throw new Error("Data type of " + this.dataType + " is not supported yet");
            }

            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferContent, gl.STATIC_DRAW);
        }

        attrib(name: string, size: number, normalized: boolean, offset: number) {
            this.attributes[name] = new BufferAttribute(size, null, normalized, null, offset);
        }

        setAttributes(shader: ShaderProgram) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

            for (var name in this.attributes) {
                var attrib = shader.getVertexAttribute(name);
                if (attrib != null) {
                    var info = this.attributes[name];
                    var stride = info.stride || this.stride;
                    var type = info.type || this.dataType;
                    attrib.setPointer(info.size, type, info.normalized, stride, info.offset);
                }
            }
        }
    }
}