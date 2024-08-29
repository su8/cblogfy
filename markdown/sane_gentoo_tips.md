
---

I have not posted anything related to Gentoo since I made the switch back in August 2015.

Here are some sane tips for the average Joe that's still considering to give Gentoo a try.

>You have to be computer literate with strong "can do" attitude, and also be patient. If that's not your personality, then butt out.

Let's begin by busting the myth that "it takes a lot of time to compile something".

In [this](img/file/gentoo_tips/compile-time.txt) link you can find out exactly how much compile time was spend for each of my 704 "packages" (programs/libraries) installed on [my desktop](img/file/my-pc/final-result.jpg) machine. Note that the compile times are tied **only** to my hardware and make.conf

More than 70% of the packages will compile in the range of 1 - 5 minutes. Obviously the gpu drivers, browsers, language specific compilers, will take from 15 minutes up to 1 hour. For packages such as Chromium where the compile time takes up to 5 hours, you can leave your computer on and install them overnight.

What's the point of compiling over pre-compiled packages (a.k.a binaries) ? Greater control over the features that you want or don't want. Do you prefer libav or [ffmpeg](http://blog.pkh.me/p/13-the-ffmpeg-libav-situation.html) that vlc will be compiled with ? Do you want or don't want certain codec/decoder/muxer that vlc will be compiled with ?

For example I've inlined the necessary modules in the kernel needed **only** to boot up my computer. In other words I not only made the boot up process faster, but the overall RAM usage when my computer starts is reduced to only 40 MB with X server, zsh, XMonad, urxvt, my status bar program, dmenu (and several other programs) running in the background.

Install **app-portage/cpuinfo2cpuflags** and run `/usr/bin/cpuinfo2cpuflags-x86` to find out what CPU flags your processor has. Copy and paste the output in **make.conf**

Here are some sane **make.conf** variables that you can add and use without worries about breaking something, replace the **# change** occurrences according to your system hardware/software likes. The following [1](https://wiki.gentoo.org/wiki//etc/portage/make.conf), [2](https://packages.gentoo.org/useflags/input_devices_evdev), [3](https://dev.gentoo.org/~zmedico/portage/doc/man/make.conf.5.html) pages will explain in greater details what those variables do:

```bash
# 'jobs' tunning
MAKEOPTS="-j3"  # change
EMERGE_DEFAULT_OPTS="-j1"

# increase/decrease cpu load
# higher load == shorter compile time
#PORTAGE_NICENESS="19"

# Preferred hardware and software
VIDEO_CARDS="radeon r600" # change
INPUT_DEVICES="evdev" # change

# buildpkg and parallel-fetch are must have
FEATURES="${FEATURES} parallel-fetch buildpkg"

# Misc
LINGUAS="en"
LANGUAGE="en"
PKGDIR="/var/pkg"
PORTDIR="/usr/portage"
DISTDIR="${PORTDIR}/distfiles"
QT_STYLE_OVERRIDE=gtk

# Per package logging
PORT_LOGDIR="/var/log/portage"
PORTAGE_ELOG_SYSTEM="echo save syslog:error"
PORTAGE_ELOG_CLASSES="info warn error log"

# 'man' and 'doc' compression
PORTAGE_COMPRESS="gzip"
PORTAGE_COMPRESS_FLAGS="-9"
```

You'll have to install **app-crypt/gentoo-keys** to use 

It's useful to have **buildpkg**, as there will be times that you'd want to rollback and use some older version of certain package.

![](img/file/gentoo_tips/pkg_dir.png)

Don't sneak in and enable any global [USE](https://www.gentoo.org/support/use-flags/) flags to the **USE=""** variable. Instead you should stick and use per package USE flags, just hold tight and keep reading.

It's safe to do the following (read the explanation afterwards):

```bash
DISZABLE="-systemd -kde -gnome -http -introspection \
-llvm -clang -libnotify -policykit -consolekit -ruby \
-gpm -udisks -qt3 -qt3support -esd -gusb -ipv6 -cups \
-avahi -emboss -hal -isdnlog -joystick -evo -ppds \
-qt5 -pulseaudio -startup-notification -thin -bindist"

USE="mmx sse sse2 ${DISZABLE}"
```

I don't want any systemd, kde, gnome related stuff, so by disabling those flags Globally, it means that all packages that I'm going to download and compile in future will not have those flags enabled, even if they was enabled by default.

If I add **USE="... X"**, all packages on my system that support this flag will be affected and re-compiled, even those that have the flag **explicitly disabled** by default.

If this is your first time installing Gentoo, then I could forgive you and tell you that you can temporary just for the duration of the installation process, you can add as many flags as you like, just limit them to get the system up and running, repeating: just to get the system up and running.

Create the **/etc/portage/package.use/** directory, add the following functions to your $USER shell configuration file:

```bash
# Add all programs and their USE flags
insertallpackswithuseflags() {
    set -A remove_flags
    local the_packs='/etc/portage/package.use/allpacks'

    qlist --installed --umap --nocolor --verbose | \
      sudo tee "${the_packs}" > /dev/null

    remove_flags=(
      '(' ')'
    # some `sed' regex kung fu
      '\S*\('{abi_,elibc_,kernel_,video_}'\)\S*'
      '\S*\('{input_,linguas_,userland_}'\)\S*'
      '\S*\(cpu_flags\|python_\)\S*'
    )

    for x in "${remove_flags[@]}"
    do
        sudo sed -i "s/${x}//g" "${the_packs}"
    done

    # make sure the rest $ are not empty
    gawk '{
      for (x=2; x <= NF; x++) {
        if ("" != $x) {
          print ">="$0;
          break;
        }
      }
    }' "${the_packs}" \
        | sudo tee "${the_packs}" > /dev/null
;}
```

Adjust **remove\_flags** according to your **make.conf**

Now when you run `insertpackswithuseflags` only the packages that have configurable USE flags will be added to **/etc/portage/package.use/use\_packs**, on my system only 280 out of 704 have configurable USE flags. At this point you can remove all previously added USE="... flags" in **make.conf**. Here's preview of my **use\_packs**.

```bash
>=x11-apps/mesa-progs-8.2.0 egl gles2
>=x11-apps/xdpyinfo-1.3.2 xinerama
>=x11-apps/xinit-1.3.4-r1 minimal
>=x11-base/xorg-server-1.17.4 glamor nptl suid udev xorg xvfb
>=x11-drivers/xf86-video-ati-7.5.0 glamor udev
>=x11-libs/cairo-1.14.2 X  glib opengl svg xcb
>=x11-libs/gdk-pixbuf-2.32.3 X  jpeg tiff
>=x11-libs/gnome-pty-helper-0.40.2 hardened
>=x11-libs/gtk+-2.24.29  vim-syntax xinerama
>=x11-libs/gtk+-3.18.7 X  colord vim-syntax xinerama
>=x11-libs/libSM-1.2.2-r1  uuid
>=x11-libs/libXfont-1.5.1 bzip2 truetype
>=x11-libs/libpciaccess-0.13.4  zlib
>=x11-libs/libva-1.6.2 X  drm egl opengl vdpau
>=x11-libs/libva-vdpau-driver-0.7.4-r3  opengl
```

Install **app-portage/portage-utils** and **app-portage/gentoolkit**. Always keep a backup with all of your currently installed packages and their use flags (**/etc/portage/package.use/use\_packs**).

```bash
installed_packs="${HOME}/installed_packs"
qlist --installed > "${installed_packs}"
sort -u "${installed_packs}" -o "${installed_packs}"
```

Managed to f...k up your system ? No worries, copy & paste make.conf and use\_packs, then install all packages from installed\_packs. That's it. All the packages and their USE flags will be compiled with your previously configured USE flags like nothing have happened.

Remember that when you edit **/etc/portage/package.use/use_packs** to add/remove some package flags, you'll have to run:

```bash
sudo emerge --ask --update --deep --newuse --with-bdeps=y '@world'
```

So the affected package(s) will be re-compiled with the exchanged flags. Regularly run `insertpackswithuseflags` and backup make.conf, use\_packs, installed\_packs.

In this post you've learned how to avoid putting all of your eggs in one basket. Also avoiding a lot of potential circular dependencies, breakages and blockers.

In the next post I'll talk about sane commands that you should use to keep your penguin cheesy, and dealing with blockers.
