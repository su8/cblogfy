
---

You know what they say, "what doesn't kill you makes you stronger".

In the past I would get really upset from trolls, but thru the years I learned how to redirect the negativism into something useful.

So after some recent events, I managed to redirect the negativism of one troll into further development of my dwm-bar.c which I renamed to pinky-bar.

No more pre-defined configuration. Out of the box the user have to supply command line options that will tell to the program what, where, how and which system information to output. So if the user only wants cpu and ram information, those are the options that will have to supplied - `--cpu --ram`, the options order will dictate how and where they'll appear in the statusbar.

The program now supports any window managers, instead just dwm.

Added MPD support, so the user can see the name of currently played song.

![](img/file/pinky-bar/mpd.png)

The sleeping time is dictated by the clock ticks per second macros, instead hard-coding them. 

Improved and added more autoconf tests, improved the error checking and handling if such events ever occur.

---

The program can now be used anywhere, after some inspiration from tmux, pinky-bar is no longer tied to Window Managers only.
