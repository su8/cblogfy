
---

Scenario: You want proxy server to filter the traffic on some of the ip(s) that are on your network, and/or you got children at home and do not want them to access some websites.

![](img/file/1misc/squid-proxy.jpg)

As usual the very fist thing to do will be:

```bash
apt-get update
```

Keep in mind that different distributions are using older and newer versions of squid, recommend you to check out what version has your repository.

```bash
apt-get install squid3
```

At the end of each line press enter:

```bash
sed -i -e "/TAG: visible_hostname/,/^#[ ]*visible_hostname/{/#[ ]*visible_hostname/a\\ 
visible_hostname ${HOSTNAME} 
;}" "/etc/squid3/squid.conf" 
```

``` 
 LAN_RANGE="192.168.10.3" 
 LAN_ALIAS="my-local-network" 
```

Edit and replace 192.168.10.3 ip with your server internal ip.

```bash
sed -i -e "0,/INSERT YOUR OWN RULE(S) HERE/{//a\\ 
\\  
# Allowing Local network allowed-lan-${LAN_ALIAS}.\\  
acl allowed-lan-${LAN_ALIAS} src ${LAN_RANGE}\\  
http_access allow allowed-lan-${LAN_ALIAS}  
;}" '/etc/squid3/squid.conf'  
```

The next thing that you will have to consider is do you want to allow or deny http access (browsing websites).

```bash
sed -i -e 's/^http_access deny all/http_access allow all/' \  
'/etc/squid3/squid.conf'  
```

Which websites do you want to blacklist/ban ? Take your time, in the meantime see the following example example where I will blacklist/ban all subdomains that are owned by .foo.com

```bash
nano /etc/squid3/squid.conf  
acl yuck dstdomain .foo.com  
http_access deny yuck  
```

If you ever want to allow some ip(s) to access internet, then edit the squid.conf file and add that:

```
acl allowed-lan-my-local-network src 192.168.10.24
acl allowed-lan-my-local-network src 192.168.10.25
acl allowed-lan-my-local-network src 192.168.10.26
acl allowed-lan-my-local-network src 192.168.10.27
acl allowed-lan-my-local-network src 192.168.10.28
acl allowed-lan-my-local-network src 192.168.10.29
```

Those ip(s) are just for demonstration, replace them with yours.

Restart the squid via:

```/etc/init.d/squid3 reload```

Now open up your browser and navigate to the **Connection settings**, click on manual proxy and enter the server internal ip with port 3128. Alternavely purchase few network cards and place them in the squid server, configure them to route/bridge all the traffic to the computers that will be attached. Read more about squids ACL (access control list) <a href="http://wiki.squid-cache.org/SquidFaq/SquidAcl" target="_blank">here</a>
