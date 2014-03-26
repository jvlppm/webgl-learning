module Jv.Games.WebGL {
    export class Utils {
        static StartTick(tickMethod: (dt: number) => void) {
            var oldTime = 0;
            var tickLoop = (time) => {
                var deltaTime = time - oldTime;
                oldTime = time;

                tickMethod(deltaTime / 1000);
                window.requestAnimationFrame(tickLoop);
            };
            tickLoop(0);
        }
    }
}