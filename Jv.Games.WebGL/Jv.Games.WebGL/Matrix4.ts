///<reference path="references.ts" />

module Jv.Games.WebGL {
    export class Matrix4 {

        position: Vector3;

        constructor(public data?: Float32Array) {
            if (typeof data === "undefined")
                this.data = new Float32Array(16);
            else if (data.length != 16)
                throw new Error("Matrix data length must be 16, not " + data.length);
            this.position = new Vector3(this.data, 12);
        }

        static Identity() {
            return new Matrix4(new Float32Array(
                [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]));
        }

        static Scale(x: number, y: number, z: number) {
            return new Matrix4(new Float32Array(
                [x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1]));
        }

        static Translate(x: number, y: number, z: number) {
            return new Matrix4(new Float32Array(
                [1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    x, y, z, 1]));
        }

        static LookAt(eye: Vector3, center: Vector3, up?: Vector3) {
            if (typeof up === "undefined")
                up = new Vector3(0, 1, 0);

            var newZ = center.sub(eye).normalize();
            var newX = newZ.cross(up).normalize();
            var newY = newX.cross(newZ).normalize();

            var b = new Matrix4();
            b.data[0] = newX.x;
            b.data[4] = newX.y;
            b.data[8] = newX.z;

            b.data[1] = newY.x;
            b.data[5] = newY.y;
            b.data[9] = newY.z;

            b.data[2] = -newZ.x;
            b.data[6] = -newZ.y;
            b.data[10] = -newZ.z;

            b.data[15] = 1;

            return b.translate(eye.scale(-1));
        }

        clone() {
            var clonedBuffer = new Float32Array(this.data.length);
            clonedBuffer.set(this.data);
            return new Matrix4(clonedBuffer);
        }

        get x() {
            return this.data[12];
        }

        get y() {
            return this.data[13];
        }

        get z() {
            return this.data[14];
        }

        set x(value: number) {
            this.data[12] = value;
        }

        set y(value: number) {
            this.data[13] = value;
        }

        set z(value: number) {
            this.data[14] = value;
        }

        setRotationY(value: number) {
            var c = Math.cos(value), s = Math.sin(value);
            var x = this.x, y = this.y, z = this.z;
            this.data.set([
                c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                x, y, z, 1]);
        }

        transform(vector: Vector3) {
            var x = vector.x, y = vector.y, z = vector.z;
            var m = this.data;

            return new Vector3(
                m[0] * x + m[4] * y + m[8] * z,
                m[1] * x + m[5] * y + m[9] * z,
                m[2] * x + m[6] * y + m[10] * z);
        }

        _rotateX(angle: number) {
            var m = this.data;

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];
            m[1] = m[1] * c - m[2] * s;
            m[5] = m[5] * c - m[6] * s;
            m[9] = m[9] * c - m[10] * s;

            m[2] = m[2] * c + mv1 * s;
            m[6] = m[6] * c + mv5 * s;
            m[10] = m[10] * c + mv9 * s;
        }

        _rotateY(angle: number) {
            var m = this.data;

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
            m[0] = c * m[0] + s * m[2];
            m[4] = c * m[4] + s * m[6];
            m[8] = c * m[8] + s * m[10];

            m[2] = c * m[2] - s * mv0;
            m[6] = c * m[6] - s * mv4;
            m[10] = c * m[10] - s * mv8;
        }

        _rotateZ(angle: number) {
            var m = this.data;

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
            m[0] = c * m[0] - s * m[1];
            m[4] = c * m[4] - s * m[5];
            m[8] = c * m[8] - s * m[9];

            m[1] = c * m[1] + s * mv0;
            m[5] = c * m[5] + s * mv4;
            m[9] = c * m[9] + s * mv8;
        }

        translate(t: Vector3) {
            var m = new Float32Array(16);
            m.set(this.data);

            m[12] = m[0] * t.x + m[4] * t.y + m[8] * t.z + m[12],
            m[13] = m[1] * t.x + m[5] * t.y + m[9] * t.z + m[13],
            m[14] = m[2] * t.x + m[6] * t.y + m[10] * t.z + m[14],
            m[15] = m[3] * t.x + m[7] * t.y + m[11] * t.z + m[15]

            return new Matrix4(m);
        }

        multiply(matrixB: Matrix4) {
            var matrixC = new Matrix4();
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    for (var i = 0; i < 4; i++) {
                        matrixC.data[col * 4 + row] += this.data[i * 4 + row] * matrixB.data[col * 4 + i];
                    }
                }
            }
            return matrixC;
        }

        invert()
        {
            var inv = new Float32Array(16);
            var m = this.data;

            inv[0] = m[5] * m[10] * m[15] -
            m[5] * m[11] * m[14] -
            m[9] * m[6] * m[15] +
            m[9] * m[7] * m[14] +
            m[13] * m[6] * m[11] -
            m[13] * m[7] * m[10];

            inv[4] = -m[4] * m[10] * m[15] +
            m[4] * m[11] * m[14] +
            m[8] * m[6] * m[15] -
            m[8] * m[7] * m[14] -
            m[12] * m[6] * m[11] +
            m[12] * m[7] * m[10];

            inv[8] = m[4] * m[9] * m[15] -
            m[4] * m[11] * m[13] -
            m[8] * m[5] * m[15] +
            m[8] * m[7] * m[13] +
            m[12] * m[5] * m[11] -
            m[12] * m[7] * m[9];

            inv[12] = -m[4] * m[9] * m[14] +
            m[4] * m[10] * m[13] +
            m[8] * m[5] * m[14] -
            m[8] * m[6] * m[13] -
            m[12] * m[5] * m[10] +
            m[12] * m[6] * m[9];

            inv[1] = -m[1] * m[10] * m[15] +
            m[1] * m[11] * m[14] +
            m[9] * m[2] * m[15] -
            m[9] * m[3] * m[14] -
            m[13] * m[2] * m[11] +
            m[13] * m[3] * m[10];

            inv[5] = m[0] * m[10] * m[15] -
            m[0] * m[11] * m[14] -
            m[8] * m[2] * m[15] +
            m[8] * m[3] * m[14] +
            m[12] * m[2] * m[11] -
            m[12] * m[3] * m[10];

            inv[9] = -m[0] * m[9] * m[15] +
            m[0] * m[11] * m[13] +
            m[8] * m[1] * m[15] -
            m[8] * m[3] * m[13] -
            m[12] * m[1] * m[11] +
            m[12] * m[3] * m[9];

            inv[13] = m[0] * m[9] * m[14] -
            m[0] * m[10] * m[13] -
            m[8] * m[1] * m[14] +
            m[8] * m[2] * m[13] +
            m[12] * m[1] * m[10] -
            m[12] * m[2] * m[9];

            inv[2] = m[1] * m[6] * m[15] -
            m[1] * m[7] * m[14] -
            m[5] * m[2] * m[15] +
            m[5] * m[3] * m[14] +
            m[13] * m[2] * m[7] -
            m[13] * m[3] * m[6];

            inv[6] = -m[0] * m[6] * m[15] +
            m[0] * m[7] * m[14] +
            m[4] * m[2] * m[15] -
            m[4] * m[3] * m[14] -
            m[12] * m[2] * m[7] +
            m[12] * m[3] * m[6];

            inv[10] = m[0] * m[5] * m[15] -
            m[0] * m[7] * m[13] -
            m[4] * m[1] * m[15] +
            m[4] * m[3] * m[13] +
            m[12] * m[1] * m[7] -
            m[12] * m[3] * m[5];

            inv[14] = -m[0] * m[5] * m[14] +
            m[0] * m[6] * m[13] +
            m[4] * m[1] * m[14] -
            m[4] * m[2] * m[13] -
            m[12] * m[1] * m[6] +
            m[12] * m[2] * m[5];

            inv[3] = -m[1] * m[6] * m[11] +
            m[1] * m[7] * m[10] +
            m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] -
            m[9] * m[2] * m[7] +
            m[9] * m[3] * m[6];

            inv[7] = m[0] * m[6] * m[11] -
            m[0] * m[7] * m[10] -
            m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] +
            m[8] * m[2] * m[7] -
            m[8] * m[3] * m[6];

            inv[11] = -m[0] * m[5] * m[11] +
            m[0] * m[7] * m[9] +
            m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] -
            m[8] * m[1] * m[7] +
            m[8] * m[3] * m[5];

            inv[15] = m[0] * m[5] * m[10] -
            m[0] * m[6] * m[9] -
            m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] +
            m[8] * m[1] * m[6] -
            m[8] * m[2] * m[5];

            var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

            if (det == 0)
                throw new Error("Matrix.invert could not be calculated, determinant is 0");

            for (var i = 0; i < 16; i++)
                inv[i] /= det;

            return new Matrix4(inv);
        }

        lookAt(target: Vector3, up?: Vector3) {
            if (typeof up === "undefined")
                up = new Vector3(0, 1, 0);
            return Matrix4.LookAt(this.position, target, up);
        }
    }
}