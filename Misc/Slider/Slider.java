import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.plaf.metal.*;
import java.util.*;
import javax.sound.midi.*;
import javax.swing.border.*;

class Slider extends JPanel implements ActionListener, MetaEventListener{


	private java.util.Timer tmr = new java.util.Timer();
	private UpdateTime ut = new UpdateTime();
	private int Steps =0;

	public Slider(){
		setGui();
		setSound();
		tmr.schedule(ut,0,1000);
	}

	private GameButton blankButton;
	private GameButton currentButton;
	private JButton CloseButton, MusicButton;
	private JLabel TimeLabel = new JLabel("00.00");
	private JLabel StepsLabel = new JLabel("0");
	private ArrayList al = new ArrayList();
	private int rows = 4;
	private int cols = 4;

	private void setGui(){


		//force old metal look and feel
		try{
		MetalLookAndFeel mlf = new MetalLookAndFeel();
		mlf.setCurrentTheme(new DefaultMetalTheme());
		UIManager.setLookAndFeel(mlf);
		}catch(Exception e){}

		this.setLayout(new BorderLayout());
		this.setBorder(BorderFactory.createCompoundBorder(
											BorderFactory.createLineBorder(Color.LIGHT_GRAY,5),
											BorderFactory.createBevelBorder(BevelBorder.RAISED)
											));

			java.net.URL imgURL = Slider.class.getResource("images/background.jpg");
			GamePanel gamePanel = new GamePanel(imgURL);
			gamePanel.setLayout(new GridLayout(rows, cols,2,2));
			gamePanel.setBackground(Color.DARK_GRAY);
			gamePanel.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
			JPanel ControlPanel = new JPanel();
				JButton ScrambleButton= new JButton("Scramble");
				ScrambleButton.setFocusable(false);
				ScrambleButton.addActionListener(this);

				MusicButton = new JButton("Music On");
				MusicButton.setPreferredSize(ScrambleButton.getPreferredSize());
				MusicButton.setFocusable(false);
				MusicButton.addActionListener(this);

				CloseButton = new JButton("Close");
				ScrambleButton.setFocusable(false);
				CloseButton.addActionListener(this);


			ControlPanel.add(ScrambleButton);
			ControlPanel.add(MusicButton);
			ControlPanel.add(CloseButton);

			JPanel StatusPanel = new JPanel();
			StatusPanel.setPreferredSize(ControlPanel.getPreferredSize());

				JLabel TimeCaption = new JLabel("Time Elapsed");
				JLabel StepsCaption = new JLabel("Steps");

				TimeLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK,1));
				TimeLabel.setOpaque(true);
				TimeLabel.setHorizontalAlignment(SwingConstants.CENTER);
				TimeLabel.setPreferredSize(CloseButton.getPreferredSize());

				StepsLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK,1));
				StepsLabel.setOpaque(true);
				StepsLabel.setHorizontalAlignment(SwingConstants.CENTER);
				StepsLabel.setPreferredSize(CloseButton.getPreferredSize());

			StatusPanel.add(TimeCaption);
			StatusPanel.add(TimeLabel);
			StatusPanel.add(StepsCaption);
			StatusPanel.add(StepsLabel);
		this.add(gamePanel);
		this.add(StatusPanel,BorderLayout.NORTH);
		this.add(ControlPanel,BorderLayout.SOUTH);


		String lbl;
		GameButton button = null;
		int k=0;
		for (int r=1;r<=rows;r++){
		    for (int c=1;c<=cols;c++){
				button = new GameButton(String.valueOf(k));
				button.addActionListener(this);
				gamePanel.add(button);
				al.add(button);
				button.row = r;
				button.col = c;
				k++;
			}
		}

		blankButton = button;
		blankButton.setVisible(false);

		scramble();

	}

	public void removeCloseButton(){
		CloseButton.setVisible(false);
	}

	private Receiver rcvr;
	private Synthesizer synth;
	private Sequencer sqr;
	private ShortMessage ClickSound ;
	private boolean MusicProblem=false;

	private void setSound(){
		try{

			sqr = MidiSystem.getSequencer();
			sqr.open();

			synth = MidiSystem.getSynthesizer();
			synth.open();

			String version = System.getProperty("java.version").substring(0,3);

			if ((version.compareTo("1.4")>0) && (synth.getDefaultSoundbank() == null )){
				rcvr = MidiSystem.getReceiver();
			}else{
				rcvr = synth.getReceiver();
			}


			ClickSound = new ShortMessage();
			ClickSound.setMessage(ShortMessage.PROGRAM_CHANGE,1,115,0);
			rcvr.send(ClickSound,-1);
			ClickSound.setMessage(ShortMessage.NOTE_ON,1,60,60);


			sqr.addMetaEventListener(this);
			Transmitter trn = sqr.getTransmitter();
			trn.setReceiver(rcvr);
			int Resolution =10;
			Sequence seq = new Sequence(Sequence.PPQ, Resolution);

			int C=60,D=62,E=64,F=65,G=67,A=69,B=71;

			int notes[] = {C,D,C,C,E,D,C,C,F,E,D,C,
			                C+12,B,A,G,B, B,A,G,F,A, A,G,F,E,G, G,F,E,D,F,
			                C,D,C,C,E,D,C,C,F,E,D,C,
			                C+12,B,D+12,C+12,B, A,G,B,A,G, F,E,G,F,E, D,C,E,D,C};

			int beats[] = {1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,4,
							2,1,1,1,2,2,1,1,1,2,2,1,1,1,2,2,1,1,1,4,
							1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,4,
							2,1,1,1,2,2,1,1,1,2,2,1,1,1,2,2,1,1,1,4};


			Track backgroundTrk = seq.createTrack();
			setTrack(backgroundTrk, notes, beats, Resolution, 0);

			notes = new int[] {C,D,E,F,G,A,B,C+12};
			beats = new int[] {1,1,1,1,1,1,1,4};
			Track winTrk = seq.createTrack();
			setTrack(winTrk, notes, beats, Resolution, 0);

			sqr.setSequence(seq);
			sqr.setTempoFactor((float)1.5);
			if (!(version.compareTo("1.4")>0)){
				sqr.start();
				sqr.stop();
			}
			sqr.setTrackMute(1,true);
			sqr.setTrackMute(0,false);


		}catch(Exception e){
			System.out.println("sound error " + e);
			JOptionPane.showMessageDialog(null,
											"There was a problem with the MIDI system. Disabling music",
											"Midi Problem",
											JOptionPane.ERROR_MESSAGE);
			MusicButton.setEnabled(false);
			MusicProblem = true;
		}
	}

	private void setTrack(Track trk, int[] notes, int[] beats, int Resolution, int transpose){

		try{
		ShortMessage sm;
		MidiEvent me;
		long tc= 0;
		for (int i = 0; i < notes.length; i++) {
			sm = new ShortMessage();
			sm.setMessage(ShortMessage.NOTE_ON,0,notes[i]-transpose,32);
			me = new MidiEvent(sm,tc);
			trk.add(me);
			tc +=beats[i]*Resolution;
			sm = new ShortMessage();
			sm.setMessage(ShortMessage.NOTE_OFF,0,notes[i]-transpose,32);
			me = new MidiEvent(sm,tc);
			trk.add(me);
		}
		MetaMessage mm = new MetaMessage();
		mm.setMessage(6,new byte[] {'E'},1);
		trk.add(new MidiEvent(mm,tc));
		}catch (Exception e){}

	}

	private void scramble(){
		int j = rows*cols;
		int k;
		Random r = new Random();
		String lbl;

		GameButton thisButton, ranButton;
		for (int i=0;i<j;i++){
			k= r.nextInt(j);
			thisButton = (GameButton) al.get(i);
			ranButton = (GameButton) al.get(k);

			lbl=thisButton.getText();
			thisButton.setText(ranButton.getText());
			ranButton.setText(lbl);

			if (!(thisButton.isVisible())){
				thisButton.setVisible(true);
				ranButton.setVisible(false);
				blankButton = ranButton;
			}else if(!(ranButton.isVisible())){
				thisButton.setVisible(false);
				ranButton.setVisible(true);
				blankButton = thisButton;
			}
		}
		secsPassed = 0;
		minsPassed = 0;
		Steps = 0;
		StepsLabel.setText(String.valueOf(Steps));

	}

	private boolean MusicOn = false, WinMusic =false;
	public void actionPerformed(ActionEvent e){

		JButton button = (JButton) e.getSource();
		String lbl = button.getText();

		if (lbl.equals("Scramble")) {
			scramble();
			return;
		}else if(lbl.equals("Music On")){
			sqr.start();
			MusicOn = true;
			button.setText("Music Off");
			return;
		}else if(lbl.equals("Music Off")){
			MusicOn=false;
			sqr.stop();
			button.setText("Music On");
			return;
		}else if(lbl.equals("Close")){
			shutDown();
			System.exit(0);
		}else{
			currentButton = (GameButton) button;
		}

		int diff;
		if (currentButton.row == blankButton.row){
			diff = currentButton.col - blankButton.col;
			if ((diff == 1) || (diff == -1)) {
				switchButton();
			}
		}else if (currentButton.col == blankButton.col){
			diff = currentButton.row - blankButton.row;
			if ((diff == 1) || (diff == -1)) {
				switchButton();
			}
		}
		if (checkDone()) {
			for (int i=0;i<al.size();i++){
				GameButton gb = (GameButton) al.get(i);
				gb.setVisible(false);
			}

			if (!(MusicProblem)){
				if (MusicOn) {
					sqr.stop();
				}
				WinMusic = true;
				try{
					sqr.setTrackMute(1,false);
					sqr.setTrackMute(0,true);
					sqr.setTempoFactor((float)4);
					sqr.setTickPosition(0);
					sqr.start();
				}catch (Exception ex){System.out.println(ex);}
			}
			JOptionPane.showMessageDialog(null, "Congratulations","Congratulations",
											JOptionPane.INFORMATION_MESSAGE);
			for (int i=0;i<al.size();i++){
				GameButton gb = (GameButton) al.get(i);
				gb.setVisible(true);
			}
			blankButton.setVisible(false);
		}
	}

	public void shutDown(){
		if (!(MusicProblem)){
			synth.close();
			sqr.close();
		}
	}

	private void switchButton(){
		if (!(MusicProblem)) rcvr.send(ClickSound,-1);
		blankButton.setText(currentButton.getText());
		currentButton.setText(" ");
		blankButton.setVisible(true);
		currentButton.setVisible(false);
		blankButton = currentButton;
		Steps++;
		StepsLabel.setText(String.valueOf(Steps));
	}

	private boolean checkDone(){
		int i=0;
		for (i=0;i<al.size();i++){
			GameButton gb = (GameButton) al.get(i);
			if (!(gb.getText().equals(String.valueOf(i)))) {break;}
		}
		if (i==(al.size()-1)) return true;
		else return false;
	}

	public void meta(MetaMessage message){
		if (message.getType() == 6) {  // 47 is end of track, 6 added to identify end of each track
			if (WinMusic) {
				try{
				sqr.stop();
				sqr.setTrackMute(1,true);
				sqr.setTrackMute(0,false);
				sqr.setTempoFactor((float)1.5);
				sqr.setTickPosition(0);
				if (MusicOn) sqr.start();
				WinMusic = false;
				}catch (Exception e){System.out.println(e);}
			}
		}
		if (message.getType() == 47){
			if (MusicOn){
				sqr.setTickPosition(0);
				sqr.start();
			}
		}
	}



	class GameButton extends JButton{

		int row;
		int col;

		public GameButton(String s){
			super(s);
			setFocusable(false);
			setRequestFocusEnabled(false);
			Font fnt = getFont();
			setFont(new Font(fnt.getName(),Font.ITALIC,fnt.getSize()));
			setBorder(BorderFactory.createCompoundBorder(
											BorderFactory.createLineBorder(Color.LIGHT_GRAY,3),
											BorderFactory.createBevelBorder(BevelBorder.RAISED)));

		}
	}

	private int secsPassed=0;
	private int minsPassed=0;
	class UpdateTime extends TimerTask {
		public void run(){
			String secs;
			String mins;
			secsPassed ++;
			if (secsPassed == 60) {
				minsPassed=minsPassed+1;
				secsPassed=0;
			}
			secs = ((secsPassed<10)?"0" + String.valueOf(secsPassed):String.valueOf(secsPassed));
			mins = ((minsPassed<10)?"0" + String.valueOf(minsPassed):String.valueOf(minsPassed));
			TimeLabel.setText(mins+ ":" + secs);
		}
	}

}

