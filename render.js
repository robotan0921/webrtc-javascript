var src;
var dest;

function renderStart() {

  var video = document.getElementById('their-video');
  var buffer = document.createElement('canvas');
  var display = document.getElementById('display_canvas');
  var bufferContext = buffer.getContext('2d');
  var displayContext = display.getContext('2d');

  var render = function() {
    requestAnimationFrame(render);
    var width = video.videoWidth;
    var height = video.videoHeight;
    if (width == 0 || height == 0) {return;}
    buffer.width = display.width = width;
    buffer.height = display.height = height;
    bufferContext.drawImage(video, 0, 0);

    src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ（サイズはカメラ画像と一緒）

    contrast();


    displayContext.putImageData(dest, 0, 0);
  };
  render();
}

function contrast() {
  for (var i = 0; i < dest.data.length; i += 4) {
    dest.data[i + 0] = 255 - src.data[i + 0]; // Red
    dest.data[i + 1] = 255 - src.data[i + 1]; // Green
    dest.data[i + 2] = 255 - src.data[i + 2]; // Blue
    dest.data[i + 3] = 255;                     // Alpha
  }
}
