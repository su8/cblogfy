
---

Replaced my CentOS DNS server with OpenBSD because this BSD derivative has a priority to be secure - all of it's code and packages are **audited**.

I like how bare bone it is, reminds of Arch and in same time the package naming is same as in CentOS.

OpenBSD recommends to install **packages** over the usage of **ports**, so in order to start using the **pkg_** tools you should add the main ftp mirror to your root profile which will allow all system users to use the **pkg_** tools.

```bash
echo export PKG_PATH=ftp://ftp.openbsd.org/pub/OpenBSD/`uname -r`/packages/`machine -a`/ >> ~/.profile
```

I find it really strange that OpenBSD doesn't have a **search** tool (except the ports) and we are left to invent our own solutions.

Installed OpenBSD with 2GB of ram, and saw it is not that ram hungry as centos, so removed 3x512MB modules and left the server with only 512MB of ram.

And here the problem came while booting - it tried to examine the system changes and repair the system configuration, but **fsck failed**

Tried to remount it as **rw** but it said 'device is busy'. After that spent nearly one hour in the search engines without any clue how to fix this issue.

Later on, a friend of mine told me to try fsck in live cd. I have a nice leather cd case and choosed the live cd with Tails.

When it booted, unmounted the OpenBSD partition and ran fsck to "Check for bad blocks and add them to the badblock list".

```bash
umount /dev/sdX
fsck -cf /dev/sdX
```

Wait a while and once it's done reboot the server and have fun :}
