export const getGradientColor = (value: number) => {
  var startColor = [0, 0, 255]; // 青 (#0000ff)
  var middleColor = [0, 255, 0]; // 緑 (#00ff00)
  var endColor = [255, 0, 0]; // 赤 (#ff0000)

  if (value <= 0.5) {
    var r = Math.round(startColor[0] + (middleColor[0] - startColor[0]) * (value * 2));
    var g = Math.round(startColor[1] + (middleColor[1] - startColor[1]) * (value * 2));
    var b = Math.round(startColor[2] + (middleColor[2] - startColor[2]) * (value * 2));
  } else {
    var r = Math.round(middleColor[0] + (endColor[0] - middleColor[0]) * ((value - 0.5) * 2));
    var g = Math.round(middleColor[1] + (endColor[1] - middleColor[1]) * ((value - 0.5) * 2));
    var b = Math.round(middleColor[2] + (endColor[2] - middleColor[2]) * ((value - 0.5) * 2));
  }

  var colorCode = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);


  return colorCode;
}

const componentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}