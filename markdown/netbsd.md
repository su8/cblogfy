
---

I had a ghost keyboard lag and adding excessive charaters with `NetBSD`.

To fix it simply do:

```bash
sudo pkgin install fam dbus dbus-glib gegl glad freeglut
sudo cp -r /usr/pkg/share/examples/rc.d/{dbus,famd,hal} /etc/rc.d

vi /etc/rc.conf
# and append at the end
famd=YES
dbus=YES
sound_load=YES
hal=YES
```
