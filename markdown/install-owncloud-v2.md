
---

It's been a year since I posted owncloud installation in CentOS with Nginx and PostgreSQL.

In this post I'll focus in making the deployment easier by using Apache and MariaDB.

Let's begin with disabling the SELinux first.

```bash
vi /etc/sysconfing/selinux
SELINUX=disabled
```

Press the Escape button and then type `:wq` to save the changes and close the text editor. Now `reboot` the computer.

Add the MariaDB repository in order to replace the older and slower MySucksQueryLanguage err MySQL.

`vi /etc/yum.repos.d/MariaDB.repo`

```ini
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/5.5/centos6-x86
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
```

Update the repositories `yum update` and then install MariaDB client and server.

```bash
yum install MariaDB-client MariaDB-server
```

Start the MariaDB service and add it to system startup services with chkconfig.

```bash
service mysql start
chkconfig mysql on
```

Secure MariaDB

```bash
mysql_secure_installation
```

When asked **Y/n** type y to all questions. Restart the database:

```bash
service mysql restart
```

Install the following libraries in order to satisfy the OwnCloud requirements.

```bash
yum install wget php httpd php-curl php-mysql php-zip sqlite php-dom php-gd php-pdo php-mbstring php-xml php-json
```

Download the OwnCloud archive.

```bash
wget http://download.owncloud.org/community/owncloud-6.0.3.tar.bz2
```

Extract the archive, delete all content in /var/www/ and move the extracted content from owncloud archive there and 'chown' it.

```bash
tar xjf owncloud-6.0.3.tar.bz2
rm -rf /var/www/*
mv owncloud /var/www/
chown -R apache.apache /var/www/owncloud
chmod 755 /var/www/owncloud/config/
```

Edit the Apache configuration and add your server internal ip and/or domain name, add the owncloud path and AllowOverride.

```bash
vi /etc/httpd/conf/httpd.conf

# type /DocumentRoot to perform a search about the given string
DocumentRoot "/var/www/owncloud"
# Search for /ServerName,  it should be below "ServerAdmin root@localhost"
ServerName 10.10.10.105 # internal ip or domain name
# /AllowOverride
AllowOverride All
# Save and close the file
```

Start the Apache webserver and add it to system startup services with chkconfig.

```bash
service httpd start
chkconfig httpd on
```

Create new database.

```sql
mysql -u root -p
# enter the following content
create database clouddb;
grant all on clouddb.* to 'clouduser'@'localhost' identified by 'password';
flush privileges;
exit;
```

Allow incomming tcp connections to port 80, which is used to serve the owncloud page by Apache on this port.

```bash
iptables -I INPUT 4 -p tcp -d 10.10.10.105 --dport 80 -j ACCEPT
service iptables save
service iptables restart
```

Open up your favourite web browser and navigate to your internal server ip or domain name that you have specified in apache's configuration file earlier.

![](img/file/centos_owncloudv2/centos-owncloud-v2.png)

![](img/file/centos_owncloudv2/centos-owncloud-v2-2.png)

![](img/file/centos_owncloudv2/centos-owncloud-v2-3.png)

Here is my small intel dual core, 4GB, CentOS 6.5 server with OwnCloud and Bittorrent Sync installed.

Having that said, next post will cover Bittorrent Sync installation and management.

![](img/file/centos_owncloudv2/my-server.jpg)

![](img/file/centos_owncloudv2/my-server-2.jpg)

![](img/file/centos_owncloudv2/my-server-3.jpg)
