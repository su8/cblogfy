
---

Nowadays most of us got more than one smartphone and or tablet and the only way to connect to the internet is by having wireless internet. It makes it really annoying, because the bigger your house is the wireless signal quality degrades. The built-in antennas in those devices are weak which leaves you the only choice to be closer to the router in order to get proper internet speed.

Personally, I faced this issue while ago and solved it with really simple and cheaper approach.

Even in the case of 3G internet, this post will be a life saver for those of you that wish to share the connection with someone else.

![](img/file/extend_coverage/gliffy-diagram.png)

This is the stuff that you'd need to prepare, wifiextenders are better in this situation (you don't have to use computer nor usb wifi dongle), but I'll focus this post to the people that got access points around.

I'll make it even more easier by deploying a rolling release distro [(Sabayon 14.01 XFCE)](http://torrents.sabayon.org/file?info_hash=%DEX%C2%95%CAf%E8d%80%0F%C8D%12%B0%B3%80M%C6%05f) with X server up and running for easier maintenance (to those of you that are not GNU/Linux power users), with the lowest memory consumption you'll ever seen ~ 80MB-110MB, since it's rolling release the supported hardware shouldn't not be a issue.

Once Sabayon is installed, Right click over the NetworkManager applet and press Edit Connections.

![](img/file/extend_coverage/edit-connections.png)

Point the ethernet interface and click Edit

![](img/file/extend_coverage/edit-network-connections.png)

Over the IPv4 Settings tab, click over the Method combobox and select "Shared to other computers"

![](img/file/extend_coverage/shared-eth1.png)

Click Save and reboot the computer

Once booted, connect to your wireless network first, and then click 'connect' to the ethernet interface in order to bond both devices.

![](img/file/extend_coverage/connected-wifi-eth1.png)

Enjoy the blazing speed and better wireless signal quality.
