import javax.swing.*;
import java.awt.*;

public class SliderApplet extends JApplet{
	Slider slider;
	public void init(){
		this.getContentPane().setLayout(new BorderLayout());
		slider = new Slider();
		slider.removeCloseButton();
		this.getContentPane().add(slider);
	}

	public void destroy(){
		slider.shutDown();
	}
}