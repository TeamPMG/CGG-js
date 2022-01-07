(() => {
  onload = async () => {
    const noiseSize = 512;
    const rnorm = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
    const generateNoise = (noiseSize, truncationThreshold) =>  {
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
      return noise
    }
    const noises = []
    noises[0] = generateNoise(512, 0);
    for (let i = 0; i < 8; i++) {
      noises[i] = noises[0];//generateNoise(512, 2);
    }

    const generate = async (mapping = null, generator = null, context = null) => {
      const styleChangePoint = document.querySelector('#styleBar').value
      const truncationThreshold  = document.querySelector('#thresholdBar').value;

      for (let i = styleChangePoint; i < 8; i++) {
        noises[i] = generateNoise(noiseSize, truncationThreshold);
      }
      if (mapping === null || generator === null || context === null) return false
      console.log('called generate function');
      const style = new Float32Array(noiseSize * 8);
      for (let i = 0; i < 8; i++) {
        const tensorNoise = new ort.Tensor('float32', noises[i], [1, noiseSize]);
        const output = await mapping.run({'x.1':tensorNoise});
        const outputTensor = output['80'].data;
        for (let j = 0; j < noiseSize; j++) {
          style[i * noiseSize + j] = outputTensor[j];
        }
      }

      const styleTensor = new ort.Tensor('float32', style, [8, 1, noiseSize]);
      generator.run({'0':styleTensor}).then((output) => {
        console.log('finish running the model');
        const outputTensor = output['1963']; //レイヤーの名前？
        context.drawGeneratedImage(generatedImage = outputTensor.data);
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


    //thresholdやstyleの表示
    const threshold = document.querySelector('#threshold');
    const thresholdBar = document.querySelector('#thresholdBar');
    threshold.innerText = thresholdBar.value;
    thresholdBar.addEventListener('input', () => {threshold.innerText = thresholdBar.value;});

    const style = document.querySelector('#style');
    const styleBar = document.querySelector('#styleBar');
    style.innerText = styleBar.value;
    styleBar.addEventListener('input', () => {style.innerText = styleBar.value;});
  }
})()
