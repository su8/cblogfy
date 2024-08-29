
---

I dual boot from time to time. Today while upgrading my archey noticed that the upgraded GRUB did not detected my windows partiotion.

Rebooted the computer and what to see - only archlinux was listed...

To fix it, tell grub to recheck the particular drive partiotion and generate new configuration after that.

```bash
grub-install --recheck /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```
