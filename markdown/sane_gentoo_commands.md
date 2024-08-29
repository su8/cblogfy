
---

Here are some sane Gentoo commands that you should use in order to keep your penguin cheesy.

>You have to be computer literate with strong "can do" attitude, and also be patient. If that's not your personality, then butt out.

Learn the basic commands from the [CheatSheet], then come back.

It will take you at least 2 minutes to completely update your system with the following commands (even without downloading and compiling something), but the checks that are performed are must have:

```bash
sudo emerge --sync
sudo emaint --fix cleanresume
sudo emerge --oneshot --update portage
sudo emerge --ask --update --deep --newuse --with-bdeps=y '@world'
sudo emerge --regen
sudo cp -r /var/cache/eix/{portage.eix,previous.eix}
sudo eix-update  # eix-diff to see whats new
sudo emerge '@module-rebuild'
sudo emerge '@preserved-rebuild'
sudo revdep-rebuild
```

There are several **sync** types, read the [1] and [2] pages if you want to use other sync type (for [example]) than the default **websync**.

Package removal.

```bash
sudo emerge --ask --unmerge www-client/firefox
```

Remove all the firefox installed dependencies afterwards.

```bash
sudo emerge --ask --verbose --depclean
```

Searching for package.
```bash
eix vim
# compact search mode
eix --compact vim
```

![](img/file/gentoo_commands/search1.png)
![](img/file/gentoo_commands/search2.png)

Which package the **gcc-config** program belongs to ?

```bash
equery belongs $(which gcc-config)
```

![](img/file/gentoo_commands/belongs.png)

Find out which packages depends on the **sqlite** package.

```bash
equery depends sqlite
```

![](img/file/gentoo_commands/depends.png)

Is **vlc** installed ?

```bash
qlist --installed vlc
```

What USE flags does **bash** supports and which of them are enabled ?

```bash
equery uses bash
```

![](img/file/gentoo_commands/uses.png)

Resuming the last `emerge` command, personally I have never used it.

```bash
sudo emerge --resume
```

How much time was spend to compile **gimp** ?

```bash
qlop --verbose --human --time --gauge gimp
```

![](img/file/gentoo_commands/compiletime.png)

Which packages was compiled with **ssl** USE flag ?

```bash
eix --installed-with-use --format '(purple,1)<category>()/{installed}(yellow,1){}<name>()-<installedversions:IVERSIONS>\n' ssl
# To achieve the opposite
# --installed-without-use
```

![](img/file/gentoo_commands/hasuse.png)

---

# The Unstable branch

![](img/file/gentoo_commands/unstable-packages.png)

To install any other **nodejs** version than 0.12.6 I have to use the [unstable] branch.

This means I have to add the wanted unstable nodejs version in **/etc/portage/package.accept_keywords**:

```
=net-libs/nodejs-5.10.1 ~amd64
```

Followed by running:

```bash
sudo emerge --ask --update --deep --newuse --with-bdeps=y '@world'
```

The unstable nodejs depends on another unstable package, which emerge gently asks me to unmask and add it for me.

![](img/file/gentoo_commands/dispatch.png)

To update the **package.accept_keywords** file I have to run:

```bash
sudo dispatch-conf
```

![](img/file/gentoo_commands/merge-changes.png)

Then press **u**.

Actually the diff colours are not enabled by default, to make it happen read [this].

![](img/file/gentoo_commands/unstable-installed.png)

Constrain yourself from using the Unstable branch, unless you super duper need to.

---

Wrapping all the presented commands in functions that you should add to your $USER shell configuration file

```bash
__emerge() { sudo emerge "$@" }

# Package remove
C() { __emerge --ask --unmerge "$@" }

# Dependencies removal
orphans() { __emerge --ask --verbose --depclean }

# Changed USE flags, recompile the affected packs
rebuild() { __emerge --ask --update --deep --newuse --with-bdeps=y '@world' }

# Update the penguin
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
}

# Detect and fix broken libraries
preserved-rebuild() { __emerge '@preserved-rebuild' }
revdep() { sudo revdep-rebuild }

# Which packages ... to/on ...
belongs() { equery belongs $(which "$@") }
depends() { equery depends "$@" }

# List the package content
list() { equery files "$@" }

# Search for package
match() { eix --compact "$@" }

# Resume the last `emerge` command
resume() { __emerge --resume }

# manage /etc diff. changes, mostly 'z'
dispatch() { sudo dispatch-conf }

# Query the compile time log
compiletime() { qlop --verbose --human --time --gauge "$@" }

# Output all packages compiled with given USE flag
hasuse() {
    eix --installed-with-use --format \
        '(purple,1)<category>()/{installed}(yellow,1){}<name>()-<installedversions:IVERSIONS>\n' \
        "$@"
}
```

If that's not enough for you, make use of the following programs:

```bash
eclean distfiles
euse -i USEFLAG
gcc-config
q
qatom
qcache
qcheck
qdepends
qfile
qglsa
qgrep
qsearch
qsize
quse
eclean
eclean-dist
eclean-pkg
enalyze
eread
euse
eshowkw
glsa-check -l|-p|-f affected
glsa-check --test all
glsa-check --fix all
```

[unstable]: https://wiki.gentoo.org/wiki/Knowledge_Base:Accepting_a_keyword_for_a_single_package
[this]: https://wiki.gentoo.org/wiki/Dispatch-conf#Changing_diff_or_merge_tools
[example]: https://wiki.gentoo.org/wiki/Handbook:Parts/Working/Features#Validated_Portage_tree_snapshots
[1]: https://wiki.gentoo.org/wiki//etc/portage/repos.conf
[2]: https://wiki.gentoo.org/wiki/Project:Portage/Sync
[CheatSheet]: https://wiki.gentoo.org/wiki/Gentoo_Cheat_Sheet
