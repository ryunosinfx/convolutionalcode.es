/*Alessandro Corbetta
 * corbisoft@gmail.com
 * Conv Encoder simulator 1/02/11
 *
 */
class Util {
	static hammingWeightByInt(a, b, codewordBit) {
		let c = a ^ b;
		let weight = 0;
		for (let i = 0; i < codewordBit; i++) {
			weight += c % 2;
			c >>= 1;
		}
		return weight;
	}
	static hammingWeightByStr(a, b) {
		let weight = 0;
		for (let i = 0; i < a.length; i++) {
			if (a.charAt(i) !== b.charAt(i)) {
				weight++;
			}
		}
		return weight;
	}
	static getCodeWordStr(codeWordBitCount, codeWord) {
		const bits = new Array(codeWordBitCount);
		let tmpCdWrd = codeWord * 1;
		for (let i = 0; i < codeWordBitCount; i++) {
			bits[i] = tmpCdWrd % 2;
			tmpCdWrd >>= 1;
		}
		return bits.reverse().join('');
	}
	static getCodeWordBits(codeWordBitCount, codeWord) {
		const bits = [];
		for (let i = 0; i < codeWordBitCount; i++) {
			const v = (codeWord >>> i) % 2;
			bits.push(v);
		}
		return bits;
	}
	static uint8Cache = new Array(256);
	static getUint8BitList(uint8) {
		const cache = Util.uint8Cache;
		if (cache[uint8]) {
			return cache[uint8];
		}
		const bits = Util.getCodeWordBits(8, uint8);
		cache[uint8] = bits;
		return bits;
	}
	static toU8aFromBitArray(flatList, count) {
		const newU8a = new Uint8Array(count);
		for (let i = 0; i < count; i++) {
			const start = i * 8;
			const end = start + 8;
			const sub = flatList.slice(start, end);
			let v = 0;
			for (let j = 0; j < 8; j++) {
				v += sub[j] << j;
			}
			newU8a[i] = v;
		}
		return newU8a;
	}
}
// Dimensione dello spazio degli stati i.e. log_2 (states) | bit parola di codice
export const CodifEsempioLibro540 = {
	totStatesLog: 2,
	totCodeBit: 3,
	// stato | bit di info | parola di codice | stato in out
	data: [
		[0, 0, '000', 0],
		[0, 1, '111', 2],
		[1, 0, '001', 0],
		[1, 1, '110', 2],
		[2, 0, '011', 1],
		[3, 0, '101', 3],
		[3, 1, '010', 1],
		[2, 1, '100', 3],
	],
};
export const BitLength2 = {
	totStatesLog: 2,
	totCodeBit: 2,
	// stato | bit di info | parola di codice | stato in out
	data: [
		[0, 0, '00', 0],
		[0, 1, '11', 2],
		[1, 0, '00', 2],
		[1, 1, '11', 0],
		[2, 1, '01', 1],
		[2, 0, '01', 3],
		[3, 0, '01', 1],
		[3, 1, '10', 3],
	],
};
class State {
	static totStatesLog;
	static totStatesLogSet = false;
	static getTotStatesLog() {
		return State.totStatesLog;
	}
	static isTotStatesLogSet() {
		return State.totStatesLogSet;
	}
	static setTotStatesLog(totStatesLog) {
		if (!State.totStatesLogSet) {
			State.totStatesLog = totStatesLog;
			State.totStatesLogSet = true;
		}
	}
	constructor(myState) {
		this.myState = myState;
	}
	getMyState() {
		return this.myState;
	}
	hashCode() {
		const prime = 31;
		const state = this.myState;
		const hashCode = !state ? 0 : typeof state !== 'object' ? 1 : state.hashCode();
		const result = prime * 1 + hashCode;
		return result;
	}
	setMyState(myState) {
		this.myState = myState;
	}
}
class StateAndInfoBit {
	constructor(myStateInt, myInfoBit, myCodeWord, totCodeBit = 0) {
		this.initState = myStateInt;
		this.myState = new State(myStateInt);
		this.myInfoBit = myInfoBit;
		this.myCodeWord = myCodeWord;
		this.codeWordBitCount = totCodeBit;
	}
	getMyState() {
		return this.myState;
	}
	getMyInfoBit() {
		return this.myInfoBit;
	}
	getMyCodeWord() {
		return this.myCodeWord;
	}
	getMyCodeWordStr() {
		return Util.getCodeWordStr(this.codeWordBitCount, this.myCodeWord);
	}
	getMyCodeWordBits() {
		return Util.getCodeWordBits(this.codeWordBitCount, this.myCodeWord);
	}
	toString() {
		return JSON.stringify([this.myState.hashCode(), this.myInfoBit, this.initState]);
	}
}
class StateWithInflow extends State {
	constructor(myState) {
		super(myState);
		this.isInitialized = false;
		this.indexVect = 0;
	}
	getMyInflows() {
		return this.myInflows;
	}
	setInFlow(inFlow) {
		if (!this.isInitialized) {
			this.myInflows = new Array(2);
			this.isInitialized = true;
		}
		this.myInflows[this.indexVect] = inFlow;
		this.indexVect++;
	}
	toString() {
		const sb = ['State: ' + this.getMyState().toString()];
		if (this.isInitialized) {
			const myInflows0 = this.myInflows[0];
			sb.push(!myInflows0 ? ' first inflow not init ' : ' first inflow: ' + (myInflows0.getMyCodeWord() * 1).toString(2) + ' from ' + myInflows0.getMyState().getMyState().toString());
			const myInflows1 = this.myInflows[1];
			sb.push(!myInflows1 ? ' second inflow not init ' : ' second inflow: ' + (myInflows1.getMyCodeWord() * 1).toString(2) + ' from ' + myInflows1.getMyState().getMyState().toString());
		} else {
			sb.push(' not yet initialized!');
		}
		return sb.join('');
	}
}
class DecTrallisColumn {
	constructor(totStates, prev, refTrellis, codewordBit) {
		this.column = new Array(totStates);
		this.totStates = totStates;
		if (!prev) {
			this.setFirstSection();
			this.imAmFirst = true;
		} else {
			this.imAmFirst = false;
			this.setGeneralSection();
			this.prev = prev;
		}
		this.refTrellis = refTrellis;
		this.codewordBit = codewordBit;
	}
	getColumn() {
		return this.column;
	}
	setColumn(column) {
		this.column = column;
	}
	setGeneralSection(startIndex = 0) {
		const totStates = this.totStates;
		for (let i = startIndex; i < totStates; i++) {
			const col = new DecTrallisCell();
			col.setMyState(i);
			col.setFake();
			this.column[i] = col;
		}
	}
	setFirstSection() {
		const col = new DecTrallisCell();
		col.setStarter();
		col.setMyState(0);
		this.column[0] = col;
		this.setGeneralSection(1);
	}
	createWordSection(codeWord) {
		const its = this.refTrellis.orderedFinalStates; //stati di arrivo sul traliccio
		let zeroMetric = 0;
		let rejoinZeroStat = true; //mi sono ricongiunto allo stato iniziale?
		const state = { minMetric: 0, minState: -1, stateCons: 0, tempMetric: 0, from: new Array(2) };
		for (const now of its) {
			for (let i = 0; i < 2; i++) {
				this.codeParBit(now, codeWord, state, i);
			}
			if (state.stateCons === 0) {
				zeroMetric = state.tempMetric;
			} else if (state.tempMetric < zeroMetric) {
				rejoinZeroStat = false;
			}
			state.stateCons++;
		}
		const sb = [];
		this.column[state.minState].recursivePrint(sb);
		const infowordsIcarry = sb;
		return { flushoutOrder: false, infowordsIcarry };
	}
	codeParBit(now, codeWord, state, i) {
		let changed = false; // ho fatto delle modifiche al tratto che considero
		const fromFlow = now.getMyInflows(); //dato il mio stato capisco da quale coppia di stati entro
		const stateCons = state.stateCons;
		const currentCol = this.column[stateCons];
		const currentFormFlow = fromFlow[i];
		const currentForm = currentFormFlow.getMyState().getMyState() * 1; //trovo gli indici della coppia di stati di input
		state.from[i] = currentForm;
		const prevCol = this.prev.getColumn()[currentForm];
		if (prevCol.isActive) {
			const prevMyWholeMetric = prevCol.getMyWholeMetric();
			const tempMetric = Util.hammingWeightByInt(codeWord, currentFormFlow.getMyCodeWord() * 1, this.codewordBit) + prevMyWholeMetric;
			if (currentCol.isActive) {
				//se io sono attivo confronto
				if (tempMetric < currentCol.getMyWholeMetric()) {
					//devo aggiornare
					currentCol.setMyWholeMetric(tempMetric);
					currentCol.from = prevCol;
					currentCol.setMyInfoBit(currentFormFlow.getMyInfoBit());
					if (state.minState === -1) {
						state.minState = stateCons;
						state.minMetric = tempMetric;
					} else if (tempMetric < state.minMetric) {
						state.minState = stateCons;
						state.minMetric = tempMetric;
					}
				}
			} else {
				currentCol.isActive = true;
				currentCol.setMyWholeMetric(tempMetric);
				currentCol.from = prevCol;
				currentCol.setMyInfoBit(currentFormFlow.getMyInfoBit());
				if (state.minState === -1) {
					state.minState = stateCons;
					state.minMetric = tempMetric;
				} else if (tempMetric < state.minMetric) {
					state.minState = stateCons;
					state.minMetric = tempMetric;
				}
			}
			state.tempMetric = tempMetric;
		} else {
			console.log('\t\t not active! skipping...');
		}
		return {};
	}
}

class DecTrallisCell {
	constructor() {
		this.isActive = false;
		this.from = null;
		this.myInfoBit = null;
		this.myState = null;
		this.isActiveForGraph = null;
	}
	getMyState() {
		return myState;
	}
	setMyState(myState) {
		this.myState = myState;
	}
	getMyInfoBit() {
		return this.myInfoBit;
	}
	setMyInfoBit(myInfoBit) {
		this.myInfoBit = myInfoBit;
	}
	setStarter() {
		this.isActive = true;
		this.myWholeMetric = 0;
		this.from = null;
	}
	setFake() {
		this.isActive = false;
	}
	getMyWholeMetric() {
		return this.myWholeMetric;
	}
	setMyWholeMetric(myWholeMetric) {
		this.myWholeMetric = myWholeMetric;
	}
	recursivePrint(sb) {
		if (this.from != null) {
			this.from.recursivePrint(sb);
			sb.push(this.myInfoBit);
		}
	}
}
class Trellis {
	constructor(trellisConfig = CodifEsempioLibro540) {
		this.trellisMap = new Map();
		this.codingCorrespMap = new Map();
		this.loadTrellis(trellisConfig);
	}
	loadTrellis(trellisConfig) {
		this.totStatesLog = trellisConfig.totStatesLog;
		this.totCodeBit = trellisConfig.totCodeBit;
		const data = trellisConfig.data;
		const len = 1 << this.totStatesLog; //4
		const lenPlus = 1 << (this.totStatesLog + 1); //8
		const ouputAlreadyConsid = new Array(len);
		ouputAlreadyConsid.fill(null);
		for (let i = 0; i < lenPlus; i++) {
			const row = data[i];
			const state = row[0];
			const infoBit = row[1];
			const codeword = parseInt(row[2], 2);
			const outState = row[3];
			const from = new StateAndInfoBit(state, infoBit, codeword, this.totCodeBit);
			let to = ouputAlreadyConsid[outState];
			if (to == null) {
				to = new StateWithInflow(outState);
				ouputAlreadyConsid[outState] = to;
			}
			const fromKey = from.toString();
			this.trellisMap.set(fromKey, to);
			this.codingCorrespMap.set(fromKey, from);
		}
		//backward link 4 decoding
		const itOnKeys = this.trellisMap.keys();
		for (const key of itOnKeys) {
			const from = this.codingCorrespMap.get(key);
			this.trellisMap.get(key).setInFlow(from);
		}
		const orderedFinalStates = [];
		for (const value of this.trellisMap.values()) {
			orderedFinalStates.push(value);
		}
		orderedFinalStates.sort();
		this.orderedFinalStates = ouputAlreadyConsid;
		return true;
	}
	codedOut(stateInput, infoBit) {
		const stWithInfoTmp1 = new StateAndInfoBit(stateInput.myState, infoBit);
		const stWithInfoTmp2 = this.codingCorrespMap.get(stWithInfoTmp1.toString());
		const codeWord = stWithInfoTmp2.getMyCodeWordBits();
		const state = this.trellisMap.get(stWithInfoTmp2.toString());
		return { codeWord, state };
	}
}
export class Encoder {
	constructor(trellisConfig) {
		this.trellis = new Trellis(trellisConfig);
		this.totStatesLog = this.trellis.totStatesLog;
		this.codeWordBit = this.trellis.totCodeBit;
		this.reset();
	}
	reset() {
		this.state = new State(0);
	}
	encode(infoBitInput) {
		const infoBit = infoBitInput !== 0 ? 1 : 0;
		const outWord = this.trellis.codedOut(this.state, infoBit);
		this.state = outWord.state;
		return outWord.codeWord;
	}
}
export class DecodingTrallisSupport {
	constructor(totStates, refTrallis) {
		this.totStates = totStates;
		this.refTrallis = refTrallis;
		this.codewordBit = this.refTrallis.totCodeBit;
		this.reset();
	}
	reset() {
		this.myColumns = [this.createDecTrallisColumn()];
		this.myTime = 0;
	}
	createDecTrallisColumn(col = null) {
		return new DecTrallisColumn(this.totStates, col, this.refTrallis, this.codewordBit);
	}
	addSection(codeWord) {
		const myCol = this.myColumns[this.myTime];
		const newCol = this.createDecTrallisColumn(myCol);
		this.myTime++;
		this.myColumns[this.myTime] = newCol;
		const decOutput = newCol.createWordSection(codeWord);
		return decOutput.infowordsIcarry;
	}
}
export class VitDecoder {
	constructor(trellisConfig) {
		this.trellis = new Trellis(trellisConfig);
		this.totStatesLog = this.trellis.totStatesLog;
		this.codeWordBit = this.trellis.totCodeBit;
		this.reset();
	}
	reset() {
		this.myState = new State(0);
		this.myDecSupp = new DecodingTrallisSupport(1 << this.totStatesLog, this.trellis);
	}
	addTransmittedWord(word) {
		const codeWordNum = parseInt(word, 2);
		return this.myDecSupp.addSection(codeWordNum).join('');
	}
	addSection(codeWordNum) {
		return this.myDecSupp.addSection(codeWordNum);
	}
}
export class ConvolutionalCode {
	constructor(trellisConfig) {
		this.cache = {};
		this.encoder = new Encoder(trellisConfig);
		this.decoder = new VitDecoder(trellisConfig);
	}
	reset(trellisConfig) {
		this.encoder = new Encoder(trellisConfig);
		this.decoder = new VitDecoder(trellisConfig);
	}
	encode(u8a) {
		const encoder = this.encoder;
		const bitsList = [];
		encoder.reset();
		let lastList = [];
		for (const uint8 of u8a) {
			const bits = Util.getUint8BitList(uint8);
			bitsList.push(bits.join(''));
			for (const bit of bits) {
				const cwBits = encoder.encode(bit);
				lastList.push(cwBits);
			}
		}
		const flatList = lastList.flat();
		const count = u8a.length * encoder.codeWordBit;
		return Util.toU8aFromBitArray(flatList, count);
	}
	decode(u8a) {
		const decoder = this.decoder;
		decoder.reset();
		let bitsList = [];
		for (const uint8 of u8a) {
			const bits = Util.getUint8BitList(uint8);
			for (const bit of bits) {
				bitsList.push(bit);
			}
		}
		const bitsLista = bitsList.flat();
		const codeWordBit = decoder.codeWordBit;
		const count = Math.ceil(bitsLista.length / codeWordBit);
		let lastOne = [];
		for (let i = 0; i < count; i++) {
			const start = i * codeWordBit;
			const end = start + codeWordBit;
			const sub = bitsLista.slice(start, end);
			let v = 0;
			for (let j = 0; j < codeWordBit; j++) {
				v += sub[j] << j;
			}
			lastOne = decoder.addSection(v);
		}
		const countByte = Math.ceil(u8a.length / codeWordBit);
		return Util.toU8aFromBitArray(lastOne, countByte);
	}
}
