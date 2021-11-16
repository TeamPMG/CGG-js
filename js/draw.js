const [imageWidth, imageHeight] = [256, 256 * 3]

CanvasRenderingContext2D.prototype.drawImageByData = function(data, width, height, find, px, x, y) {
  let dy = y + px / 2
  let idx = find
  const rgb = []

  for (let i = 0; i < height; i++) {
    let dx = x + px / 2
    for (let j = 0; j < width; j++) {
      for (let k = 0; k < 3; k++) rgb[k] = (data[idx + (data.length / 3) * k] * 127.5 + 127.5)
      this.drawFillBox(dx, dy, px + 1, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
      dx += px
      idx += 1
    }
    dy += px
  }

  console.timeEnd()
  console.log('%cDebug', 'color:#0093EF;font-weight:bold', `id:{idx}`)
  console.log('%cDebug %cSuccessful', 'color:#0093EF;font-weight:bold', 'color:#F53300;font-weight:bold', 'draw an Image')
}

CanvasRenderingContext2D.prototype.drawGeneratedImage = function(generatedData) {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.drawImageByData(generatedData, imageWidth, imageHeight, 0, 256 / 256, 0, 0)
}

