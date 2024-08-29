
---

It seems today is my GRUB hacking and fixing day, lol.

While searching how to resolve the previous grub issue found out how to set different grub theme and change the listed operating systems names.

Let's begin with setting grub theme.

```bash
pacman -S git
```

```bash
git clone git://github.com/Generator/Grub2-themes.git
```

Unzip the archive and cd into it.

```bash
cp -r Archxion/ /boot/grub/themes/
```

Edit your `/etc/default/grub` and change the lines:

```# GRUB_BACKGROUND to GRUB_BACKGROUND```

**GRUB_THEME="/path/to/gfxtheme"** to:

    GRUB_THEME="/boot/grub/themes/Archxion/theme.txt"

Save the /etc/default/grub file and update the grub configuration:

```bash
grub-mkconfig --output /boot/grub/grub.cfg
```

Now to change the detected operating system names:

```bash
nano /boot/grub/grub.cfg
```

Let's say your distro is archlinux. Search for Arch Linux and replace all lines that match "menuentry", "submenu" with Arch Linux, replace the detected os name. Keep in mind whenever the grub configuration gets updated your changed os names will gone and you'll have to edit the grub.cfg file again.

See the available Archxion/icons/ names and replace the '--class gnu-linux' or '--class yourdistroname' with the icon name from that folder without .png at the end.

![](img/file/1misc/grub_theme.png)
