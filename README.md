# convolutionalcode.es
Encoder decoder for trellis based convolutional codes ported from  acorbe / convEncoder 



# Live demo

https://ryunosinfx.github.io/convolutionalcode.es/index.html

# usage
https://ryunosinfx.github.io/convolutionalcode.es
## encode 
```EJS
<script type="module" src="./ConvolutionalCode.js">
import { ConvolutionalCode, BitLength2, CodifEsempioLibro540 } from './ConvolutionalCode.js';
  // Ratio :1/2　-> BitLength2
  // Ratio :1/3　-> CodifEsempioLibro540
  const config = BitLength2; // or CodifEsempioLibro540
  
  // input byte data
  const planeUint8array = new Uint8Array([xxxxxxxxxxxxxxxxxxxxxxxxxx]);

  const convolutionalCode = new ConvolutionalCode(config);
  const encordedUint8Array = convolutionalCode.encode(planeUint8array);
      
</script>
```
## decode 
```EJS
<script type="module" src="./ConvolutionalCode.js">
import { ConvolutionalCode, BitLength2, CodifEsempioLibro540 } from './ConvolutionalCode.js';
  // Ratio :1/2　-> BitLength2
  // Ratio :1/3　-> CodifEsempioLibro540
  const config = BitLength2; // or CodifEsempioLibro540
  
  // input byte data
  const encordedUint8Array = new Uint8Array([yyyyyyyyyyyyyyyyyyyyyyy]); 

  const convolutionalCode = new ConvolutionalCode(config);
  const decodedUint8Array = convolutionalCode.decode(encordedUint8Array);
    
</script>


## Licence

MIT
