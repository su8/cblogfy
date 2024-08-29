
---

So running the `debootsrap` command gave you **Unable to execute target architecture**, here is how to fix it.

```bash
sudo apt purge arch-test
debootstrap --arch=amd64 bookworm /mnt http://ftp.us.debian.org/debian/
```
