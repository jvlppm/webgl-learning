﻿///<reference path="MathHelper.ts" />

module Jv.Games.WebGL {
    import MathHelper = Jv.Games.WebGL.MathHelper;

    export class Matrix4 {

        position: Vector3;

        constructor(public data?: Float32Array) {
            if (typeof data === "undefined")
                this.data = new Float32Array(16);
            else if (data.length != 16)
                throw new Error("Matrix data length must be 16, not " + data.length);
            this.position = new Vector3(this.data, 12);
        }

        static Perspective(fovy, aspect, near, far) {
            var top = near * Math.tan(fovy * Math.PI / 360.0);
            var right = top * aspect;
            return Matrix4.Frustum(-right, right, -top, top, near, far);
        }

        static Frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number) {
            var zDelta = (zFar - zNear);
            var dir = (right - left);
            var height = (top - bottom);
            var zNear2 = 2 * zNear;

            return new Matrix4(new Float32Array([
                2 * zNear / dir, 0, (right + left) / dir, 0,
                0, zNear2 / height, (top + bottom) / height, 0,
                0, 0, -(zFar + zNear) / zDelta, -zNear2 * zFar / zDelta,
                0, 0, -1, 0
            ]));
        }

        static Identity() {
            return new Matrix4(new Float32Array(
                [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]));
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

        rotateX(angle: number) {
            var m = new Float32Array(16);
            m.set(this.data);

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];
            m[1] = m[1] * c - m[2] * s;
            m[5] = m[5] * c - m[6] * s;
            m[9] = m[9] * c - m[10] * s;

            m[2] = m[2] * c + mv1 * s;
            m[6] = m[6] * c + mv5 * s;
            m[10] = m[10] * c + mv9 * s;

            return new Matrix4(m);
        }

        rotateY(angle: number) {
            var m = new Float32Array(16);
            m.set(this.data);

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
            m[0] = c * m[0] + s * m[2];
            m[4] = c * m[4] + s * m[6];
            m[8] = c * m[8] + s * m[10];

            m[2] = c * m[2] - s * mv0;
            m[6] = c * m[6] - s * mv4;
            m[10] = c * m[10] - s * mv8;

            return new Matrix4(m);
        }

        rotateZ(angle: number) {
            var m = new Float32Array(16);
            m.set(this.data);

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
            m[0] = c * m[0] - s * m[1];
            m[4] = c * m[4] - s * m[5];
            m[8] = c * m[8] - s * m[9];

            m[1] = c * m[1] + s * mv0;
            m[5] = c * m[5] + s * mv4;
            m[9] = c * m[9] + s * mv8;

            return new Matrix4(m);
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

        lookAt(target: Vector3, up?: Vector3) {
            if (typeof up === "undefined")
                up = new Vector3(0, 1, 0);
            return Matrix4.LookAt(this.position, target, up);
        }
    }
}