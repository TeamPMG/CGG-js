CanvasRenderingContext2D.prototype.drawDot = function(x, y, size, color){
  this.beginPath();
  this.fillStyle=color;
  this.arc(x, y, size, Math.PI * 2, false);
  this.fill();
}

CanvasRenderingContext2D.prototype.drawLine = function(x, y, x1, y1, bold, color){
  this.beginPath();
  this.lineWidth=bold;
  this.strokeStyle=color;
  this.moveTo(x,y);
  this.lineTo(x1,y1);
  this.closePath();
  this.stroke();
}

CanvasRenderingContext2D.prototype.drawGrid=function(x,y,size,width,height,bold,color){
  let [drawX, drawY] = [0, y - height / 2 * size + size / 2];
  for (let i = 0; i < height; i++) {
    drawX = x - width / 2 * size + size / 2;
    for (let j = 0; j < width; j++) {
      this.drawBox(drawX, drawY, size, bold, color);
      drawX += size;
    }
    drawY += size;
  }
}

CanvasRenderingContext2D.prototype.drawBox = function(x, y, size, bold, color){
  this.beginPath();
  this.lineWidth=bold;
  this.strokeStyle=color;
  this.strokeRect(x - size / 2, y - size / 2, size, size);
}

CanvasRenderingContext2D.prototype.drawFillBox = function(x, y, size, color){
  this.beginPath();
  this.fillStyle=color;
  this.fillRect(x - size / 2, y - size / 2, size, size);
}

CanvasRenderingContext2D.prototype.drawText = function(text, x, y, font, bold, size, color, center, fill){
  !fill && this.lineWidth = bold
  center && (x -= text.length / 2 * (size / 2))

  this.beginPath()
  this.font=`${size}px ${font}`
  this[fill ? 'fillStyle' : 'strokeStyle'] = color
  this[fill? 'fillText' : 'strokeText'](text, x, y)
}
