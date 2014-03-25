module Jv.Games.WebGL {
    export class Vector3 {
        static Zero: Vector3 = new Vector3(0, 0, 0);

        private data: Float32Array;
        private startIndex: number;

        constructor(data: Float32Array, startIndex: number);
        constructor(x: number, y: number, z: number);

        constructor(a1, a2, a3?) {
            if (typeof a1 === "number") {
                this.data = new Float32Array(3);
                this.data[0] = a1;
                this.data[1] = a2;
                this.data[2] = a3;
                this.startIndex = 0;
            }
            else {
                this.data = a1;
                this.startIndex = a2;
            }
        }

        get x() {
            return this.data[this.startIndex + 0];
        }

        get y() {
            return this.data[this.startIndex + 1];
        }

        get z() {
            return this.data[this.startIndex + 2];
        }

        set x(value: number) {
            this.data[this.startIndex + 0] = value;
        }

        set y(value: number) {
            this.data[this.startIndex + 1] = value;
        }

        set z(value: number) {
            this.data[this.startIndex + 2] = value;
        }

        add(vector: Vector3): Vector3 {
            return new Vector3(
                this.x + vector.x,
                this.y + vector.y,
                this.z + vector.z);
        }

        scale(value: number) {
            return new Vector3(
                this.x * value,
                this.y * value,
                this.z * value);
        }
    }
} 