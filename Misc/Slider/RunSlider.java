import javax.swing.*;
import java.awt.event.*;
import java.awt.*;

class RunSlider extends JFrame implements MouseMotionListener, MouseListener{

	public static void main(String[] args){
		new RunSlider();
	}

	public RunSlider(){

		Slider slider = new Slider();

		//this.setTitle("Slider");
		this.getContentPane().add(slider);
		//this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setUndecorated(true);
		this.addMouseMotionListener(this);
		this.addMouseListener(this);
		this.setResizable(false);
		this.setSize(320,320);
		this.setLocationRelativeTo(null);
		this.setVisible(true);
	}
	//mouse listener methods
	private int oldFX = 0;
	private int oldFY = 0;

	public void mouseReleased(MouseEvent me){
		oldFX = 0;
		oldFY = 0;
	}

	public void mousePressed(MouseEvent me){
		JFrame f = (JFrame) me.getSource();
		oldFX = (int) me.getX();
		oldFY = (int) me.getY();
	}

	public void mouseClicked(MouseEvent me){}
	public void mouseEntered(MouseEvent me){}
	public void mouseExited(MouseEvent me){}

	//mouse motion listener methods
	public void mouseDragged(MouseEvent me){
		JFrame f = (JFrame) me.getSource();
		int diffX = me.getX()-oldFX;
		int diffY = me.getY()-oldFY;
		Point location = f.getLocation();
		location.translate(diffX,diffY);
		f.setLocation(location);
	}

	public void mouseMoved(MouseEvent me){}
}