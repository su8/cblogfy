
---

My hands are still shaking after bringing my wife's lenovo tab 2 a7 tablet back to life. The tablet was stuck in **reboot loop**.

When she purchased her tablet one year ago, it came with Anrdoid 4.4, and yesterday she was offered to do system upgrade and get Android 5.0.

So after downloading zip file that was 1 GB in size and performing system upgrade, the tablet was stuck in reboot loop.

She came to me one hour ago and told me that her tablet isn't working properly and she wanted from me to fix it, lol.

The interesting part was that I couldn't even invoke the bootloader menu by holding down the power and volume up buttons.

Eventually the tablet ran out of power, just before my patience. After a while I decided to grab the tablet while it's charging and try to invoke the bootloader menu. It turns out that I can only invoke the bootloader menu while the device has charger connected to it, and voila the bootloader menu appeared.

Performed factory reset and the tablet was ready to go. Few minutes ago my wife came back again and asked me with dissapointing voice why she can't use her microsd card as internal storage for the tablet.

Then I connected the dots and realised what might have caused this reboot loop. It turns out that my wife had set her microsd card to be used as internal storage in Android 4.4, but in Anrdoid 5.0 you can't choose which storage is going to be your internal one. So Android 5.0 was installed in the microsd card, while the bootloader was trying to boot it from the internal storage. By default all the upgrading and recovery files are stored in the internal (solder) device storage. That's why I was able to perform factory reset and get Android 5.0 instead 4.4 afterwards.

It's really **dumb decision whoever took it** to first let you choose which storage can be used as internal and then remove this option while making general assumption instead respecting the device owner choice that he/she have done prior to the upgrade.
