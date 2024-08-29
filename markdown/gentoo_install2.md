
---

Before writing anything all I can say is that I'm back using `Gentoo` as my 2nd OS on my `Windows 11` laptop.

I saw what packages are needed when I used `Manjaro` and compiled them in `Gentoo`.

`Gentoo` is replacing `Manjaro` after using it for about 4 months. `Gentoo` was my primary OS starting back in 2015 until 2018. Used `Archlinux` from 2013 until 2015, right when I wanted to try `FreeBSD` as my daily driver, but had issues with peripherals. Used `FreeBSD` for 2 weeks and then went using `Gentoo` and stayed and used it until my computer cpu died and was left only with tablet and smartphone until 2022 when I purchased [brand new laptop](https://su8.github.io/#!post=laptop).

There is a nice well written Gentoo handbook that will take your hand and install gentoo for you, even if you don't have any experience or knowledge.

> Note that this installation is for `bios legacy` computer and not the newer U/EFI. Please refer to [the Gentoo wiki](https://wiki.gentoo.org/wiki/GRUB#GRUB_Bootloader_Installation).

Head over https://www.gentoo.org/downloads/ and download the `minimal amd64 .iso`. Boot it and type `ping -c3 youtube.com` and in case of network issue you should head over to [The Gentoo handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation#Automatic_network_configuration).

```bash
parted -a optimal /dev/sda
mklabel gpt
unit MB
mkpart primary 1 100
set 1 boot on
mkpart primary 100 -1
print
quit

# Creating and mounting the filesystems
mkfs.ext4 /dev/sda1
mkfs.ext4 /dev/sda2
mount -t ext4 /dev/sda2 /mnt/gentoo
cd /mnt/gentoo
mkdir -p boot
mount -t ext4 /dev/sda1 boot
mount -t proc none proc
mount -o bind /sys sys
mount -o rbind /dev dev

# download the stage 3 tarball
links https://www.gentoo.org/downloads/ # watch out, the first openrc is for ARM64 and not AMD64
tar tar --extract --preserve-permissions --file stage3-amd64-openrc-*.tar.xz --xattrs

# Copy your current DNS nameservers
cp -L /etc/resolv.conf etc

# It's time to chroot
chroot . /bin/bash
env-update
source /etc/profile

# Installing a Portage Snapshot
emerge-webrsync
emerge --sync

# Selecting desktop profile

eselect profile list
eselect profile set 23

# Setting your timezone
echo 'Europe/Brussels' > /etc/timezone
cp /usr/share/zoneinfo/Europe/Brussels /etc/localtime
emerge --config sys-libs/timezone-data
hwclock --systohc --utc

emerge -uDv --changed-use @world
```

Create a file in `/etc/portage/repos.conf/gentoo.conf`

```bash
[DEFAULT]
main-repo=gentoo

[gentoo]
location=/usr/portage
sync-type=git
sync-uri=https://github.com/gentoo-mirror/gentoo
auto-sync=yes
sync-depth=1
```

Now let's get back to the commands.

```bash
emerge -aq dev-vcs/git
rm -rf /usr/portage
emerge --sync

# setting up locale
vi /etc/locale.gen # uncomment en_US utf8
locale-gen
env-update
source /etc/profile
```

Create a file named `cpuorakle.awk`:

```bash
#!/usr/bin/awk -f
@load "filefuncs";
{
  gsub(/\"/,"");
  for (x=1; x < NF; x++) {
    if (match($x,/march|cache/)) {
      cflagz[$x]++;
    } else if (match($x,/mpopcnt|m3dnow|msse|mssse|maes/)) {
      x86[substr($x,3)]++;
    } else if (match($x,/mcx16|mabm|mlzcnt|msahf/)) {
      x86[substr($x,2)]++;
    }
  }
}
function concatMe(arr) {
  ret="";
  for (x in arr) {
    str=(match(x,/cache/) ? "--param"" "x : x);
    ret=ret" "str;
  }
  return ret;
}
END {
  PROCINFO["sorted_in"]="@ind_str_asc";
  cpuf="/proc/cpuinfo";
  if (0 == stat(cpuf, buf)) {
    while (0 != (getline cur_line < cpuf)) {
      if (match(cur_line, "flags")) {
        split(cur_line, arr, " ");
        if (0 != arr_len=length(arr)) {
          for (x=1; x < arr_len; x++) {
            if (match(arr[x],/mmxext|3dnowext/)) {
              x86[arr[x]]++;
            }
          }
        }
        break;
      }
    }
    close(cpuf);
  }

  if (0 != length(x86)) {
    printf("CPU_FLAGS_X86=\"...%s\"\n",concatMe(x86));
  }

  if (0 != length(cflagz)) {
    printf("CFLAGS=\"...%s\"\n",concatMe(cflagz));
  }
}
```

Execute it like this:

```bash
chmod +x cpuorakle.awk
gcc '-###' -march=native -x c - 2>&1 | ./cpuorakle.awk
```

Now edit `/etc/portage/make.con` with the produced CPU_FLAGS_X86="" , CFLAGS="" from the `cpuorakle.awk` script:

```bash
# CPU tunning
# https://gcc.gnu.org/onlinedocs/gcc-4.4.4/gcc/i386-and-x86_002d64-Options.html
# https://gcc.gnu.org/gcc-4.5/changes.html
STD_FLAGZ="mmx mmxext popcnt sse sse2 sse3 sse4a" # edit me
ADD_FLAGZ="3dnow 3dnowext mcx16 msahf mlzcnt mabm mprfchw" # edit me
PARAM_CACHE="--param l1-cache-size=64 --param l1-cache-line-size=64 --param l2-cache-size=512" # edit me

#CC="gcc"
#CXX="g++"
CPU_FLAGS_X86="${STD_FLAGZ} ${ADD_FLAGZ}"
CFLAGS="-march=native -O2 -pipe ${PARAM_CACHE}" #edit me
CXXFLAGS="${CFLAGS}"
CHOST="x86_64-pc-linux-gnu"

# 'jobs' tunning
MAKEOPTS="-j8" # edit me with your CPU cores and threads
EMERGE_DEFAULT_OPTS="-j1"
#PORTAGE_NICENESS="19"

# Preferred hardware and software
VIDEO_CARDS="intel" # edit me
INPUT_DEVICES="evdev"

# emerge options, refer to `man make.conf'
FEATURES="${FEATURES} parallel-fetch buildpkg split-elog split-log"
#GENTOO_MIRRORS="rsync://de-mirror.org/gentoo/"

# Don't sneak in the following USE flags
# unless I say so with 'package.use'
DISZABLE="-systemd -kde -gnome -http -introspection \
-llvm -clang -libnotify -policykit -consolekit -ruby \
-gpm -udisks -qt3 -qt3support -esd -gusb -ipv6 -cups \
-avahi -emboss -hal -isdnlog -joystick -evo -ppds \
-qt5 -pulseaudio -startup-notification -thin -bindist \
-hangouts -proprietary-codecs"

# I'll send you to Valhalla if touch this
USE="${CPU_FLAGS_X86} ${DISZABLE}"

# Misc
# replace linguas with L10N when obsolete
LINGUAS="en"
LANGUAGE="en"
L1ON="en"
L10N="en"
PKGDIR="/var/pkg"
PORTDIR="/usr/portage"
DISTDIR="${PORTDIR}/distfiles"
QT_STYLE_OVERRIDE=gtk
PORTAGE_GPG_DIR="/var/lib/gentoo/gkeys/keyrings/gentoo/release"

# Per package logging
PORT_LOGDIR="/var/log/portage"
PORTAGE_ELOG_SYSTEM="echo save syslog:error"
PORTAGE_ELOG_CLASSES="info warn error log"

# 'man' and 'doc' compression
PORTAGE_COMPRESS="gzip"
PORTAGE_COMPRESS_FLAGS="-9"

#PORTAGE_GPG_KEY="F3BC613861A25A87"

ABI_X86="64 32"
```

Install some packages:

```bash
# you can save up some time by downloading the `gentoo-sources-bin' kernel
emerge -aq dhcpcd sudo gentoolkit pciutils syslog-ng sys-boot/grub sys-kernel/genkernel sys-kernel/gentoo-sources xf86-video-amdgpu xf86-video-ati xf86-video-intel xf86-video-nouveau sys-kernel/linux-firmware --autounmask

dispatch-conf # press  u
# now run the `emerge' command above again
# re-read the comment above
```

Open up `/etc/portage/package.use/allpacks`

```bash
media-libs/mesa -llvm
app-crypt/gcr -vala -llvm -clang
app-crypt/libsecret -vala -llvm -clang
gnome-base/librsvg -vala -llvm -clang
###########################################
```

The masked USE flags, now to take in effect run:

```bash
# run these 2 commands everytime you unblock/add USE flags to some package
emerge --update --deep --newuse --with-bdeps=y -aq @world
emerge --depclean
#########################################################

# if you stumble upon blockage, `emerge' package by package, not all of them in a single line and re-run the two `emerge' commands above
USE='-vala -llvm intel' emerge -aq app-crypt/gcr x11-base/xorg-drivers x11-base/xorg-proto x11-base/xorg-server x11-base/xorg-x11 x11-drivers/xf86-input-evdev x11-libs/xcb-util-wm x11-libs/xcb-util-keysyms x11-libs/xcb-util x11-libs/libX11 x11-libs/libXft x11-libs/xcb-util-wm dev-util/pkgconfig virtual/pkgconfig x11-apps/xsetroot x11-terms/xterm x11-themes/adwaita-icon-theme x11-themes/faenza-icon-theme x11-themes/gnome-icon-theme-symbolic x11-themes/gnome-themes-standard x11-themes/gtk-engines x11-themes/gtk-engines-adwaita x11-themes/xcursor-themes xfce-base/thunar media-libs/mesa dev-libs/libevdev nitrogen eix --autounmask

rc-update add dhcpcd default
rc-update add syslog-ng default
libtool --finish /usr/lib/sudo
libtool --finish /usr/lib

# everytime when you download some new kernel do this below:
eselect kernel list
eselect kernel set 1
genkernel --mountboot --install all

# add some users
useradd -m -G users,wheel,audio,video,cdrom,usb,portage -s /bin/bash username
passwd username
passwd
```

Next is `/etc/fstab`

```bash
emerge -aq genfstab
genfstab -U / > /etc/fstab
```

Almost done:

```bash
visudo # uncomment `wheel'

grub-install --recheck /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg

git clone https://github.com/su8/hellxcb
git clone https://github.com/su8/doomy
git clone https://github.com/su8/pinky-bar

cd hellxcb && make -j8 && make install
cd doomy && make -j8 && make install
cd pinky-bar && perl set.pl gentoo && autoreconf -if
bash configure --prefix=/usr --without-net --without-colors
make -j8 && make install
```

Create a file named `pinky` in your $HOMEE directory:

```bash
--title=CPU
--cpu-percent-all

--title=RAM
--ramperc

--title=SSD
--driveperc

--title=Pkgs
--packages

--kernel
```

Create a file named `bar.sh` in your $HOME directory:

```bash
# bar.sh
while true; do  echo \
  `cat /tmp/hellxcb.txt | \
  sed -E 's/tag: 1/tag: web/g; s/tag: 2/tag: dev/g; s/tag: 3/tag: misc/g; s/tag: 4/tag: float/g; s/tag 1/web/g; s/tag 2/dev/g; s/tag 3/misc/g; s/tag 4/float/g;'` \
  ' '\
  `pinkybar --conf /home/frost/pinky`  > /tmp/doomy.txt;sleep 1; done
```

Create a file named `.xinitrc` in your $HOME directory:

```bash
[[ -d /etc/X11/xinit/xinitrc.d ]] && {
  for f in /etc/X11/xinit/xinitrc.d/*
  do [[ -x "$f" ]] && . "$f"; done
  unset f
}

xsetroot -cursor_name left_ptr
bash bar.sh &
doomy &
nitrogen --set-scaled "$HOME/pinky.jpg" &
# keyboard language
setxkbmap -layout us -variant basic terminate:ctrl_alt_bksp &

# disable energy saving (monitor)
xset -dpms &

# disable screensaver   (monitor)
xset s off &
```

And we are done:

```bash
# to scan your library direcories and rebuild them if needed
revdep-rebuild

exit
umount -R dev
umount -R sys
umount -R proc
umount -R boot
cd ~
umount -R /mnt/gentoo
reboot
```

Here are some `Gentoo` functions to have in your shell `config` file(s).

```bash
#---------------------------------------------
# Gentoo functions
#---------------------------------------------

source '/lib/gentoo/functions.sh'

__emerge() { sudo emerge "$@" ;}

# R
C() { __emerge --ask --unmerge "$@" ;}

# Qtdq/Rsnc
orphans() { __emerge --ask --verbose --depclean ;}

rebuild() { __emerge --ask --update --deep --newuse --with-bdeps=y '@world' ;}

# Syu
update() {
    einfo 'Running sync' 
    __emerge --sync

    einfo 'Running emaint' 
    sudo emaint --fix cleanresume

    einfo 'Running portage update' 
    __emerge --oneshot --update portage

    einfo 'Running system update' 
    rebuild

    einfo 'Running metadata regeneration' 
    __emerge --regen --quiet

    sudo cp -r /var/cache/eix/{portage.eix,previous.eix}
    einfo 'Running eix update' 
    sudo eix-update  # eix-diff to see whats new
    eix-diff

    einfo 'Running external kernel modules rebuild' 
    __emerge '@module-rebuild'

    einfo 'Running preserved libs rebuild'
    preserved-rebuild

    einfo 'Running Reverse Dep. Rebuilder'
    revdep
;}

# Qu
upgrades() { eix -cu --world ;}

preserved-rebuild() { __emerge '@preserved-rebuild' ;}

revdep() { sudo revdep-rebuild ;}

# Qo
belongs() { equery belongs $(which "$@") ;}

depends() { equery depends "$@" }

# Ql
list() { equery files "$@" ;}

# Qqs
match() {
    eix -S -I "$@"
    eix "$@"
    qlist --installed "$@"
;}

resume() { __emerge --resume ;}

# manage /etc diff. changes, mostly 'z'
dispatch() { sudo dispatch-conf ;}

# This one is really handy, query the compile time log
compiletime() { qlop --verbose --human --time --gauge "$@" ;}

# Output all packages compiled with given USE flag
hasuse() {
    eix --installed-with-use --format \
        '(purple,1)<category>()/{installed}(yellow,1){}<name>()-<installedversions:IVERSIONS>\n' \
        "$@"
;}
```

Now run the `update()` command and search thru `eix package_name` when you want to search for some package.

If you need to install some package from the `unstable` branch open up `/etc/portage/package.accept_keywords` and add it like this:

```bash
# /etc/portage/package.accept_keywords
# will install the amd64 unstable kernel, just don't forget to `eselect kernel list/set NUM`
=sys-kernel/gentoo-sources-4.4.73 ~amd64
```

The bar in use is made of [pinkybar](https://github.com/su8/pinky-bar) and [doomy](https://github.com/su8/doomy) and the window manager is my fork of monsterwm-xcb called [hellxcb](https://github.com/su8/hellxcb).

That was it, as simple as that.