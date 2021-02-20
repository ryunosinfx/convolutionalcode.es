import { JLabel, JTextField, Container, FlowLayout } from './util/FakeAWT.js';

export class LaunchB2 {
	static main() {
		const path = JOptionPane.showInputDialog('Please insert a correctly formatted trellis file:', 'CodifEsempioLibro540.txt');
		const bscTransProbab = JOptionPane.showInputDialog('Please insert the transition probability of the BSC', '0.1');
		new LaunchB2(path, bscTransProbab);
	}
	constructor(path, bscTransProbab) {
		const bscTransProbabDouble = bscTransProbab * 1;
		this.myFacadeClass = new Joint(path, bscTransProbabDouble);
		this.transProb = bscTransProbabDouble;
		this.myGui = new Gui(this.myFacadeClass.linkToTrellisPanel(), this.myFacadeClass.linkToTrellisShow());
	}
}
const PADh = 500;
const PADl = 600;
class DecTrellisFrame extends JPanel {
	constructor(myColumns, myTime, totStates) {
		super();
		this.myColumns = myColumns;
		this.myTime = myTime;
		this.totStates = totStates;
		this.setPreferredSize(new Dimension(PADl, PADh));
		//this.setBounds(0, 0, 500, 20);
		this.myXs = this.getX();
		this.myXf = this.getX() + this.getWidth();
	}

	paintComponent(g) {
		const myColumns = this.myColumns;
		const myTime = this.myTime;
		const totStates = this.totStates;
		const circleDiameter = 15;
		const firstCircleVertex = 30;
		const radius = circleDiameter / 2;
		super.paintComponents(g);
		this.removeAll();

		const circleVertexDistanceHor = (PADl - 2 * firstCircleVertex) / (myTime + 1);

		const g2 = g;
		const w = this.getWidth();
		const h = this.getHeight();

		const circleVertexDistance = h / totStates;
		const coordinatesL = new double[totStates][myTime + 1][2]();
		const coordinatesR = new double[totStates][myTime + 1][2]();
		const coordinatesTx = new double[totStates][myTime + 1]();

		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		g2.setBackground(Color.gray);
		g2.clearRect(0, 0, w, h);
		for (let onTime = 0; onTime <= myTime; onTime++) {
			const x = firstCircleVertex + onTime * circleVertexDistanceHor;
			const onTimeCol = myColumns[onTime].getColumn();
			for (let i = 0; i < totStates; i++) {
				const y = firstCircleVertex + i * circleVertexDistance;
				g2.draw(new Ellipse2D.Double(x, y, circleDiameter, circleDiameter));
				//g2.draw(new Ellipse2D.Double(w-firstCircleVertex-circleDiameter,firstCircleVertex + i*circleVertexDistance,circleDiameter,circleDiameter));
				g2.setFont(new Font('Arial', Font.BOLD, 16));
				const col1 = onTimeCol[i];
				if (col1.isActive) {
					col1.isActiveForGraph = false;
					g2.drawString(col1.getMyWholeMetric() + '', x, y);
				}
				const l2 = coordinatesL[i][onTime];
				//g2.drawString(Integer.toBinaryString(i),w-firstCircleVertex-circleDiameter + radius/2 ,(int)(firstCircleVertex + radius* 4/3  + i*circleVertexDistance));
				l2[0] = x;
				l2[1] = y + radius;

				//coordinatesR[i][0] = w-firstCircleVertex-circleDiameter;
				//coordinatesR[i][1] = firstCircleVertex + i*circleVertexDistance + radius;
			}
		}

		const myTimeCol = myColumns[myTime].getColumn();
		for (let i = 0; i < totStates; i++) {
			myTimeCol[i].isActiveForGraph = true;
		}

		for (let onTime = myTime; onTime > 0; onTime--) {
			const onTimeCol = myColumns[onTime].getColumn();
			for (let i = 0; i < totStates; i++) {
				const col1 = onTimeCol[i];
				if (col1.isActive && col1.isActiveForGraph) {
					const form = col1.from;
					const stateFrom = form.getMyState();
					const l1 = coordinatesL[stateFrom][onTime - 1];
					const l2 = coordinatesL[i][onTime];
					g2.draw(new Line2D.Double(l1[0] + circleDiameter, l1[1], l2[0], l2[1]));
					form.setActiveForGraph(true);
				}
			}
		}
	}
}
class DecTrellisWindow extends JFrame {
	constructor() {
		super('Decoding Trellis');
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		const globCont = this.getContentPanel();
		globCont.add(myDecTrellisFrame);
		this.pack();
		this.setVisible(true);
	}
}

class Gui extends JFrame {
	constructor(trellisFr, trellisShow) {
		super('[Convol Enc - Trans - Dec] Alessandro Corbetta');
		//this.setLayout(new FlowLayout());
		this.trellisFr = trellisFr;
		this.trellisShow = trellisShow;

		this.globCont = this.getContentPanel();
		this.globCont.setLayout(new FlowLayout());

		this.centerCont = new Container();
		this.centerCont.setLayout(new FlowLayout());

		this.centerCont.add(this.trellisFr);

		this.wordPn = new InputForm();
		this.centerCont.add(this.wordPn);

		this.rightCont = new JPanel();
		this.rightCont.add(this.trellisShow);

		this.centerCont.add(this.rightCont);

		this.globCont.add(this.centerCont);

		this.pack();
		this.setVisible(true);
	}
}

class InputForm extends Container {
	constructor() {
		super();
		const transProb = 0.1;
		this.myFacadeClass = new Joint(transProb);
		this.setLayout(new GridLayout(0, 1));

		this.inputLabel = new JLabel('Insert information sequence [ 0,1 array]: ');
		this.add(this.inputLabel);

		this.inputField = new JTextField(20);
		this.add(this.inputField);

		this.encodeAndSend = new JButton('Encode and Send!');
		this.encodeAndSend.addActionListener(() => {
			this.myFacadeClass.resetEnc();
			const trellisShow = this.myFacadeClass.linkToTrellisShow();
			//JOptionPane.showMessageDialog(null,  (trellisShow.getComponentCount()));

			this.rightCont.remove(0);
			this.rightCont.add(trellisShow);
			trellisShow.repaint();
			const seq = this.myFacadeClass.CodeTransfDecode4Win(inputField.getText());
			this.encodedField.textContent = seq.codeS;
			this.arrivedField.textContent = seq.trasS;
			this.decodedField.textContent = seq.decS;
			this.TransProp.textContent = 'Transmission errors: ' + seq.codingErr + ' over ' + this.myFacadeClass.getTotCodedBit() + ' simbols';

			this.decProp.textContent = 'Decoding errors: ' + seq.bitErr + ' over ' + this.myFacadeClass.getTotalInfobit() + ' bit';
			// TODO Auto-generated method stub
		});
		this.add(this.encodeAndSend);

		this.encodedLabel = new JLabel('Encoded String:');
		this.add(this.encodedLabel);
		this.encodedField = new JTextField(40);
		this.add(this.encodedField);

		const BSCprop = new JLabel('Transmission through BSC with transition probability p=' + Double.toString(transProb), JLabel.RIGHT);
		BSCprop.setFont(new Font('sansserif', Font.ITALIC, 12));
		this.add(BSCprop);

		this.arrivedLabel = new JLabel('Received String:');
		this.add(this.arrivedLabel);
		this.arrivedField = new JTextField(40);
		this.add(this.arrivedField);
		const TransProp = new JLabel('Transmission errors: N/A', JLabel.RIGHT);
		TransProp.setFont(new Font('sansserif', Font.ITALIC, 12));
		this.add(TransProp);
		this.decodedLabel = new JLabel('Decoded String:');
		this.add(this.decodedLabel);
		this.decodedField = new JTextField(20);
		this.add(this.decodedField);

		const decProp = new JLabel('Decoding errors: N/A', JLabel.RIGHT);
		decProp.setFont(new Font('sansserif', Font.ITALIC, 12));
		this.add(decProp);

		this.buttonAbout = new JButton('About...');
		this.buttonAbout.addActionListener(() => {
			// TODO Auto-generated method stub
			JOptionPane.showMessageDialog(
				null,
				'A small program to simulate convolutional encoding...\n' +
					'Homework for the exam: Coding Theory and Structure of Convolutional Codes\n' +
					'at Politecnico di Torino (2011)\n' +
					'1,5K+ codelines and 6 days of hard work\n' +
					'\n' +
					'by Alessandro Corbetta\n' +
					'           alessandro.corbetta@hotmail.com\n' +
					'                                                                                 1/02/2011\n' +
					'\n' +
					'\n' +
					'P.S. try other trellis files!!\n ' +
					'(the program is not protected against bad filling of the trellis file - follow the template!)\n\n' +
					'' +
					'peace',
				'About..',
				JOptionPane.INFORMATION_MESSAGE
			);
		});
		this.add(buttonAbout);
	}
}

class TrellisFrame extends JPanel {
	constructor(totStatesLog) {
		super();
		this.totStatesLog = totStatesLog;
		this.setPreferredSize(new Dimension(300, PADh));
		//this.setBounds(0, 0, 500, 20);
		this.myXs = this.getX();
		this.myXf = this.getX() + this.getWidth();
	}

	paintComponent(g) {
		const PADh = 500;
		const firstCircleVertex = 30;
		const circleDiameter = 30;
		const radius = circleDiameter / 2;
		super.paintComponents(g);

		this.removeAll();

		const g2 = g;
		const w = this.getWidth();
		const h = this.getHeight();

		const len = 1 << this.totStatesLog;
		const circleVertexDistance = h / len;
		const coordinatesL = new Array(len);
		coordinatesL.fill(new Array(2));
		const coordinatesR = new Array(len);
		coordinatesR.fill(new Array(2));
		const coordinatesTx = new Array(len);
		coordinatesTx.fill(new Array(2));
		const myTrellis = this.myTrellis;

		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		g2.setBackground(Color.gray);
		g2.clearRect(0, 0, w, h);

		for (let i = 0; i < len; i++) {
			const a = firstCircleVertex + i * circleVertexDistance;
			const b = (firstCircleVertex + (radius * 4) / 3 + i * circleVertexDistance) * 1;
			const c = w - firstCircleVertex - circleDiameter;
			g2.draw(new Ellipse2D.Double(firstCircleVertex, a, circleDiameter, circleDiameter));
			g2.draw(new Ellipse2D.Double(c, a, circleDiameter, circleDiameter));
			g2.setFont(new Font('Arial', Font.BOLD, 16));
			g2.drawString(i.toString(2), firstCircleVertex + radius / 2, b);
			g2.drawString(i.toString(2), c + radius / 2, b);
			const l = coordinatesL[i];
			l[0] = firstCircleVertex + circleDiameter;
			l[1] = a + radius;

			const r = coordinatesR[i];
			r[0] = c;
			r[1] = a + radius;
		}
		this.txCoordinate(coordinatesL, coordinatesR, coordinatesTx);

		// Connections
		const drawingStrokeDSH = new BasicStroke(1, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new Array(9), 0);
		const drawingStrokeDEF = new BasicStroke(1);
		for (const key of myTrellis.keys()) {
			if (key.getMyInfoBit() * 1 === 0) {
				g2.setStroke(drawingStrokeDEF);
			} else {
				g2.setStroke(drawingStrokeDSH);
			}
			const myState = key.getMyState().getMyState() * 1;
			const l = coordinatesL[myState];
			const xF = l[0];
			const yF = l[1];

			const myStateT = myTrellis.get(key).getMyState() * 1;
			const r = coordinatesR[myStateT];
			const xT = r[0];
			const yT = r[1];

			const x = Math.floor(xF + (xT - xF) / 5);
			const y = Math.floor(yF + (yT - yF) / 5);
			g2.draw(new Line2D.Double(xF, yF, xT, yT));
			g2.drawString(key.getMyCodeWordStr(), x, y);
		}
	}
	txCoordinate(coordinatesL, coordinatesR, coordinatesTx) {
		const len = 1 << this.totStatesLog;
		for (let i = 0; i < len; i++) {
			const l = coordinatesL[i];
			const r = coordinatesR[i];
			const tx = coordinatesTx[i];
			for (let j = 0; j < 2; j++) {
				tx[j] = l[j] + (r[j] - l[j]) / 10;
			}
		}
	}
}
class TrellisWindow extends JFrame {
	constructor(totStatesLog) {
		super('Trellis');
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		const globCont = this.getContentPanel();
		globCont.add(new TrellisFrame(totStatesLog));
		//this.
		this.pack();
		this.setVisible(true);
	}
}
///////////////////////////////////
export class Joint {
	constructor(probab) {
		this.totInfoBit = 0;
		this.totCodedBit = 0;
		this.myEncoder = new Encoder();
		// this.myCh = new BSChannel(probab);
		this.myDec = new VitDecoder();
	}
	getTotCodedBit() {
		return this.totCodedBit;
	}
	// linkToTrellisPanel() {
	// 	return this.myEncoder.linkToTrellisPanel();
	// }

	// rentTrellisShow() {
	// 	return this.myDecTrellisFrame;
	// }
	linkToTrellisShow() {
		return this.myDec.rentTrellisShow();
	}
	getTotalInfobit() {
		return this.totInfoBit;
	}
	CodeSeq(seq) {
		const sb = [];
		const len = seq.length;
		for (let i = 0; i < len; i++) {
			const charCode = parseInt(seq.charAt(i));
			sb.push(this.myEncoder.encode(charCode));
		}
		return sb.join('');
	}
	CodeSeqAndSend(seq) {
		const sb = [];
		const cw = [];
		const len = seq.length;
		for (let i = 0; i < len; i++) {
			const charCode = parseInt(seq.charAt(i));
			const codedWord = this.myEncoder.encode(charCode);
			cw.push(codedWord);
			for (let j = 0; j < codedWord.length; j++) {
				const charCode = parseInt(codedWord.charAt(j));
				sb.push(this.myCh.transition(charCode));
			}
		}
		// console.log('Information sequence: \t' + seq);
		// console.log('Coded word: \t\t' + cw, join(''));リツイート
		// console.log('Received word: \t\t' + sb.join(''));
		return sb.join('');
	}
	CodeTransfDecode(seq) {
		return this.CodeTransfDecodeExec(seq).output;
	}
	CodeTransfDecodeExec(seq) {
		const trans = this.CodeSeqAndSend(seq);
		//console.log("Received word: " + trans);
		const tLen = trans.length;
		const codeWordBit = this.myDec.codeWordBit;

		const count = tLen / codeWordBit - 1;
		for (let i = 0; i < count; i++) {
			const a = codeWordBit * i;
			const b = codeWordBit + a;
			this.myDec.addTransmittedWord(trans.substring(a, b));
		}
		const i = tLen / codeWordBit - 1;
		const decOutput = this.myDec.addTransmittedWord(trans.substring(codeWordBit * i, codeWordBit * (i + 1)));
		const output = 'Decoded: ' + decOutput + '\n'; // +
		//"Transmission Errors: " + (hammingWeight(parseInt(this.CodeSeq(seq),2),parseInt(decOutput,2))));
		return { output, decOutput, trans };
	}

	CodeTransfDecode4Win(seq) {
		const len = seq.length;
		this.totInfoBit = len;
		const sb = [];
		const cw = [];
		for (let i = 0; i < len; i++) {
			const codedWord = this.myEncoder.encode(parseInt(seq.charAt(i)));
			cw.push(codedWord);
			for (let j = 0; j < codedWord.length; j++) {
				sb.push(this.myCh.transition(parseInt(codedWord.charAt(j))));
			}
		}
		const codeString = cw.join('');
		this.totCodedBit = codeString.length;
		const { output, decOutput, trans } = this.CodeTransfDecodeExec(seq);

		const codingErr = Util.hammingWeightByStr(codeString, trans);
		const bitErr = Util.hammingWeightByStr(seq, decOutput);
		return new InterexchangeSeq(codeString, trans, decOutput, codingErr, bitErr);
	}
	resetEnc() {
		this.myEncoder.reset();
		this.myDec.reset();
	}
}
