(() => {
  onload = () => {
    let [canv, cont] = [null, null]
    const noise_size = 256

    const rnorm = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())

    const init = () => {
      canv = document.getElementById('output')
      cont = canv.getContext('2d')
      myOnnxSession = new onnx.InferenceSession({backendHint: 'webgl'})
      myOnnxSession.loadModel('./generator.onnx')
      model = myOnnxSession
    }

    const generate = () => {
      const noise= new Float32Array(noise_size)
      for (let i = 0; i < noise_size; i++) noise[i] = rnorm()
      noise = new onnx.Tensor(noise, 'float32', [1,256])

      model.run([noise]).then((output) => {
        const outputTensor = output.values().next().value;
        drawGeneratedImage(generatedImage = outputTensor.data)
        console.log(outputTensor)
      });
    }

    document.querySelector('button').addEventListener('click', () => generate())
  }
})()
