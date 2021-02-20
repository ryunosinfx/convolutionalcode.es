import { V } from './util/V.js';
import { B64Util } from './util/b64util.js';
import { ConvolutionalCode, BitLength2, CodifEsempioLibro540 } from './ConvolutionalCode.js';
class Main {
	constructor() {
		const encodeInpueElm = V.gid('encode-input');
		const bitNumElm = V.gid('bit-num');
		const byteLengthElm = V.gid('byte-length');
		const encodeResultElm = V.gid('encode-result');
		const encodedCopyElm = V.gid('encoded-copy');
		const noiseLevelElm = V.gid('noise-level');
		const decodeInputElm = V.gid('decode-input');
		const decodeIsValidElm = V.gid('decode-is-valid');
		const copyErrorRateElm = V.gid('copy-error-rate');
		const decodeResultElm = V.gid('decode-result');

		const func = () => {
			const conf = bitNumElm.value * 1 === 2 ? BitLength2 : CodifEsempioLibro540;
			this.ConvolutionalCode = new ConvolutionalCode(conf);
			const value = encodeInpueElm.value;
			const u8a = B64Util.s2u8a(value);
			const decoded = this.ConvolutionalCode.encode(u8a);
			byteLengthElm.textContent = u8a.length + 'bytes';
			encodeResultElm.value = B64Util.u8a2b64(decoded);
		};
		V.ael(encodeInpueElm, 'input', func);
		V.ael(bitNumElm, 'change', func);
		const func3 = () => {
			if (!this.ConvolutionalCode) {
				const conf = bitNumElm.value === 2 ? BitLength2 : CodifEsempioLibro540;
				this.ConvolutionalCode = new ConvolutionalCode(conf);
			}
			const b64 = decodeInputElm.value;
			const u8a = B64Util.b64ToU8a(b64);
			const decodedU8a = this.ConvolutionalCode.decode(u8a);
			const s = B64Util.u8aToUtf8(decodedU8a);
			const value = encodeInpueElm.value;
			const u8aInput = B64Util.s2u8a(value);
			const len = u8a.length;
			const lenInput = u8aInput.length;
			let count = 0;
			for (let i = 0; i < len && i < lenInput; i++) {
				count += u8a[i] === u8aInput[i] ? 0 : 1;
			}
			if (count === len && len === lenInput) {
				decodeIsValidElm.textContent = 'COMPLETE!!!!';
			} else {
				decodeIsValidElm.textContent = Math.floor((count / len) * 10000) / 100 + '%';
			}
			decodeResultElm.value = s;
		};
		const func2 = () => {
			const nozeLevel = noiseLevelElm.value;
			const b64 = encodeResultElm.value;
			const u8a = B64Util.b64ToU8a(b64);
			const len = u8a.length;
			const bsChannel = new BSChannel(nozeLevel / 100);
			const newU8a = bsChannel.transit(u8a);
			let count = 0;
			for (let i = 0; i < len; i++) {
				count += u8a[i] === newU8a[i] ? 0 : 1;
			}
			copyErrorRateElm.textContent = count / len;
			decodeInputElm.value = B64Util.u8a2b64(newU8a);
			func3();
		};
		V.ael(encodedCopyElm, 'click', func2);
		V.ael(decodeInputElm, 'input', func3);
	}
}

/*Alessandro Corbetta
 * corbisoft@gmail.com
 * Conv Encoder simulator 1/02/11
 *
 */
export class BSChannel {
	constructor(myProbab) {
		this.myProbab = myProbab;
	}
	transit(u8a) {
		const newU8a = new Uint8Array(u8a.length);
		let index = 0;
		for (const u8 of u8a) {
			let value = 0;
			for (let i = 0; i < 8; i++) {
				const bit = (u8 >>> i) % 2;
				const tran = this.transition(bit);
				value += tran << i;
			}
			newU8a[index] = value;
			index++;
		}
		return newU8a;
	}
	transition(bit) {
		let boolBit = bit !== 0;
		const val = Math.random();
		if (val < this.myProbab) {
			boolBit = !boolBit;
		}
		return boolBit ? 1 : 0;
	}
}

V.init();
new Main();
