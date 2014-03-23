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

        static Projection(angle: number, a: number, zMin: number, zMax: number): Matrix {
            var tan = Math.tan(MathHelper.toRadians(0.5 * angle)),
                A = -(zMax + zMin) / (zMax - zMin),
                B = (-2 * zMax * zMin) / (zMax - zMin);

            return new Matrix([
                .5 / tan, 0, 0, 0,
                0, .5 * a / tan, 0, 0,
                0, 0, A, -1,
                0, 0, B, 0
            ]);
        }

        static Identity() {
            return new Matrix([1, 0, 0, 0,
                               0, 1, 0, 0,
                               0, 0, 1, 0,
                               0, 0, 0, 1]);
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
    }
}