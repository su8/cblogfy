
---

After several requests finally agreed to write a post about the Gentoo installation.

There is a nice, well written handbook that will take your hand and install gentoo for you, even if you don't have any experience or knowledge. So this post is bit redundant.

It is strange to do archlinux, gentoo installation tutorials, but that is your requests.

After you have done a couple gentoo installations you will have better understanding what does the commands do, strip the kernel manually, use your own USE,CFLAGS and so on.

Head over [http://distfiles.gentoo.org/releases/amd64/autobuilds/current-install-amd64-minimal/](http://distfiles.gentoo.org/releases/amd64/autobuilds/current-install-amd64-minimal/) and download **install-amd64-minimal-*.iso**

Once downloaded burn it to a disc or usb thumb drive e.g: `sudo dd if=install-amd64-minimal-*.iso of=/dev/sdXxX bs=4M`

Now is the time to decide wheter you want to experiment with a spare drive or with your primary one.

Reboot the computer and boot the disc/usb thumb drive. Type `ping -c3 youtube.com` and in case of network issue you should head over [the handbook section to learn how to configure your network.](http://www.gentoo.org/doc/en/handbook/handbook-amd64.xml?part=1&chap=3)

##Preparing the Disk#

The following scheme represents how our drive will be partitioned.

```bash
/dev/sda1 bios
/dev/sda2 boot
/dev/sda3 root
```

Type `parted -a optimal /dev/sda`

Set gpt label with `mklabel gpt`

Instruct parted to use size unit of megabytes `unit MB`

Create the bios partition `mkpart primary 1 100`, name it with `name 1 grub` and set a bootable flag with `set 1 bios_grub on`

Create the boot partition `mkpart primary 101 1000` name it with `name 2 boot`

Create the root partition `mkpart primary 1001 -1` name it with `name 3 root`. Type `print` to see the disk partitions and type `quit` to quit

Creating the filesystems. Type `mkfs.ext2 /dev/sda2` `mkfs.ext4 /dev/sda3`

Next, mount them

```bash
mount /dev/sda3 /mnt/gentoo
mkdir /mnt/gentoo/boot
mount /dev/sda2 /mnt/gentoo/boot
cd /mnt/gentoo
```

##Installing the gentoo installation files#

Open up **links** and find the closest mirror to you, then download the stage3 tarball.

I suggest you to get some piece of paper and ballpoint pen, select the wanted mirror, open it up, go to **releases**, **amd64** **current-iso** and write down the mirror address plus **stage3-amd64-*.tar.bz2**. Simple example: http://de-mirror.org/gentoo/releases/amd64/current-iso/stage3-amd64-20140724.tar.bz2 (use wget to download it instead links).


Use links to get the mirror address then download the stage3 tarball with wget.

```bash
links http://www.gentoo.org/main/en/mirrors.xml
```

Once the tarball is downloaded, type `tar xvjpf stage3-*.tar.bz2`

We want to get gentoo up and running, so don't mess with the cflags, cxxflags if this is your first attemp to install it.

##Installing the Gentoo Base System#

Setting up the GENTOO_MIRRORS variable, again point the closest mirror to you by hitting the spacebar, seek the phrase **Any available mirror**.

```bash
mirrorselect -i -o >> ./etc/portage/make.conf
```

Setting up the SYNC variable

```bash
mirrorselect -i -r -o >> ./etc/portage/make.conf
```

Copy your current DNS nameservers, because once we chroot the filesystem we want to have flawless internet connection `cp -L /etc/resolv.conf ./etc/`

Mount the filesystem

```bash
mount -t proc /proc ./proc
mount --rbind /sys ./sys
mount --rbind /dev ./dev
```

It's time to chroot

```bash
chroot . /bin/bash
source /etc/profile
export PS1="(chroot) $PS1"
```

Installing a Portage Snapshot

```bash
emerge-webrsync
emerge --sync
eselect news read
```

Choosing the Right Profile. `eselect profile list`, as you can see gnome and kde are listed, so if you want any other desktop environment you will have to select profile number **3** like that `eselect profile set 3`

Setting your timezone

```bash
echo "Europe/Brussels" > /etc/timezone
cp /usr/share/zoneinfo/Europe/Brussels /etc/localtime
emerge --config sys-libs/timezone-data
hwclock --systohc --utc
```

Configure locales, open up `/etc/locale.gen` and uncomment **en_US.UTF-8 UTF-8** or add your country specific locales. Generate the locales with `locale-gen`

Reload your environment `env-update && source /etc/profile`

##Configuring the Kernel#
We won't be configuring the kernel manually, **genkernel** will build the kernel automatically. Once you have gentoo installed, download virtualbox and experiment with the kernel configuration there, so in future you will know how to optimize and strip the kernel for your hardware.

Install the kernel source and genkernel `emerge -av gentoo-sources genkernel`. Then type `genkernel all` and wait around 10 minutes. Once genkernel completes, a kernel, full set of modules and initial ram disk (initramfs) will be created.

Don't panic if you see a triple **WARNING... WARNING... WARNING...**, read on and you'll realize that we need to take care of the fstab mounting points.

Open up `/etc/fstab` and remove the swap and floppy lines by hitting once CTRL + K for each line, the rest layout should look exactly like this:

```
/dev/sda2  /boot  ext2  defaults  0 2
/dev/sda3  /      ext4  noatime   0 1
/dev/cdrom  /mnt/cdrom  auto  noatime,ro  0 0
```

##Networking Information#

Setting the hostname, open up `/etc/conf.d/hostname` and replace **hostname="localhost"** with something like "CookieMonster"

Setting the root password with `passwd`

##Installing Necessary System Tools#

If you require Gentoo to automatically obtain an IP address for your network interface(s), you need to install dhcpcd with `emerge -av dhcpcd` followed by `rc-update add dhcpcd default`

If you want to index your system's files so you are able to quickly locate them using the locate tool, you need to install sys-apps/mlocate. `emerge -av mlocate`

If you want you can log everything that happens on your system in logfiles. This happens through the system logger `emerge -av syslog-ng` followed by `rc-update add syslog-ng default`

##Configuring the Bootloader#

Installing GRUB2 and sudo `emerge -av sys-boot/grub sudo`. Type exactly sys-boot/grub and not just grub, otherwise you'll end up with grub legacy.

Installing the GRUB2 files in /boot/grub and generating GRUB2 configuration.

```bash
grub2-install /dev/sda
grub2-mkconfig -o /boot/grub/grub.cfg
```

Exit the chrooted environment and unmount all mounted partitions.

```bash
umount -l /mnt/gentoo/dev
umount -l /mnt/gentoo/sys
umount -l /mnt/gentoo/proc
umount -l /mnt/gentoo/boot
umount -l /mnt/gentoo
reboot
```

Once booted log in as root, type `visudo` and uncomment **wheel**, next add a system user.

```bash
useradd -m -G users,wheel,audio,cdrom,portage,usb,games,video,lp -s /bin/bash username
```

That's it, you have minimal gentoo up and running - [Where to go from here?](http://www.gentoo.org/doc/en/handbook/handbook-amd64.xml?part=1&chap=12)

Install X, the desktop environment of your choice, network manager plus applet, audio libs, gpu drivers, and all of your favourite apps.

Gentoo has bigger if not the biggest wiki how-to and troubleshooting guides, so don't post low quality questions in the forum but seek the wiki and more especially read the **man** docs.
