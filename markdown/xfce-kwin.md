
---

Few days ago I found out that it is possible to have compiz &#40;like&#41; effects in xfce environment. Sounds good, but for us the arch users the compiz is no more maintained &#40;unless you want to mess with out of date packages in yaourt&#41; and we have to seek some alternative, and here it comes KWin.

##Kwin installation#

```bash
yaourt -S kwin-standalone-git
pacman -R kwin-standalone-git
pacman -S kdebase-workspace
```

Replace the xfce window manager with KWin - line 12: replace **xfwm4** with **kwin**

```bash
nano /etc/xdg/xfce4/xfconf/xfce-per-channel-xml/xfce4-session.xml
```

Once you are done reboot your pc and attempt to tweak the new window manager settings to make it eyecandy. Open up some folder and hover your mouse to the window title, click and hold the right click then navigate to: More Actions-> Window Manager Settings

![See the image](img/file/xfce_kwin/window-manager-settings.png)

I've enabled some effects in "Desktop Settings-> All Effects", so I got 3D cube, window highlighting, all workspaces are showed in a grid. 

The effects are named: Box Switch, Desktop Cube, Desktop Cube Animation, Desktop Grid, Highlight Window.

![Desktop Grid](img/file/xfce_kwin/kwin-effects.png) 

I do liked Yakuake (in gnome env. is guake) as replacement for the xfce drop down terminal that I had to tweak earlier. The yakuake is using "transparent tabs" theme and looks outstanding. 

![Yakuake](img/file/xfce_kwin/yakuake.png) 

You can customize the window themes to your personal preferences, just play around with the **Window Decorations** 

![See the image](img/file/xfce_kwin/xfce-kwin2.png)

The particular theme in the above image is called **Ghost**
