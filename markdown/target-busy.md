
---

The problem: Mounted /boot and removed some older kernel versions to free some space. Then I **su**, downloaded and compiled the latest stable kernel. Everything went well until I tried to umount /boot.
**/boot: target is busy** , but I was in /usr/src/linux and not /boot.

The solution was to find which process is doing something with the /boot dir:

```bash
fuser -a /boot

# /boot: 1208
```

`fuser` gave me the process PID number, now all I had do is `ps` this number.

```bash
ps -q 1208

# 1208 pts/0  00:00:00 zsh
```

I forgot that before I **su**, I mounted and changed the directory to /boot which my regular user shell was in.

The next time you need to force mount or umount, please do yourself a favour and find out what is causing the refusal.
