﻿///<reference path="references.ts" />

module Jv.Games.WebGL {
    export class Color {
        constructor(public data: Float32Array, public startIndex: number = 0) {
            if (startIndex + 4 > data.length)
                throw new Error("Invalid color data");
        }

        static Rgb(red: number, green: number, blue: number, alpha: number = 1) {
            return new Color(new Float32Array([red, green, blue, alpha]));
        }

        get red() {
            return this.data[this.startIndex];
        }

        set red(value: number) {
            this.data[this.startIndex] = value;
        }

        get green() {
            return this.data[this.startIndex + 1];
        }

        set green(value: number) {
            this.data[this.startIndex + 1] = value;
        }

        get blue() {
            return this.data[this.startIndex + 2];
        }

        set blue(value: number) {
            this.data[this.startIndex + 2] = value;
        }

        get alpha() {
            return this.data[this.startIndex + 3];
        }

        set alpha(value: number) {
            this.data[this.startIndex + 3] = value;
        }
    }
}