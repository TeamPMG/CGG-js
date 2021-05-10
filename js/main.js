(() => {
  onload = () => {    
    const rnorm = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())

    const generate = (model = null, context = null) => {
      if (model === null || context === null) return false
      console.log('called generate function')

      const noise = new Float32Array(noiseSize)
      for (let i = 0; i < noiseSize; i++) noise[i] = rnorm()
      const tensorNoise = new onnx.Tensor(noise, 'float32', [1, 256])

      model.run([tensorNoise]).then((output) => {
        console.log('finish running the model')
        const outputTensor = output.values().next().value
        context.drawGeneratedImage(generatedImage = outputTensor.data)
        console.log('result', outputTensor)
      });
    }
    
    // Initialize
    const noiseSize = 256
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    const myOnnxSession = new onnx.InferenceSession({backendHint: 'webgl'})

    // Load model
    myOnnxSession.loadModel('generator.onnx').then(() => {
      const model = myOnnxSession
      const button = document.querySelector('button')
      button.addEventListener('click', () => generate(model, context))
      button.removeAttribute('disabled')
    })
  }
})()
