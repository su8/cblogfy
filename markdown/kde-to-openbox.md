
---

I've been using KDE for past 9 months until today since I was forced (back in october 2013) to move from my beloved xfce which was broken by plymouth.

One of my earliest github projects **pshot** was created because I had to deal with a Openbox server which didn't had any screenshot tool. Then I didn't really liked Openbox, but that is about to change right now.

I'm in love with Openbox, trying to spend as much time as I can to continue improving my design:

![](img/file/kde_to_openbox/kde-2-openbox.png)

lm_sensors was removed, noticed it after I published this post.

The above image represents my 5th day with Openbox, yesterday removed completly kde along with it's dependecies.

As it was with xfce, removing all kde libraries,apps and so forth with their deps. `pacman -Rsn $(pacman -Qqs | grep kde)` the overall packages on my system that had to be removed was around 300 and 1.3 GB in size.

If any program complains that it's used by other program/library (for me it was libkmahjongg), force its removal with `pacman -Rdd program-name` and try running the Rsn command again.

Let me ge it straight, Openbox is Window Manager and not desktop environment, that is, you should install a display manager separately.

Loved slim and my impressions was really good when I was using it, so installed it again with `archlinux-themes-slim` that's included in the extra repository.

You should learn how to configure your openbox step by step, don't look in other people configuration files until you know how to configure your box first. Openbox can be configured so easily, and the learning curve is about to know a little bit css, html and bash. I know at the beginning it's ugly, strange and in same time creepy, but please take your time and let your imagination do the visual work for you.

Openbox is what you make it, there is no correct or wrong way, thus means that it is up to you how it will look and work.

Strangely, my icons and desktop theme disappeared once I removed kde. In lxappearance many times pointed Faenza and Adwaita, but it seems openbox didn't wanted to change anything. It turned out that I had to ran bleachbit, wipe all the cache, history and temporary files.

Created ~/.gtkrc.mime and inserted: include "/home/username/.gtkrc-2.0"

Symlinked `ln -s ~/.gtkrc-2.0 ~/.gtkrc-2.0.mine`, so any changes that are made by lxappearance will appear in the symlinked file automatically.

Updated the icon cache `gtk-update-icon-cache` and 
`sudo /usr/bin/gdk-pixbuf-query-loaders --update-cache`

Rebooted the computer then re-installed lxappearance and it worked flawlessly.

Noticed that my sound is muted by default but it didn't bothered me because kmix was fixing this for me, but after the kde removal kmix gone and I was left with no audio.

It took me a while to get the sound back, read somewhere that openbox wants alsa audio while I had only pulseaudio. Installed the `pulseaudio-alsa, alsa-lib, alsa plugins, alsa-utils` packages and my audio was back again !

In the archlinux openbox wiki page they barely mentioned the keyboard layouts and the outdated **xorg.conf**, but nothing written how to switch between different layouts. While kde,gnome,xfce,cinnamon and the rest gazillion desktop environments got keyboard layout tools by default, in openbox (the window manager) we have to find their alternatives.

`sbxkb, xorg-setxkbmap` was the packages that I needed and the following command lists all keyboard layout variants about the given language `grep -E ^xkb_symbols < /usr/share/X11/xkb/symbols/gb` while if you add **setxkbmap -layout us,gb -variant basic,dvorak**, along with **sbxkb** in your **~/.config/openbox/autostart** file you will be able to switch between the different keyboard layouts with a mouse clicks. That is what you see in my openbox image and the us flag that is drawn between my clock and the volume icon.

Another 'bug' that noticed was the two network manager applets in my notification area, thankfully the fix was simple by editing `/etc/xdg/autostart/nm-applet.desktop` and adding the **OPENBOX** in the following line ![](img/file/kde_to_openbox/network-manager-bug.png)

Created github repository to share my configuration files with you, so you can make your Openbox desktops to look like mine [https://github.com/wifiextender/dotfiles](https://github.com/wifiextender/dotfiles).
