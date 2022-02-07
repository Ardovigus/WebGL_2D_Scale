function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert("!gl occured");
      return;
    }
  
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  
    var positionLocation = gl.getAttribLocation(program, "a_position");
  
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");
    var scaleLocation = gl.getUniformLocation(program, "u_scale");
  
    var positionBuffer = gl.createBuffer();
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    setGeometry(gl, 0, 0);
  
    var translation = [0, 0];
    var rotation = [0, 1];
    var scale = [1, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];
  
    drawScene();
  
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});    
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  
    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }
  
    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        drawScene();
      }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(positionLocation);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);
    
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
        gl.uniform4fv(colorLocation, color);
    
        gl.uniform2fv(translationLocation, translation);
    
        gl.uniform2fv(rotationLocation, rotation);

        gl.uniform2fv(scaleLocation, scale);
    
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;
        gl.drawArrays(primitiveType, offset, count);
    }
}
  
function setGeometry(gl, x, y) {
    var width = 100;
    var height = 150;
    var thickness = Math.floor(Math.random() * (50 - 30 + 1) ) + 30;
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x, y,
            x + thickness, y,
            x, y + height,
            x, y + height,
            x + thickness, y,
            x + thickness, y + height,

            x + thickness, y,
            x + width, y,
            x + thickness, y + thickness,
            x + thickness, y + thickness,
            x + width, y,
            x + width, y + thickness,

            x + thickness, y + thickness * 2,
            x + width * 2 / 3, y + thickness * 2,
            x + thickness, y + thickness * 3,
            x + thickness, y + thickness * 3,
            x + width * 2 / 3, y + thickness * 2,
            x + width * 2 / 3, y + thickness * 3,
        ]),
        gl.STATIC_DRAW);
}
  
main();