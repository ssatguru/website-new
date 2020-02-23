import javax.swing.*;
import java.awt.*;

class GamePanel extends JPanel{
	private Image img;

	public GamePanel(java.net.URL imgURL){
		super();
		ImageIcon ii = new ImageIcon(imgURL);
		img = ii.getImage();
	}

	protected void paintComponent(Graphics g){
		super.paintComponent(g);
		Insets ins = getInsets();
		int width = getWidth()-ins.left-ins.right;
		int height = getHeight() - ins.top-ins.bottom;
		g.drawImage(img, ins.left, ins.top, width, height,null);
	}

}