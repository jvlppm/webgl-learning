module Jv.Games.WebGL {
    export class Vector3 {
        private data: Float32Array;

        constructor(x: number, y: number, z: number) {
            this.data = new Float32Array(3);
            this.data[0] = x;
            this.data[1] = y;
            this.data[2] = z;
        }

        get x() {
            return this.data[0];
        }

        get y() {
            return this.data[1];
        }

        get z() {
            return this.data[2];
        }

        set x(value: number) {
            this.data[0] = value;
        }

        set y(value: number) {
            this.data[1] = value;
        }

        set z(value: number) {
            this.data[2] = value;
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