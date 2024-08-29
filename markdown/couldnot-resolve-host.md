
---

So you just did a brand new installation or re-installation of CentOS and tried to update the distro via  `yum update`, but faced **"Couldn't resolve host 'mirrorlist.centos.org'" Error: Cannot find a valid baseurl for repo: base** Let's find how to fix it.

Making sure that all network interfaces are up and runnig

```bash
ifconfig
ping google.com
```

What is telling you the ping - uknown host ? How many NICs do you see from the **ifconfigi** output? I see just one **lo**. Let's edit the eth0 and make it up and running.

```bash
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

Make sure to change **ONBOOT=no** to **ONBOOT=yes** , edit another file to add your gateway:

```bash
vi /etc/sysconfig/network
```

Add on the bottom: **GATEWAY=192.168.10.30** , replace the ip with yours. Last file to edit - the dns resolver:

```bash
vi /etc/resolv.conf
```

and add google public dns server IP

```bash
nameserver 8.8.8.8
nameserver 8.8.4.4
```

Almost done, just restart the network and everything will be up and running after few seconds: 

```bash
service network restart
```
