
---

It is indeed time for change.

I had 8 wonderful months with Openbox and the time to try and learn something new has come.

I was wondering these days what to do, either write some lengthy tutorial or do some new changes to my Openbox configuration files. And then a link to someone's laptop made me to change my mind.

The guy was running dwm, which in turn is dynamic window manager (hence the name). I was impressed by his desktop screenshot and decided to delay my plans and give 'dwm' a try.

The picture below represents my 3rd day with dwm.

![](img/file/openbox-to-dwm/openbox-2-dwm.jpg)

Edited this post 6 months later to include the below picture.

![](img/file/openbox-to-dwm/dwm-6-months-later.png)

Since it is written and configured in C, I had no trouble getting it running, patched and configured they way I want to in the very first day.

My first day was all around to get dwm working, and deprecate **conky** with my own version written in C that depends entirely on the standard library and doesn't call any 3rd party program. And that is how [dwm-bar.c](https://github.com/wifiextender/dwm-bar) was born.

Later on saw that in the dwm website there was **dwmstatus** examples and borrowed the code that sets the root window name (the colored ram, drive, kernel, volume and time), so edited my program to output the data to the root window, instead using xsetroot in addition with my first dwm-bar.c version. I have cloned and pushed my program to their git, so by the time you read this post it will be merged.

On the second day I wanted to add some colorization and icons to the status bar without using dzen2 or any other 3rd party program. There was enormous number of patches in the dwm website, and to be honest the colorization patch posted there was broken and incomplete. Thankfully to GitHub's searching functions I managed to find different colorization patches, I have tried the ones with pango and cairo, but my system gpu is too weak to handle all the different effects.

I don't have to mention that almost every patch I came across in internet was broken, and it was up to me to fix it.

On third day (today) my primary task was to add only colorization and I did it. Here is a link to my dwm fork and patches [https://github.com/wifiextender/dwm-fork](https://github.com/wifiextender/dwm-fork)

I was comfortable with dwm in the very first day, because I already used 'alt' in Openbox to move windows around, and my **Archey** theme was written to hide the window titlebards, nor I have to mention that the borders drawn around each window was inspired by other tiling wm's.

When I moved from KDE to Openbox, my very first configuration had taskbar panel, system tray panel, and application launcher panel, they was based only on tint2. I was still regular DE user and couldn't live without panels.

Several months later decided to depracate all panels (fbpanel, tint2) and manage OB entirely from my keyboard.

Before the move to Openbox I did tried Xmonad, but I had hard time getting any snippet of code working as I had no experience with the Haskell language. So choosing the right window manager is not so important as what programming language(s) you know.

Most of the time I use 'floating' layout, and the tiling layout is used only when I program (text editor, file manager, terminal emulator). I am still unsure how to use the tags/workspaces properly.
