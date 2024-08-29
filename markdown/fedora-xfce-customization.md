
---

This tutorial contains so many pictures that I decided to include them as a links, because the page was loading for 10 seconds.
It's my 2nd day since I switched to Fedora from Sabayon, so this time I choose xfce instead **mate**. I never wanted **XFCE **desktop environment because I am gnome 2 **die hard fan**, but this time I had a lot of free time to customize this desktop environment and decided to share my experience with you - whether you are advanced gnu/linux user or beginner.


Installing equinox theme, faenza icons and docky. I assume that you will be running all the following commands as root, otherwise use sudo for each command.

```bash
yum install gtk-equinox-engine faenza-icon-theme docky
```

Now it's time to decide do you want to use the default xfce menu or **Whisker**

[img/file/fedora_xfce/xfce-original-menu.png](img/file/fedora_xfce/xfce-original-menu.png) 

[img/file/fedora_xfce/xfce-alternative-menu.png](img/file/fedora_xfce/xfce-alternative-menu.png)

If you choose the **Whisker menu**, then type this in your terminal:

```bash
cd /etc/yum.repos.d/
wget http://download.opensuse.org/repositories/home:gottcode/Fedora_19/home:gottcode.repo
yum install xfce4-whiskermenu-plugin
```

That's all you need to download, let's make it eyecandy.

Open up **Windows Manager** and choose some style.

[img/file/fedora_xfce/window-manager.png](img/file/fedora_xfce/window-manager.png)

Once you choose the style close that window and open up **Window Manager Tweaks**, you might want to make everthing like me or change some of these settings - it's all up to you.

[img/file/fedora_xfce/window-manager-tweaks.png](img/file/fedora_xfce/window-manager-tweaks.png)  

[img/file/fedora_xfce/window-manager-tweaks2.png](img/file/fedora_xfce/window-manager-tweaks2.png) 

[img/file/fedora_xfce/window-manager-tweaks3.png](img/file/fedora_xfce/window-manager-tweaks3.png)  

[img/file/fedora_xfce/window-manager-tweaks4.png](img/file/fedora_xfce/window-manager-tweaks4.png)  

[img/file/fedora_xfce/window-manager-tweaks5.png](img/file/fedora_xfce/window-manager-tweaks5.png)  

[img/file/fedora_xfce/window-manager-tweaks6.png](img/file/fedora_xfce/window-manager-tweaks6.png)

Close that window and open up **Appearance**, select the theme that you've downloaded earlier, there are 5 **Equinox** flavours.

[img/file/fedora_xfce/appearance.png](img/file/fedora_xfce/appearance.png)

DON'T close that window yet, move to the next tab **icons** and select **Faenza** that you've downloaded earlier.

[img/file/fedora_xfce/icons.png](img/file/fedora_xfce/icons.png)

Move to the next tab **Fonts** and select some that you might prefer, I liked **FreeSans**, watch out to Check **Enable anti-aliasing** and **Sub-pixel order** as it is shown in the picture below.

[img/file/fedora_xfce/fonts.png](img/file/fedora_xfce/fonts.png)

Close this window and open up **Desktop** settings.

[img/file/fedora_xfce/desktop-settings.png](img/file/fedora_xfce/desktop-settings.png)

I don't like to keep too many things on my desktop, so in the next picture I unchecked almost everything except the **home** directory.

[img/file/fedora_xfce/desktop-settings2.png](img/file/fedora_xfce/desktop-settings2.png)

Close this windows and hover your mouse over the top pannel, then right click on it and select Panel-> Panel Preferences , and make sure that the Length is 100%

[img/file/fedora_xfce/panel-settings.png](img/file/fedora_xfce/panel-settings.png)

Move to the next tab - **Appearance** and use Style None, then use the **Alpha** slider and move it to the left, which will make your top panel transparent.

[img/file/fedora_xfce/panel-settings2.png](img/file/fedora_xfce/panel-settings2.png)

Close this window and hover your mouse this time to the bottom panel then right click on it and select **Panel Preferences**. Do the same changes as you did to the top panel, both panels must look like exactly the same, you don't want transparent top panel and red bottom panel - right ?

[img/file/fedora_xfce/panel2-settings.png](img/file/fedora_xfce/panel2-settings.png)

[img/file/fedora_xfce/panel2-settings2.png](img/file/fedora_xfce/panel2-settings2.png)

As you already know I am gnome 2 fan, so I want all of my active windows to be opened on the bottom panel, take a look at this picture

[img/file/fedora_xfce/panel2-settings3.png](img/file/fedora_xfce/panel2-settings3.png)

Removed **Windows Buttons** from the top panel and added it to the bottom one, then I edited it in order to use **flat buttons**

Once you are done, navigate to your xfce menu and select: Settings-> Session and Startup-> Application Autostart, where you have to use your scrollbar and then tick Docky to make sure that it will load automatically during your system booting process.

Again open up your menu and start docky via: xfce menu->Accesories->Docky

If you want to add more apps you have to drag these icons from the original xfce menu. Created **New Dock** in Docky and it went to the left of my screen then deleted the bottom existing Dock.

Did you decided that you want to use different xfce menu (**Whisker**) ? If your answer is yes, then follow the pictures:

[img/file/fedora_xfce/panel-addmenu.png](img/file/fedora_xfce/panel-addmenu.png)  

[img/file/fedora_xfce/whiskermenu-vs-defaultmenu.png](img/file/fedora_xfce/whiskermenu-vs-defaultmenu.png) 

Once you are done with choosing which menu you will use, select different logo for it 

[img/file/fedora_xfce/panel-settings3.png](img/file/fedora_xfce/panel-settings3.png) 

You might saw that there is border around your network manager applet, remove it.

[img/file/fedora_xfce/panel-settings4.png](img/file/fedora_xfce/panel-settings4.png) 

If you want to customize your login wallpaper then download some wallpaper that you like and copy it to the following directory: 

[img/file/fedora_xfce/copy-the-image.png](img/file/fedora_xfce/copy-the-image.png) 

Once you copy the image to all of these folders, edit the **.xml** file and type your image name there: 

[img/file/fedora_xfce/xml.png](img/file/fedora_xfce/xml.png) 

And you are done, enjoy the final results.

[img/file/fedora_xfce/xfce-pimped.png](img/file/fedora_xfce/xfce-pimped.png) 

[img/file/fedora_xfce/login-wallpaper-changed.png](img/file/fedora_xfce/login-wallpaper-changed.png) 

The image I am using for my login screen. 

[img/file/fedora_xfce/alienware-login-wallpaper.jpg](img/file/fedora_xfce/alienware-login-wallpaper.jpg)

Edit on July 13th, adding drop-down terminal and menu customization. 

You don't need to download anything if you use xfce4-terminal version 0.6, otherwise you will have to upgrade your existing one to 0.6 Go to Menu-> Settings-> Keyboard-> Application Shortcuts , then add shortcut command like the image below: 

[img/file/fedora_xfce/dropdownterminal.png](img/file/fedora_xfce/dropdownterminal.png)

I prefer F13 to activate my drop-down terminal, because in the past I was using Guake which default activation key was F13 - old habits dying hard... (quick reference, there is no F13 button on your keyboard, just kidding to make this long and boring article a lot more attractive, also if you don't pay attention you may not notice it). Press F12 and attempt to customize your drop-down terminal.

[img/file/fedora_xfce/terminalpreferences.png](img/file/fedora_xfce/terminalpreferences.png)  

[img/file/fedora_xfce/terminalpreferences2.png](img/file/fedora_xfce/terminalpreferences2.png)  

[img/file/fedora_xfce/dropdownterminal-showoff.png](img/file/fedora_xfce/dropdownterminal-showoff.png)

Joke aside, now in order to edit what you want to include your menu you have to install an external Gnome menu editor and create symlink:

```bash
yum install alacarte
cd /usr/bin
ln -s exo-desktop-item-edit gnome-desktop-item-edit
```

Then do this:

[img/file/fedora_xfce/menucustomization.png](img/file/fedora_xfce/menucustomization.png)  

[img/file/fedora_xfce/menucustomization2.png](img/file/fedora_xfce/menucustomization2.png)

You can hide entire category or some program, but for gods sake don't even think about touching **Documentation**. The final result:

[img/file/fedora_xfce/xfce-pimped.png](img/file/fedora_xfce/xfce-pimped.png)
