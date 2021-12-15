const noiseSize = 512;
const truncationThreshold  = 2;

(() => {
  onload = async () => {
    const rnorm = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

    const generate = (mapping = null, generator = null, context = null) => {
      if (mapping === null || generator === null || context === null) return false
      console.log('called generate function');
      const noise = new Float32Array(noiseSize);
      for (let i = 0; i < noiseSize; i++) {
        noise[i] = rnorm();
        if (truncationThreshold != 0) {
          //if (Math.abs(noise[i]) > truncationThreshold) noise[i] = truncationThreshold * noise[i] / Math.abs(noise[i])
          while (Math.abs(noise[i]) > truncationThreshold) {
            noise[i] = rnorm();
          }
        }
      }

      const tensorNoise = new ort.Tensor('float32', noise, [1, noiseSize]);
      mapping.run({'x.1':tensorNoise}).then((output) => {
        const outputTensor = output['80'].data; //レイヤーの名前？
        const style = new Float32Array(noiseSize * 8);
        for (let i = 0; i < noiseSize; i++) {
          for (let j = 0; j < 8; j++){
            style[i + j * noiseSize] = outputTensor[i];
          }
        }
        const styleTensor = new ort.Tensor('float32', style, [8, 1, noiseSize]);

        generator.run({'0':styleTensor}).then((output) => {
          console.log('finish running the model');
          const outputTensor = output['1963']; //レイヤーの名前？
          console.log(output)
          context.drawGeneratedImage(generatedImage = outputTensor.data);
          console.log('result', outputTensor);
        });
      });
    }
    
    // Initialize
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const generator = await ort.InferenceSession.create('./generator.onnx');
    const mapping = await ort.InferenceSession.create('./mapping.onnx');
    const button = document.querySelector('button');
    button.addEventListener('click', () => generate(mapping, generator, context));
    button.removeAttribute('disabled');
  }
})()
