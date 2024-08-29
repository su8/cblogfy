
---

Denial of service (Dos) prevention should be one of the first things that you should do once a new operating system is installed.

If you have a server iptables is the way to go, if you want to prevent DoS on your desktop then ufw will ease the whole process.

Let's begin with small ufw configuration for your desktop pc.

Edit `/etc/ufw/sysctl.conf`

```bash
net/ipv4/icmp_echo_ignore_broadcast=1
net/ipv4/icmp_ignore_bogus_error_responses=1
net/ipv4/icmp_echo_ignore_all=1
net/ipv4/default/accept_redirects=0
net/ipv4/all/accept_redirects=0
net/ipv4/tcp_syncookies=1
net/ipv4/conf/default/log_martians=1
net/ipv4/conf/all/log_martians=1
net/ipv4/conf/default/send_redirects=0
net/ipv4/conf/all/send_redirects=0
net/ipv4/conf/all/accept_source_route=0
net/ipv4/conf/default/accept_source_route=0
net/ipv4/conf/default/rp_filter=1
net/ipv4/conf/all/rp_filter=1
```

Restart ufw with `ufw disable` and then `ufw enable`, now go to [ShieldsUP](https://www.grc.com/x/ne.dll?bh0bkyd2), click proceed on some of the buttons and look for **All Service Ports**, click it and wait till they scan your ports and you should pass the test with **"TruStealth"** rating.

Moving to iptable rules configuration for your server. I use the same configuration for my centos OwnCloud server, save it as **fw.sh** and then configure the NIC to match yours, mine is `eth0` yours could be different

```bash
#!/bin/bash
/sbin/iptables -F
/sbin/iptables -X
/sbin/iptables -t nat -F
/sbin/iptables -t nat -X
/sbin/iptables -t mangle -F
/sbin/iptables -t mangle -X
modprobe ip_conntrack 
NIC="eth0"  
/sbin/iptables -A INPUT -i lo -j ACCEPT
/sbin/iptables -A OUTPUT -o lo -j ACCEPT
/sbin/iptables -P INPUT DROP
/sbin/iptables -P OUTPUT DROP
/sbin/iptables -P FORWARD DROP 
/sbin/iptables -A INPUT -i ${NIC} -p tcp ! --syn -m state --state NEW  -m limit --limit 5/m --limit-burst 7 -j LOG --log-level 4 --log-prefix "Drop Syn" 
/sbin/iptables -A INPUT -i ${NIC} -p tcp ! --syn -m state --state NEW -j DROP
/sbin/iptables -A INPUT -i ${NIC} -f  -m limit --limit 5/m --limit-burst 7 -j LOG --log-level 4 --log-prefix "Fragments Packets"
/sbin/iptables -A INPUT -i ${NIC} -f -j DROP  
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags ALL ALL -j DROP 
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags ALL NONE -m limit --limit 5/m --limit-burst 7 -j LOG --log-level 4 --log-prefix "NULL Packets"
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags ALL NONE -j DROP
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags SYN,RST SYN,RST -j DROP 
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags SYN,FIN SYN,FIN -m limit --limit 5/m --limit-burst 7 -j LOG --log-level 4 --log-prefix "XMAS Packets"
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags FIN,ACK FIN -m limit --limit 5/m --limit-burst 7 -j LOG --log-level 4 --log-prefix "Fin Packets Scan"
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags FIN,ACK FIN -j DROP
/sbin/iptables  -A INPUT -i ${NIC} -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP  
/sbin/iptables -A INPUT -i ${NIC} -m state --state ESTABLISHED,RELATED -j ACCEPT
/sbin/iptables -A OUTPUT -o ${NIC} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT 
/sbin/iptables -A INPUT -p tcp --destination-port 22 -j REJECT
/sbin/iptables -A OUTPUT -p tcp --sport 22 -j REJECT
# Whenever you change the ssh port make sure to uncomment the line below and change the port
# iptables -I INPUT 4 -p tcp -d 192.168.10.30 --dport 3789 -j ACCEPT
# If you only need remote access from one IP address (say from work to your home server), then consider filtering connections at your firewall by either adding a firewall rule on your router or in iptables to limit access on port 3789 to only that specific IP address. For example, in iptables this could be achieved with the following type of rule:
iptables -A INPUT -p tcp -s 72.232.194.162 --dport 3789 -j ACCEPT 
/sbin/iptables -A INPUT -p icmp --icmp-type 8 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
/sbin/iptables -A OUTPUT -p icmp --icmp-type 0 -m state --state ESTABLISHED,RELATED -j ACCEPT 
/sbin/iptables -A INPUT -p tcp -i ${NIC} --dport 137:139 -j REJECT
/sbin/iptables -A INPUT -p udp -i ${NIC} --dport 137:139 -j REJECT 
/sbin/iptables -A INPUT -j LOG
/sbin/iptables -A FORWARD -j LOG
/sbin/iptables -A INPUT -j DROP
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_broadcasts
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 64000 > /proc/sys/net/ipv4/ipfrag_high_thresh
echo 48000 > /proc/sys/net/ipv4/ipfrag_low_thresh 
echo 10 > /proc/sys/net/ipv4/ipfrag_time 
echo 5 > /proc/sys/net/ipv4/icmp_ratelimit
echo 1 > /proc/sys/net/ipv4/tcp_syncookies
echo 0 > /proc/sys/net/ipv4/conf/eth0/accept_source_route
echo 0 > /proc/sys/net/ipv4/conf/eth0/accept_redirects 
echo 1 > /proc/sys/net/ipv4/conf/eth0/log_martians 
echo 10 > /proc/sys/net/ipv4/neigh/eth0/locktime
echo 0 > /proc/sys/net/ipv4/conf/eth0/proxy_arp
echo 50 > /proc/sys/net/ipv4/neigh/eth0/gc_stale_time
echo 0 > /proc/sys/net/ipv4/conf/eth0/send_redirects
echo 0 > /proc/sys/net/ipv4/conf/eth0/secure_redirects
echo 1 > /proc/sys/net/ipv4/icmp_ignore_bogus_error_responses
echo 5 > /proc/sys/net/ipv4/igmp_max_memberships
echo 2 > /proc/sys/net/ipv4/igmp_max_msf
echo 1024 > /proc/sys/net/ipv4/tcp_max_orphans
echo 2 > /proc/sys/net/ipv4/tcp_syn_retries
echo 2 > /proc/sys/net/ipv4/tcp_synack_retries
echo 1 > /proc/sys/net/ipv4/tcp_abort_on_overflow
echo 10 > /proc/sys/net/ipv4/tcp_fin_timeout
echo 0 > /proc/sys/net/ipv4/route/redirect_number
echo 1 > /proc/sys/net/ipv4/conf/all/rp_filter
echo 1 > /proc/sys/net/ipv4/conf/eth0/rp_filter
echo 0 > /proc/sys/net/ipv4/conf/all/accept_source_route
echo 61 > /proc/sys/net/ipv4/ip_default_ttl
echo "1800" > /proc/sys/net/ipv4/tcp_keepalive_time
echo "0" > /proc/sys/net/ipv4/tcp_window_scaling
echo "0" > /proc/sys/net/ipv4/tcp_sack
echo 4096 87380 4194304 >/proc/sys/net/ipv4/tcp_rmem
echo 4096 87380 4194304 >/proc/sys/net/ipv4/tcp_wmem
echo 1 > /proc/sys/net/ipv4/tcp_ecn
echo "30000 60000" > /proc/sys/net/ipv4/ip_local_port_range 
service iptables save
service iptables restart
exit 0
```

These iptables rules are really powerful and I won't recommend you to use them for your desktop pc as they will limit a lot of your applications that you use on daily basis.

If you try to ping the server it will show 100% packet loss which means it drops ping requests.

Even if you have open ports, by scanning the server with nmap they will be shown as **closed**, don't believe me ?

Replace 192.168.10.30 with your server internal ip:

```bash
nmap -sV -O -PN 192.168.10.30
```
