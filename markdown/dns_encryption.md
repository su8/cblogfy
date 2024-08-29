
---

Just found out that DNSCrypt can be used without OpenDNS.

Let's dive into the DNS encryption configuration.

In **/etc/resolv-dnsmasq.conf** add:

```bash
nameserver 127.0.0.2
```

Open up **/etc/dnsmasq.conf** and append:

```bash
resolv-file=/etc/resolv-dnsmasq.conf
```

Install **libsodium**.

Now [download](http://download.dnscrypt.org/dnscrypt-proxy/) the latest DNSCrypt version, extract the archive with `tar -vxf dns*`, **cd** into the newly created folder, compile and install it with:

```bash
./configure --prefix=/usr
make
sudo make install
```

Go to the opennicproject DNSCrypt [page](http://meo.ws/dnsrec.php) and choose the server that is closer to your country - it should be the same IP that is present in `/etc/resolv.conf`. I'll use some random one. Now start the dnscrypt program with the selected server:

```bash
dnscrypt-proxy --provider-key=1F92:37B2:4083:D058:E871:615B:59C7:3E28:EC54:FC4E:231D:017B:DA02:A532:6AF2:72BE --provider-name=2.fvz-rec-de-dus-01.dnscrypt-cert.meo.ws --resolver-address=62.141.38.230:443 --local-address=127.0.0.2:53 --user=nobody --daemonize
```

127.0.0.**1** is used by dnsmasq while 127.0.0.**2** will be used by DNSCrypt, so make sure to type 2 and not 1.

My ISP is intentionally slowing all of the arch mirrors ([despite my attempts](https://wiki.archlinux.org/index.php/Mirrors#List_by_speed)) whenever I try to upgrade my system. I never would have thought that dnscrypt would bypass bandwidth throttling, but it did; viva dnscrypt !

Now I know that my ISP is filtering the packets and has some pattern matching algorithms. At least I have clue, so a couple levels of OpenBSD firewalls and Tor routers will be installed right now. Tor router -> OpenBSD firewall -> Tor Bundle on every personal computer at home. I'll have to buy another 16 port switch and 12 NICs. My whole weekend will be true madness.
