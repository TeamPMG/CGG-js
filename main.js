var canv, cont
var c = console;

function init(){
  canv = document.getElementById('output');
  cont = canv.getContext('2d');
	myOnnxSession = new onnx.InferenceSession({backendHint: 'cpu'});
	myOnnxSession.loadModel("./generator.onnx");
	model = myOnnxSession;
}

function rnorm(){
    return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

function generate(){
	noise_size = 256;
  		var noise= new Float32Array(noise_size)
  		for(i=0; i<noise_size; i=i+1){
    	noise[i]=rnorm()
  	}
  	noise = new onnx.Tensor(noise, 'float32', [1,256]);
	model.run([noise]).then((output) => {
          // consume the output
          const outputTensor = output.values().next().value;
          drawGeneratedImage(generatedImage = outputTensor.data)
          console.log(outputTensor)
        });
}