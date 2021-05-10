const [wid, hig] = [8, 8]

CanvasRenderingContext2D.prototype.drawImageByData = function(data, width, height, find, px, x, y) {
  let dy = y + px / 2
  let idx = find
  const rgb = []

  for (let hc=0; hc < height; hc++) {
    let dx = x + px / 2
    for (let wc = 0; wc < width; wc++) {
      for (let i = 0; i < 3; i++) rgb[i] = (data[idx + (data.length / 3) * i] * 127.5 + 127.5)
      this.drawFillBox(dx, dy, px + 1, `rgb({rgb[0]}, {rgb[1]}, {rgb[2]})`)
      dx += px
      idx += 1
    }
    dy += px;
  }

  console.timeEnd()
  console.log('%cDebug', 'color:#0093EF;font-weight:bold', `id:{idx}`)
  console.log('%cDebug %cSuccessful', 'color:#0093EF;font-weight:bold', 'color:#F53300;font-weight:bold', 'draw an Image')
}

CanvasRenderingContext2D.prototype.drawGeneratedImage = function(generatedData) {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.drawImageByData(generatedData, wid, hig, 0, 128 / 8, 0, 0)
}

