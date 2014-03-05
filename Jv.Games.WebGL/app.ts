///<reference path="Scripts/typings/jquery/jquery.d.ts" />

function setup() {
    var result = $.Deferred<Jv.Games.WebGL.WebGL>();

    $(document).ready(function () {
        var webgl = Jv.Games.WebGL.WebGL.fromCanvasId("canvas-element-id");
        var shaderProgram = webgl.createShaderProgram();

        var loadShader = function (url: string, type: Jv.Games.WebGL.ShaderType) {
            return $.ajax(url, <JQueryAjaxSettings>{ dataType: "text" })
                .then(source => shaderProgram.addShader(type, source));
        };

        return $.when(
            loadShader("vertexShader.glsl.txt", Jv.Games.WebGL.ShaderType.Vertex),
            loadShader("fragmentShader.glsl.txt", Jv.Games.WebGL.ShaderType.Fragment)
        ).then(() => {
            shaderProgram.link();
            result.resolve(webgl);
            return webgl;
        }).fail(result.reject);
    });

    return result.promise();
}

window.onload = () => {
    var loadWebgl = setup().then(webgl => {
        alert("setup completed: " + webgl);
    }).fail(e => {
        alert("Error during setup");
    });
};