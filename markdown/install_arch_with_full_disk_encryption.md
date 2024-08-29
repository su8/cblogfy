
---

In today's post we are going to install Arch Linux with full disk encryption.

Before we proceed, I want you to backup your existing data.

In the previous post we learnt what dm-crypt and LUKS are and how to encrypt single disk partition. While in the post today we will take a slightly different approach to encrypt the whole disk with dm-crypt LUKS and install Archlinux on it.

Let's start with disk erasing. Run **lsblk** to find your primary disk and replace `/dev/sda` where needed:

```bash
shred --verbose --random-source=/dev/urandom --iterations=3 /dev/sda
```

I ran the above command with '--iterations=15' on my 120GB SSD overnight and it finished after 7 hours.

Once done, partition the disk. Unless your motherboard is using UEFI firmware, make sure to select 'dos' (msdos) label, otherwise go with the 'gpt' when you type:

```bash
cfdisk /dev/sda
```

![](img/file/archlinux-luks/dos-label.png)

After that create boot loader partition:

```bash
New-> Partition Size: 100M -> primary -> Bootable
```

The last one will be the root partition. The partition size should be automatically set to your remaining free space.

```bash
New-> Partition Size: xxxGB -> primary
```

Write the changes and quit from cfdisk.

In order to boot your encrypted root partition, the boot loader partition `/dev/sda1` that will be mounted in **/boot** won't be encrypted. I will place couple links at the end of this post that will guide you how to encrypt and even move the boot partition on a CD/DVD/USB.

Create cryptographic device mapper device in LUKS encryption mode:

```bash
cryptsetup --verbose --cipher aes-xts-plain64 --key-size 512 --hash sha512 --iter-time 5000 --use-random luksFormat /dev/sda2
```

Unlock the partition, note that **cryptroot** will be the device mapper name that we will operate on.

```bash
cryptsetup open --type luks /dev/sda2 cryptroot
```

Create the boot and root file systems:

```bash
mkfs.ext4 /dev/sda1
mkfs.ext4 /dev/mapper/cryptroot
```

Mount them:

```bash
mount -t ext4 /dev/mapper/cryptroot /mnt
mkdir -p /mnt/boot
mount -t ext4 /dev/sda1 /mnt/boot
```

Install the base and base-devel systems:

```bash
pacstrap -i /mnt base base-devel
```

Generate the fstab:

```bash
genfstab -U -p /mnt >> /mnt/etc/fstab
```

Chroot to configure the base system:

```bash
arch-chroot /mnt
```

Uncomment the **en_US** locale:

```bash
sed -i 's/#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/g' /etc/locale.gen
```

Generate the locale:

```bash 
locale-gen
```

Create configuration file that would instruct the system what language locale it should be using:

```bash
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

Export the locale

```bash
export LANG=en_US.UTF-8
```

Create a symbolic link with the desired time zone:

```bash
ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime
```

Set the hardware clock to UTC:

```bash 
hwclock --systohc --utc
```

Set the desired hostname:

```bash
echo CookieMonster > /etc/hostname
```

Set the root password:

```bash 
passwd
```

Add a system user:

```bash 
useradd -m -g users -G wheel,games,power,optical,storage,scanner,lp,audio,video -s /bin/bash username
```

Set the system user password:

```bash 
passwd username
```

Install sudo (base-devel) and the boot loader grub and os-prober:

```bash 
pacman -S sudo grub-bios os-prober
```

Allow the system user to use sudo and run commands (temporary) as root:

```bash 
EDITOR=nano visudo
```

Press CTRL + W and type wheel, then uncomment the following line:

![](img/file/archlinux/9.png)

Add the following kernel parameter to be able to unlock your LUKS encrypted root partition during system startup:

![](img/file/archlinux-luks/kern-param.png)

Add **encrypt** hook:

![](img/file/archlinux-luks/mkinitcpio-hook.png)

Since we added new hook in the mkinitcpio configuration file, we should re-generate our initrams image (ramdisk):

```bash 
mkinitcpio -p linux
```

Install grub and save it's configuration file:

```bash
grub-install --recheck /dev/sda
grub-mkconfig --output /boot/grub/grub.cfg
```

Exit from chroot, unmount the partitions, close the device and reboot (remove the installation media):

```bash
exit
umount -R /mnt/boot
umount -R /mnt
cryptsetup close cryptroot
systemctl reboot
```

Once you type in your password and login as system user, start dhcpcd.

![](img/file/archlinux-luks/unlock-root.png)

```bash
systemctl start dhcpcd
ping -c2 youtube.com
```

Install Xorg and copy **.xinitrc** over your $HOME dir:

```bash 
pacman -S xorg-server xorg-server-utils xorg-xinit mesa xterm xorg-twm xorg-xclock
cp /etc/X11/xinit/xinitrc ~/.xinitrc
```

There is a special wiki page that contains useful information for the GPU drivers, check it out [https://wiki.archlinux.org/index.php/xorg#Driver_installation](https://wiki.archlinux.org/index.php/xorg#Driver_installation) and if it happens your GPU brand to be amd/ati, intel or nvidia install the appropriate drivers listed there.

Type `startx` and you should see couple terminals side-by-side, now type `exit`

Comment in the following lines in **.xinitrc** and add some to specify that we want the **xfce** desktop environment to be started upon successful login:

![](img/file/archlinux-luks/add-xfce-session.png)

Install xfce, external display manager and network manager:

```bash 
pacman -S slim archlinux-themes-slim xfce4 networkmanager network-manager-applet
```

Exchange the default slim theme:

![](img/file/archlinux-luks/slim-theme.png)

Stop dhcpcd, enable slim, enable NetworkManager, startx:

```bash
systemctl stop dhcpcd
systemctl enable NetworkManager
systemctl enable slim
startx
```

That was it, hope you enjoyed this post.

![](img/file/archlinux-luks/xfce-final-result.png)

If you ever manage to f\*ck up your system and have to chroot from removable media, the order is:

```bash
cryptsetup open --type luks /dev/sda2 cryptroot
mount -t ext4 /dev/mapper/cryptroot /mnt
mount -t ext4 /dev/sda1 /mnt/boot
arch-chroot /mnt
```

To unmount them:

```bash
umount -R /mnt/boot
umount -R /mnt
cryptsetup close cryptroot
```

The promised links, read the 8th and 9th links carefully if you got SSD:

[link 1](http://crunchbang.org/forums/viewtopic.php?id=24722), [link 2](https://bbs.archlinux.org/viewtopic.php?pid=943338), [link 3](https://wiki.archlinux.org/index.php/Dm-crypt/Device_encryption), [link 4](https://wiki.archlinux.org/index.php/Dm-crypt), [link 5](https://wiki.gentoo.org/wiki/DM-Crypt_LUKS), [link 6](https://wiki.gentoo.org/wiki/Dm-crypt), [link 7](https://help.ubuntu.com/community/EncryptedFilesystemHowto), [link 8](https://wiki.archlinux.org/index.php/Solid_State_Drives#Enable_TRIM_for_dm-crypt), [link 9](http://thunk.org/tytso/blog/2009/03/01/ssds-journaling-and-noatimerelatime/), [link 10](https://gitlab.com/cryptsetup/cryptsetup/wikis/FrequentlyAskedQuestions)
