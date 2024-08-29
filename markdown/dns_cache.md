
---

Instead tweaking and squeezing the browsers settings, there are more elegant solutions that would speed up your internet browsing.

The post today will be simple enough, so even a casual computer user will be able to configure **dnsmasq**.

Let's begin with what DNS is and why we need it.

The Domain Name System - DNS is distributed naming system technology that translates domain names like the domain name provided to me by github which I use for this blog into IP address. Long story short, without DNS you would have to type the IP address associated to every website you are about to visit, while the DNS job is to simply translate the human readable domain name into IP address, and I can't imagine the internet existance without DNS as not every website and/or service are served by static IP.

Every device that is connected to internet is using at least 1 DNS name server that would resolve every single query. Here is the catch, all queries will have to be resolved (dns lookup), no matter even if the particular website and/or service was already resolved.

What we are going to do now is to locally cache those DNS requests with **dnsmasq** and speed up our internet browsing.

Install `dnsmasq` and `dnsutils`.

Open up `/etc/resolv.conf` and add 3 name servers:

```dns
nameserver 127.0.0.1
nameserver 208.67.220.220 # OpenDNS
nameserver 208.67.220.222 # OpenDNS
```

You can replace the OpenDNS name servers with others that are recommended by the PRISM Break project, located [here](http://wiki.opennicproject.org/Tier2), choose 2 servers that are closer to your country and pay attention if it is mentioned that there is no logging for the particular servers.

I use **netctl** to manage my network connection, if you use the NetworkManager program, you should visit the [Archlinux](https://wiki.archlinux.org/index.php/Dnsmasq#NetworkManager) page, or the [Ubuntu](https://help.ubuntu.com/community/Dnsmasq) page for more details.

Now open up `/etc/dnsmasq.conf` and add:

```dns
interface=eth0
listen-address=127.0.0.1
bind-interfaces
bogus-priv
domain-needed
domain=example.com
expand-hosts
local=/example.com/
dns-forward-max=150
cache-size=2000
```

What these options do:

'interface' the network interface card

'listen-address' the IP address to listen for queries

'bind-interfaces' will make sure that 'listen-address' will listen for queries made by the ip assigned to it

'bogus-priv' will prevent non-routed address to be forwarded

'domain-needed' will block plain domain names (github instead github.com)

'domain=example.com' and 'expand-hosts' - use some fake domain name to satisfy the **fully qualified domain name**, if you ever tried to install OpenBSD or FreeBSD you'll understand the FQDN importance

'dns-forward-max' the maximum concurrent queries, even if you (ever) become 'zombie', that limit will save your ass and the police won't knock on your door.

'cache-size' it does what it says

Now restart your network manager. For **netctl** type `netctl restart profile` where 'profile' is your configuration file in /etc/netctl/ . For **NetworkManager** type `systemctl restart NetworkManager` .

Automatically start dnsmasq upon system start up `systemctl enable dnsmasq`, and start it now `systemctl start dnsmasq`

Almost done, just perform 2 queries to verify that the caching is working: `dig youtube.com | grep 'Query time'`, on the second (and every next) query you should see 0 msec. From now on the cached queries will be stored in your RAM.

The first 'nameserver' in `/etc/resolv.conf` - **127.0.0.1** will try to resolve all queries if they are cached, and if they are not present in the cache the rest 'nameservers' will be requested. That is why we need **127.0.0.1** to be the first 'nameserver'.

If you are seeking even greater DNS security, you should consider [DNSSEC](https://en.wikipedia.org/wiki/DNSSEC), DNSCrypt is part of OpenDNS and OpenDNS is not listed in PRISM Break.

To add DNSSEC in your current dnsmasq configuration, open up `/etc/dnsmasq.conf` and add:

```dns
dnssec
trust-anchor=.,19036,8,2,49AAC11D7B6F6446702E54A1607371607A1A41855200FD2CE1CDDE32F24E8FB5
dnssec-check-unsigned
```

Forgot to mention that you should comment in the **DNS=('IP')** line in your netctl profile, otherwise `/etc/resolv.conf` will be overwritten.
