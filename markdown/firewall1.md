
---

Although most linux OSs comes as **batteries included** (*Pythonic pun for saying
"enough to start out of" *), its hardly useful if not configured properly. A firewall
is one of the first steps to take when securing any operating system, and among many
available options, one of the oldest and most used is **iptables**. Part of the
[Netfilter Project][1], it was one of the first kernel-level firewalls. It's very
much scriptable and strict, but usable for everyone either by commandline or by 
using a number of GUIs and frontends available, also, the IPv6 version of iptables is
called **ip6tables**.

Being a standard firewall included in most linux distros (although a modern variant
called *nftables* is supposed to replace it), it is actually a command-line front-end
for the netfilter hooks that examines and matches each packet as it crosses the linux
network stack, against a set of rules. Usually all of the current (3.12+) kernels are
compiled with iptables support, so you only need to install the userland utilitites to
get started.

###Installation#

The official version may have a dependency for the package *iproute2*, so install it if
not done automatically by your package manager. (Assuming you have a debian or
debian-based system.)

```bash
sudo apt-get install iptables
```

The current configuration of iptables can be seen by the command below

```bash
sudo iptables -nvL;
```

###Start the service#

Now, if your OS already uses Systemd, starting iptables is a breeze, just type

```bash
sudo systemctl start iptables;
```

Otherwise, the method to start iptables after the network stack is initiated is like
below, first you setup your configuration (we'll be working with the default for now),
then write it in a file, and just read that file everytime the network stack is
initiated. The best method is to write (or download) an *initscript* for the service,
however, an easier way of configuration could be like below..

First, write the configuration (default, at the moment) to a file..

```bash
sudo bash -c 'iptables-save > /etc/network/iptables.rules';
```

Load and test the current  firewall config

```bash
sudo iptables-restore < /etc/network/iptables.rules;
```

Now set it up to be loaded everytime before network starts, create a file at 
`/etc/network/if-pre-up.d/firewall` with the content

```bash
#!/bin/sh  
/sbin/iptables-restore < /etc/network/iptables.rules
```

Make it executable

```bash
sudo chmod +x /etc/network/if-pre-up.d/firewall;
```

Now reboot and after that test the configuration once again to see if it matches with
your needs.

[1]: http://en.wikipedia.org/wiki/Netfilter

Sample configuration (file located at `/etc/network/iptables.rules`)

	#(this is no way usable for production, but is a good starting point)
	*filter
	
	#default policies chains
	:INPUT DROP [0:0]
	:FORWARD DROP [0:0]
	:OUTPUT ACCEPT [0:0]
	:IN_SSH - [0:0]
	:LOGGING - [0:0]
	
	#loopback allowed
	-A INPUT -i lo -j ACCEPT
	
	#invalid packets dropped
	-A INPUT   -m state --state INVALID -j DROP
	-A FORWARD -m state --state INVALID -j DROP
	-A OUTPUT  -m state --state INVALID -j DROP
	
	#ping allowed
	-A INPUT -p icmp --icmp-type 8 -j ACCEPT
	
	#connections already established allowed
	#be careful to set this, otherwise you will be locked out when reloading the firewall
	-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
	-A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
	
	#ssh chain with limit
	-A INPUT -p tcp --dport ssh -m conntrack --ctstate NEW -j IN_SSH
	-A IN_SSH -m recent --name sshbf --rttl --update --hitcount 5 --seconds 20 -j DROP
	-A IN_SSH -m recent --name sshbf --rttl --update --hitcount 10 --seconds 1800 -j DROP
	-A IN_SSH -m recent --name sshbf --set -j ACCEPT
	
	#dns
	-A INPUT -p tcp -m tcp --dport 53 -j ACCEPT
	-A INPUT -p udp --dport 53 -j ACCEPT
	
	#http(s)
	-A INPUT -p tcp -m tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
	-A INPUT -p tcp -m tcp --dport 8080 -m state --state NEW,ESTABLISHED -j ACCEPT
	-A INPUT -p tcp -m tcp --dport 8081 -m state --state NEW,ESTABLISHED -j ACCEPT
	-A INPUT -p tcp -m tcp --dport 443 -m state --state NEW,ESTABLISHED -j ACCEPT
	
	#linux compliance
	#-A INPUT -p udp -j REJECT --reject-with icmp-port-unreachable;
	#-A INPUT -p tcp -j REJECT --reject-with tcp-rst;
	

	#drop logged
	-A INPUT -j LOGGING
	-A LOGGING -m limit --limit 2/min -j LOG --log-prefix "IPTables Packet Dropped: " --log-level 6
	-A LOGGING -j DROP
	
	#drop everything else
	-A INPUT -j DROP
	-A FORWARD -j DROP

	COMMIT
