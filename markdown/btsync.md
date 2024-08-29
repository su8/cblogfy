
---

Bittorrent Sync is P2P file synchronization tool that encrypts your data with AES-128 key.

If you are paranoid about security, BtSync is the most secure program that let's you to share files with other devices or computers locally.

The installation is really **difficult**, lol.

Download the BtSync archive and extract the archive.

```bash
cd ~
mkdir -p sync-folder

For 32-bit server:
wget btsync.s3-website-us-east-1.amazonaws.com/btsync_i386.tar.gz

For 64-bit server:
wget btsync.s3-website-us-east-1.amazonaws.com/btsync_x64.tar.gz

For raspberry pi:
wget btsync.s3-website-us-east-1.amazonaws.com/btsync_arm.tar.gz

tar -zxvf btsync_i386.tar.gz  # for 32-bit server
```

Start BtSync.

```$ ./btsync```

Open up port 8888

```bash
iptables -I INPUT 4 -p tcp -d 10.10.10.1 --dport 8888 -j ACCEPT
service iptables save
service iptables restart
```

Go ahead, open up your browser and point your internal ip followed by port 8888.
http://10.10.10.1:8888

![](img/file/btsync/btsync-first-run.png)

![](img/file/btsync/btsync-started.png)

![](img/file/btsync/btsync-add-folder.png)

I'll show you how to sync your android device folder(s) with the server. First get the android BtSync application [https://play.google.com/store/apps/details?id=com.bittorrent.sync](https://play.google.com/store/apps/details?id=com.bittorrent.sync). Install the app and generate qrcode.

![](img/file/btsync/btsync-sharing.png)

![](img/file/btsync/btsync-qrcode.png)

Open up the android BtSync application, choose which folder(s) you would like to sync, scan the qrcode with your rear camera and have fun.

![](img/file/btsync/btsync-android.png)

![](img/file/btsync/btsync-android-ready.png)

Our data compression post has been visited from more than 2000 people, so in our next post we will compare image compression tools.
