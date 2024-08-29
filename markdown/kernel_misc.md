
---

By default the kernel cpu frequency governor will be set to "performance". It means that the cpu will always run at the highest possible clock rate regardless of it's use/idle. The only side effect of this is higher temps when on idle (true if the cpu has multiple cores and or threads).

The powersaving governor will always run at the lowest possible clock rate regardless of it's use/idle. The side effect - slower machine no matter what you do.

The ondemand governor does what it says - ondemand scaling. With it you get the best performance when you need to, powersaving and lower temps when on idle.

---

Have you ever tried reading **/dev/mem** ?

![](img/file/kernel_misc/virus.png)

The output might not be that much friendly as the one from dmidecode without some workarounds.

---

Even 100 MB dedicated just for the **/boot** partition will not be enough, if you do not remove some obsolete files.

![](img/file/kernel_misc/maps-bloat.png)

In the above image the **/boot** partition was using 56 MB of which: System maps plus configs - 22 MB, 4 recent kernels - 22 MB. After removing most of the old system maps and configs, the partition usage was decreased with 20 MB. Do not remove ALL the system maps, as the recently installed kernel might need some debugging.

---

Don't just blindly install any kernel version. For example if you just purchased brand new computer parts, you would definetely have to have the latest kernel, drivers and compiler. And vice versa if your system is a couple years old, stick with some longterm kernel version.
