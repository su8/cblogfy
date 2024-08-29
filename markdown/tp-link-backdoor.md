
---

Few hours ago I spoke with a penetration tester and he mentioned about the TP-LINK devices that ship with built-in backdoors.

I wasn't impressed at the beginning, but when I came in home decided to test my TP-LINK: router, switch and wifi extender.

I'd better show you 3 pictures, so you can quickly eliminate that company from your future purchase list.

Just to remind you, even some of the biggest companies in the networking are shipping their gear with built-in backdoors, so be EXTREMELY careful with your future purchase.

![](img/file/tp_link_backdoor/tp-link-backdoor.png)

![](img/file/tp_link_backdoor/tp-link-backdoor-2.png)

![](img/file/tp_link_backdoor/tp-link-backdoor-busybox-shell.png)

One thing is sure, will replace the firmware of that vulnerable piece of sh1t with [dd-wrt](http://dd-wrt.com/site/index).

Post edit: With half-closed eyes I replaced the firmware with dd-wrt, it took me nearly 2 hours to read all the documentation and advices from dd-wrt.

I'm surprised that this new firmware added two new operation modes: router and BG (dunno what the BG acronym stands for), while with the previous it could only operate as access point or wifi extender, also the LEDs blink fine.

![](img/file/tp_link_backdoor/dd-wrt.png)

Access point mode set

![](img/file/tp_link_backdoor/dd-wrt-1.png)
