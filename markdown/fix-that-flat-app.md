
---

Often times I get asked how do I make my desktop applications to have oxygen style and not flat design.

I think it was nearly 3 years ago when I moved to Chromium from Firefox and it's design was kinda flat, then I found how to force that design to use Oxygen theme and make it eyecandy.

Yesterday ditched Chromium in flavour of Firefox 29. The new chromium version (35) is full of bugs, the new scrollbar, appearance, bookmarks jumping randomly, flash vides doesn't want to start but the buffering is working, the text in websites disappears and appears randomly. Those are the bugs that I've discovered in range of 4 days, for sure there's way more. I don't like how the Chromium devs are trying to copy the Chrome design so badly that they made the lastest release complete garbage.

Some applications are written in GTK, so your first task is to install gnome themes (doesn't matter if you are using Desktop Environment different than Gnome Hell).

```bash
pacman -S gnome-themes-standard oxygen-gtk2 oxygen-gtk3
```

If you are a KDE user install `kde-gtk-config` and `oxygen-icons` too.

Next, type `sudo find / -name qtconfig`, wait few moments then copy the output and execute it (my qtconfig is in /usr/lib/qt4/bin/qtconfig).

Here are some examples with firefox being flat, and once forced to use Oxygen theme with qtconfig and GTK.

![](img/file/flat_app/ff-flat.png)

![](img/file/flat_app/qtconfig.png)

![](img/file/flat_app/ff-qtconfig.png)

![](img/file/flat_app/kde-gtk-config.png)

From now on, all GTK and Qt applications will be forced to use Oxygen theme and they won't have that flat design by default. See you later :}
