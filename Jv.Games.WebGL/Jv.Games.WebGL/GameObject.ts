﻿///<reference path="references.ts" />

module Jv.Games.WebGL {
    import ShaderProgram = Core.ShaderProgram;

    export var MeterSize = 1;

    export class GameObject extends Components.ComponentCollection<GameObject> {
        private _transform: Matrix4;
        private _globalTransform: Matrix4;

        children: GameObject[];
        parent: GameObject;
        tag: string;

        constructor()
        {
            super();
            this.children = [];
            this.transform = Matrix4.Identity();
        }

        init() {
            this.getComponents(Components.Component, false).forEach(c => c.init());
            this.children.forEach(c => c.init());
        }

        update(deltaTime: number) {
            super.update(deltaTime);
            this.children.forEach(c => c.update(deltaTime));
        }

        add<Type extends GameObject>(child: Type) : Type;
        add<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?: { [prop: string]: any }): Type }, args?: { [prop: string]: any }): GameObject;
        add(item, args?) {
            if (typeof item === "function")
                return super.add(item, args);

            this.children.push(item);
            item.parent = this;
            return item;
        }

        draw(baseTransform: Matrix4) {
            baseTransform = baseTransform.multiply(this.transform);
            super.draw(baseTransform);
            this.children.forEach(c => c.draw(baseTransform));
        }

        get transform() {
            return this._transform;
        }

        set transform(value: Matrix4) {
            this._transform = value;
            delete this._globalTransform;
            this.children.forEach(c => c.transform = c._transform);
        }

        get globalTransform() {
            if (typeof this._globalTransform === "undefined") {
                if (typeof this.parent === "undefined")
                    return this._transform;
                return this._globalTransform = this.parent.globalTransform.multiply(this._transform);
            }

            return this._globalTransform;
        }

        getComponents<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?): Type }, recursively?: boolean): Type[]{
            var result: Type[] = super.getComponents(componentType);

            if (recursively) {
                this.children.forEach(c => {
                    result = result.concat(c.getComponents(componentType, recursively));
                });
            }

            return result;
        }

        searchComponent<Type extends Components.Component<GameObject>>(componentType: { new (object: GameObject, args?): Type }, ignoreObjects?: GameObject[]): Type {
            var toProcess = [this];

            ignoreObjects = ignoreObjects || [];

            while (toProcess.length > 0) {
                var current = toProcess.pop();

                if (ignoreObjects.indexOf(current) >= 0)
                    continue;
                ignoreObjects.push(current);

                var found = current.getComponent(componentType, false);

                if (typeof found !== "undefined")
                    return found;

                current.children.forEach(c => toProcess.push(c));
            }

            var current = this;
            while (typeof current.parent !== "undefined") {
                current = current.parent;

                var found = current.getComponent(componentType, false);

                if (typeof found !== "undefined")
                    return found;
            }
        }

        sendMessage(name: string, recursively?: boolean, ...args: any[]) {
            var m = <Function>this[name];
            if (typeof m === "function")
                m.apply(this, args);

            super.getComponents(Components.Component).forEach(c => {
                var m = <Function>c[name];
                if (typeof c === "function")
                    m.apply(c, args);
            });

            if(recursively)
                this.children.forEach(c => c.sendMessage(name, recursively, args));
        }
    }
}