
---

Yesterday we themed GRUB, while today we will theme the obnoxious kernel reports while booting with nice plymouth theme.

I'd like to warn you about plymouth that it isn't stable at all, nearly 6 months ago it broke my display manager and I was forced to change my xfce to kde.

Firstable you should download an AUR helper, there's plenty of them.

```bash
pacman -S wget
wget https://aur.archlinux.org/packages/pa/pacaur/pacaur.tar.gz
tar -xvzf pacaur.tar.gz && cd pacaur
makepkg -s
pacman -U pacaur-4.1.25-1-any.pkg.tar.xz 
wget https://aur.archlinux.org/packages/co/cower/cower.tar.gz
tar -xvzf cower.tar.gz
cd cower
makepkg -s
pacman -U cower-11-3-i686.pkg.tar.xz
```

Edit /etc/default/grub and add "splash":

```GRUB_CMDLINE_LINUX_DEFAULT="quite splash"```

Generate new grub configuration to save the changes:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

Download plymouth and a theme for it

```bash
pacaur -S plymouth
pacaur -S plymouth-theme-paw-arch
```

edit /etc/mkinitcpio.conf and add "plymouth" after "base udev"

![](img/file/plymouth/plymouth_mkinitcpio_conf.png)

Generate new initrd preset which we will use to rebuild the initrd image.

```bash
mkinitcpio -p /etc/mkinitcpio.d/linux.preset
mkinitcpio -p /etc/mkinitcpio.conf
```

Disable the ordinary display manager (in my case is kdm), replace it yours and enable the plymouth display manager.

```bash
systemctl disable kdm
systemctl enable kdm-plymouth
```

Instruct plymouth to use the downloaded theme from AUR

```plymouth-set-default-theme -R paw-arch```

Rebuild the initrd image

```bash
mkinitcpio -p linux
```

Generate new grub configuration to save the changes

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

Reboot and see the beauty while booting

![](img/file/plymouth/plymouth-theme.png)
