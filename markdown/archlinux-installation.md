
---

At the beginning I'd like to thank to Jeff Knupp for the free copy of "Writing Idiomatic Python".

 The first time when I started using GNU/Linux was back in 2007. A friend of mine replaced my pirated version of XP with Mandriva, and I was pretty much happier but in the same time confused how different everything was. Till 2010 (the mandriva's death) Mandriva was the only distribution which I knew and have used.



Since then I've tried and many distributions but none of them couldn't fill the gap that was left by Mandriva. Twice in a year or more often I was exchanging distro after distro.



The first time when I installed archlinux, my wifi antenna wasn't playing nice and my internet speed wasn't constant. Downgraded the kernel, downloaded brand new and old versions of my antennas drivers but nothing worked out as it should be, so had to stick with Sabayon and after that Faildora for a while before moving completely to archlinux. The second attempt to have archlinux as my primary distro was successful, dunno what the devs have fixed but my antenna worked out perfectly.


Anyway, let's start with the tutorial itself
 Fire up the computer, insert the DVD disk,usb flash drive with archlinux and your first task will be disk partitioning.

![](img/file/archlinux/4.png)


![](img/file/archlinux/5.png)

 Firstable create a new partition that will be used by the boot loader to boot all of the operating systems on your drive.

```bash
New-> Primary-> Size in MB-> 100-> Bootable
```

 The second partition that you will create will be the one that for the archlinux installation.

```bash
New-> Primary-> Size in MB-> 100000
```

And the third partition will be for the swap, so whenever you ran out of memory the swap will save your azz.

```bash
New-> Primary-> Size in MB-> 2048-> Type -> 82 -> Press Enter
```

![](img/file/archlinux/6.png)

Keep pressing the right arrow key on your keyboard until the cursor goes to "write", press enter and type "yes".
Move the cursor to "Quit" and press enter.

Now you should create the filesystem and the swap.

Remember how you partition the drive:

```bash
/dev/sda1 is for the boot loader
/dev/sda2 where archlinux will be installed
/dev/sda3 the swap
```

```bash
mkfs.ext4 /dev/sda1
mkfs.ext4 /dev/sda2
mkswap /dev/sda3
swapon /dev/sda3
```

Mounting the partitions and creating the boot dir for the boot partition

![](img/file/archlinux/7.png)

Install the base and the devel system.

```bash
pacstrap -i /mnt base base-devel
```

When asked to enter selection, press enter to select all. Proceed with installation - Y

Once done, generate the fstab.

```bash
genfstab -U -p /mnt >> /mnt/etc/fstab
```

Let's configure the system with chroot

```bash
arch-chroot /mnt
```

Enable the locale for correctly displaying texts, instead seeing everything with question mark

```bash
nano /etc/locale.gen

Search for " en_US.UTF-8 UTF-8 " and uncomment it
```

```bash
locale-gen
```

Create locale.conf and export it

```bash
echo LANG=en_US.UTF-8 > /etc/locale.conf
export LANG=en_US.UTF-8
```

Symlink the wanted time zone.

```bash
ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime
```

Adjust the hardware clock to utc

```bash
hwclock --systohc --utc
```

Add hostname

```bash
echo computer-name > /etc/hostname
```

Temporary start the dhcpcd

```bash
systemctl start dhcpcd.service
```

Add root password

```bash
passwd
```

Create a user, archey is my username.

![](img/file/archlinux/8.png)

```bash
EDITOR=nano visudo
```

![](img/file/archlinux/9.png)

Scroll down till you find this, and uncomment it

Add password for the newly created username

```bash
passwd archey
```

Install sudo and the bootloader - grub.

```bash
pacman -S sudo grub-bios
```

Install and configure the grub to /dev/sda

```bash
grub-install --recheck /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```

Unmount the partitions, exit from chroot and reboot.

```bash
exit
umount -R /mnt/boot
umount -R /mnt
reboot
```

Once logged in as root, let's install X.

![](img/file/archlinux/10.png)

There is a special wiki page that contains useful information for the GPU drivers, check it out [https://wiki.archlinux.org/index.php/xorg#Driver_installation](https://wiki.archlinux.org/index.php/xorg#Driver_installation)

If you are not installing archlinux in virtualbox you should: copy the basic xinitrc to your user home dir and uncomment the desktop environment which will be started when you type `startx`

```bash
cp /etc/skel/.xinitrc /home/user/
uncomment **exec startkde** since we will install kde
nano /home/user/.xinitrc
```

If you are installing archlinux in virtualbox you should do this first before starting x. Install Guest additions, create virtualbox.conf, add the modules to the .conf file, copy the .xinitrc and edit it.

```bash
pacman -S virtualbox-guest-utils
```

```bash
modprobe -a vboxguest vboxsf vboxvideo
```

```bash
nano /etc/modules-load.d/virtualbox.conf
# and add this #
vboxguest
vboxsf
vboxvideo
```

```bash
cp /etc/X11/xinit/xinitrc /home/archey/.xinitrc
nano /home/archey/.xinitrc
```

At the top, above than **#!/bin/sh**, add this:

    /usr/bin/VBoxClient-all

Now you should be able to run `startx` flawlessly

If you see 2 terminals side-by-side, everything is OK, so type "exit" and install desktop environment of your choice

We will install KDE, again press enter to install everything.

![](img/file/archlinux/11.png)


Once KDE installation is done, enable the kdm display manager and the networkmanager


```bash
systemctl enable kdm
systemctl enable NetworkManager
systemctl stop dhcpcd
systemctl start kdm
```

That's it, enjoy your archlinux

![](img/file/archlinux/12.png)
