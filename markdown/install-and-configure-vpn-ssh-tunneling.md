
---

Scenario: You are at work or other place where you have no ( or restricted ) access to the internet. Some of the ports in that network are filtered or for your personal security you want to encrypt all the traffic. Here comes the VPN, the easiest solution for deploying a personal vpn in your home will be OpenVPN. "Let's get it started"

![vpn](img/file/vpn_network/vpn-network-and-ssh-tunneling.jpg)

![](img/file/vpn_network/vpn-network-and-ssh-tunneling2.jpg)

```bash
apt-get update
```

Install the OpenVPN package from Debian repository:

```bash
apt-get install openvpn
```

Install and SSH

```bash
apt-get install openssh-server
```

Once it has finished the downloading process, OpenVPN will configure everything automatically for you - the access for the graphical interfaces from where you can edit almost anything, it will be accessible via calling your server local ip in the browser, also OpenVPN will install SSL/TLS certificate for you, but will show you how to change that certificate for other internal ip or renewing the expired certificate that you had.

The very first thing that you will have to do is giving the openvpn user a password.

```bash
passwd openvpn
```

Type whatever password you want - twice.
See what is the server internal ip

```bash
ifconfig
```

Now let's find out and explore more about it in the browser. Open up your browser, type https:// , then insert the internal ip of your server. It will ask you for username where you will have to enter "openvpn" - without quotes, and the password that you have chosen. After that you will see that there is already a software and .ovpn certificate (Yourself, user-locked file) for downloading, at this stage don't download anything. If you press the "admin" button it will redirect you to a new page that is asking you again for openvpn username and password. If you log-in there, you will be able to edit almost anything about your OpenVPN based server. The most important is replacing the default SSL/TLS certificate that comes pre-installed and changing one thing called protocol, but we will cover that later.

There are 2 ways with which you will be able to access to your OpenVPN server from your gnu/linux computer and that is with ssh or opevnpn client. If you choose the SSH, must tell you that there is two ways again - easy and hard.

Let me demonstrate you the easiest way first:

![easiest way](img/file/1misc/changetotcp.png)

You just have to open up your browser and navigate to your OpenVPN server iternal IP, log-in as openvpn user, click to Sever Network Settings and set the "protocol" to **tcp**.

Demonstration of the hardest way to achieve this:

```bash 
nano /etc/openvpn/server.conf
```

Change the line proto udp to **proto tcp** . Save it and edit another file that is in the same directory:

```bash 
nano client.conf
```

Change the line proto udp to **proto tcp-client**

You will have to edit the ssh configuration file in your server.

```bash 
nano /etc/ssh/sshd_config
```

There you will have to change "PermitRootLogin no" to: **PermitRootLogin yes**

Make sure that the following things are configured in the same way:

```bash
PasswordAuthentication yes
PermitEmptyPasswords no
```

Save and exit from the sshd_config file.

While you are typing commands in the server, check out what is the server `hostname`.

Remember it or write it somewhere - this was NOT a joke.

Allow traffic to the server ports

```bash
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 1194 -j ACCEPT
```

In case you use ufw to manage your firewall ports, then do that:

```bash
ufw allow 22/tcp
ufw allow 1194/tcp
```

Now restart the ssh server:

```bash
service ssh restart
```

The OpenVPN and SSH configurations are done, now you will install (just in case it is not installed by default) SSH client for your distro ( I assume that you are using Debian distro ). 

```bash
apt-get install openssh-client
```

Open up your terminal and attemp to connect to the OpenVPN server.

```bash
ssh root@192.168.10.11 -L 1194:debian:1194
```

Describing it for better understaning. root@192.168.10.11 stands for your server root username, 192.168.10.11 MUST be replaced with your server internal ip (if you try to access it from remote place use your server external ip). The -L stands for "[bind_address:]port:host:hostport]" in English, we are telling on our distro to open the port 1194 on our computer and attemp to connect to the following hostname "debian" and open up the remote machine (your OpenVPN server) the 1194 port. 

It will ask you for the server root password, enter it and you are in. Now let's check in your OpenVPN server that you are actually in.

```bash
ss -untap | grep 192.168.10.12
```

Replace 192.168.10.12 with your remote ip, not the server one. Look for "ESTABLISHED".

Let's find out now what is the second way which will allow you access to your server from a remote place. The first thing that you will have to do is installing "openvpn" in your remote computer ( I assume that you are using Debian distro ). 

```bash
apt-get isntall openvpn
```

Next is downloading the .ovpn certificate from your server - scroll above few rows to find how you can obtain it.

Once you have it on your computer make a copy and give it a name of MyOpenVPNserver-remote.ovpn , next edit the file and replace your internal server ip with your server external ip - I assume that your ISP has given you only one IP that is used by all computer in your home. There are many websites which allows you to see what is the external ip - e.g 'whatismyip'.

Decide which certificate you want to use, if you are in home then the first one, otherwise MyOpenVPNserver-remote.ovpn . Now in your desktop computer terminal type: `ifconfig`

Notice how many interfaces you have. Now type that:

```bash
openvpn --config config.ovpn
```

Here you will be asked **Enter Auth username:** where you insert **openvpn** after that it will ask you for the **openvpn** user password that you set earlier.

Wait around one minute and once the connection is established DON'T close that terminal !

Succeful connection should have the following message in that terminal: **Initialization Sequence Completed**

Open up another terminal and type again:

```bash
ifconfig
```

Do you see the new interface that has been added, it is called **tun** and has some number after it's name ? 

Done, got connection to your OpenVPN server. Let's talk about how to create new certificate for your server, just in case it has expired or you changed the server internal ip. In your server type the following things:

```bash
openssl genrsa -des -out server.key
cp server.key server.key.org 
openssl rsa -in server.key.org
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
```

Converting to pem which OpenVPN will be using.

```bash
openssl x509 -in server.crt -out server.der -outform DER
openssl x509 -in server.der -inform DER -out server.pem -outform PEM
```

I am using ftp client (filezilla) to transfer all these certificates from the OpenVPN server to my desktop to ease the work of certificate renewal, recommend you to do the same thing.

Navigate to the server internal ip with your browser: https://192.168.10.11/admin

Again to note you, replace 192.168.10.11 with your server internal ip. Log-in and find where is used the current certificate, then scroll to the bottom where you will see replacement instructions for each of the certificates. It should take you for first time around 10 minutes to assign everything in it's place.

That's the very basics of the SSH tunneling and VPNs, hope you enjoyed this long article.
