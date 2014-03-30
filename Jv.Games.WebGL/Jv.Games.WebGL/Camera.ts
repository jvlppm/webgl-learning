﻿module Jv.Games.WebGL {

    export class Viewport {
        // 0 means top/left, 1 means bottom/right.
        constructor(public left: number, public top: number, public width: number, public height: number) {
        }
    }
    
    export class Camera extends Components.ComponentCollection<Camera> {
        viewport: Viewport;

        constructor(public projection: Matrix4, public transform: Matrix4) {
            super();
            this.viewport = new Viewport(0, 0, 1, 1);
        }

        update(deltaTime: number) {
            super.update(deltaTime);
        }

        static Perspective(fovy, aspect, near, far) {
            var top = near * Math.tan(fovy * Math.PI / 360.0);
            var right = top * aspect;
            return Camera.Frustum(-right, right, -top, top, near, far);
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
    }
}