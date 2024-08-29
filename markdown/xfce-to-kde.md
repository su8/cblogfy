
---

Few days ago I installed "plymouth" and my stable xfce display manager lxdm freaked out. Later discovered that the bad boy was plymouth, because archlinux wiki page is saying **"Warning: Plymouth is currently under heavy development and may contain bugs."**.

Changed my display manager, but the damages from this piece of sh*t was so huge that at the end I was either forced to re-install the distro or to try replacing it with other desktop environment. I had no idea will the second thing will work flawlessly.

I was pretty confident that the desktop environment that I had not tried yet is: Fluxbox, Openbox and KDE. The first on my list was KDE and if it's not working: removing it, and installing the next until some of these is working as it should be. In case they don't work flawleslly, a new re-install of my archlinux was the last thing that I would do.  

I mean, fixing something will acknowledge you in future if you break it again, while doing re-installs just because something is not working is bad practice. Let's get started how I managed to replace my xfce with kde, firstable determine what's your current display manager

```bash 
systemctl list-units | grep dm
```

If you are using "slim" or "mdm", replace the "lxdm" at the second line:

```bash
pacman -S kdebase kdm kdeplasma-applets-networkmanagement
systemctl disable lxdm
pacman -Rsn $(pacman -Qqs | grep xfce4)
pacman -Rsnc xfce4
```

Now you should reboot, don't be scared because your system will start in CLI mode. Log-in as root and type:

```bash
systemctl enable kdm.service
systemctl start kdm.service
```

Congrats, you got kde desktop environment working out of the box, now install some drop-down terminal, replace the default window decoration theme and add a widget for the network manager to your panel. First is the drop-down terminal:

```bash
pacman -S yakuake
```

Settings-> System Settings-> Workspace Appearance-> Get new decoration: Dark Shine
Right click to your panel-> Panel Options->Panel Settings-> add widget: Network Management

That was it, whenever the NetworkManager stops working you can replace it with wicd:

```bash
wicd, wicd-gtk (or wicd-kde from yaourt) are optional if the default network management applet is not working properly.
systemctl disable NetworkManagement
systemctl stop NetworkManagement
systemctl enable wicd
systemctl start wicd
```
