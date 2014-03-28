module Jv.Games.WebGL {
    
    export class Camera extends Components.ComponentCollection<Camera> {
        constructor(public projection: Matrix4, public transform: Matrix4) {
            super();
        }

        update(deltaTime: number) {
            super.update(deltaTime);
        }

        static Perspective(fovy, aspect, near, far) {
            var top = near * Math.tan(fovy * Math.PI / 360.0);
            var right = top * aspect;
            return new Camera(Camera.Frustum(-right, right, -top, top, near, far), Matrix4.Identity());
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