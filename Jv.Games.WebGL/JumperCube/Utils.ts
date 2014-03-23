module JumperCube {
    export class Utils {
        static StartTick(tickMethod: (dt: number) => void) {
            var oldTime = 0;
            var tickLoop = (time) => {
                var deltaTime = time - oldTime;
                oldTime = time;

                tickMethod(deltaTime);
                window.requestAnimationFrame(tickLoop);
            };
            tickLoop(0);
        }
    }
}