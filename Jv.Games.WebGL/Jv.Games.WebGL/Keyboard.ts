module Jv.Games.WebGL {
    export enum Key {
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40
    }

    export class Keyboard {
        static currentlyPressedKeys = {};

        public static init() {
            window.onkeydown = Keyboard.handleKeyDown;
            window.onkeyup = Keyboard.handleKeyUp;
        }

        private static handleKeyDown(event: KeyboardEvent) {
            Keyboard.currentlyPressedKeys[event.keyCode] = true;
        }

        private static handleKeyUp(event: KeyboardEvent) {
            Keyboard.currentlyPressedKeys[event.keyCode] = false;
        }

        static isKeyDown(key: Key) : boolean {
            return Keyboard.currentlyPressedKeys[key];
        }
    }
}