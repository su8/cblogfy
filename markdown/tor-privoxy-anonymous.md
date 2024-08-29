
---

From the previous post you learned how to filter web browsing traffic. Right now you will learn how to bypass such restrictions without using any VPN. You might live in China where everything is filtered and restricted and want to bypass these restrictions in the name of slightly slower internet speed. I assume that you already have some Debian distro up and running, so let's jump in the terminal. 

![](img/file/tor_privoxy/tor-and-privoxy.jpg)

```bash
sh -c 'command apt-get -y install lsb-release gnupg;
DEBIAN_VERSION=$(command lsb_release -cs);
echo "# TOR for ${DEBIAN_VERSION}
deb http://deb.torproject.org/torproject.org ${DEBIAN_VERSION} main" \
"/etc/apt/sources.list.d/torproject.list";
gpg --keyserver keys.gnupg.net --recv 886DDD89;
gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | command apt-key add -;
apt-get update;
apt-get -y install privoxy tor;
echo "forward-socks4a / localhost:9050 ." >> "/etc/privoxy/config";
sed -i -e "s/^\(listen-address[ \t]*\)[^:]*/\1/" "/etc/privoxy/config";
sed -i -e "s/^\(debug[ \t]*.*\)/#\1/" "/etc/privoxy/config";
/etc/init.d/privoxy restart'
```

Will show you an image instead adding symbols where to press **enter**.

![](img/file/tor_privoxy/torwithprivoxy.jpg)

Sit back and relax while the installation and configuration for everything is done automatically for you. After that open up your browser and go to the network settings, there point your server inetrnal IP followed by port 8118. From now on, all traffic will be routed outside of your ISP, also your real ip will be changed while you are using the Tor network.
