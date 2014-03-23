///<reference path="MathHelper.ts" />

module Jv.Games.WebGL {
    import MathHelper = Jv.Games.WebGL.MathHelper;

    export class Matrix {

        constructor(public data: number[]) {
            if (data === null)
                throw new Error("Empty Matrix data");
            if (data.length != 16)
                throw new Error("Matrix data length must be 16, not " + data.length);
        }

        static Perspective(fovy, aspect, near, far) : Matrix {
            var top = near * Math.tan(fovy * Math.PI / 360.0);
            var right = top * aspect;
            return Matrix.Frustum(-right, right, -top, top, near, far);
        }

        static Frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix {
            var zDelta = (zFar - zNear);
            var dir = (right - left);
            var height = (top - bottom);
            var zNear2 = 2 * zNear;

            return new Matrix([
                2 * zNear / dir, 0, (right + left) / dir, 0,
                0, zNear2 / height, (top + bottom) / height, 0,
                0, 0, -(zFar + zNear) / zDelta, -zNear2 * zFar / zDelta,
                0, 0, -1, 0
            ]);
        }

        static Zero() {
            return new Matrix([0, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 0]);
        }

        static Identity() {
            return new Matrix([1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1]);
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

        rotateX(angle: number) {
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

        rotateY(angle: number) {
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

        rotateZ(angle: number) {
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

        translateX(t: number) {
            this.data[12] += t;
        }

        translateY(t: number) {
            this.data[13] += t;
        }

        translateZ(t: number) {
            this.data[14] += t;
        }

        translate(vector: Vector3) {
            this.data[12] += vector.x;
            this.data[13] += vector.y;
            this.data[14] += vector.z;
        }
    }
}