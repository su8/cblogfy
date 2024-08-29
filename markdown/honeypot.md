
---

Set up a simple ssh honeypot in a virtual environment to learn and explore what's going on your network and who wants to "hack" you. Kippo is a simple SSH honeypot written in Python that will fool the "hacker" that he has real  access to your real system.

```bash
apt-get update
```

```bash
apt-get install openssh-server openssh-client
```

Change the current port on your SSH to something like 2222, because we will set Kippo to listen port 22

```bash
nano /etc/ssh/sshd_config
```

Change the port 22 to any other number you like, for my virtual honeypot I use 2222. Then restart the ssh server:

```bash
/etc/init.d/ssh restart
```

Let's install the necessary tools which kippo will be using

```bash
apt-get install python-dev openssl python-openssl python-pyasn1 python-twisted subversion authbind
```

Since the honeypot Kippo will be running on port 22 this is going to be an issue, because only the root is allowed to use ports that are in range 1 - 1024, here authbind will help you to solve this port issue - authbind will bind sockets to privileged ports without root, also authbind allows a program which does not or should not run as root to bind to low-numbered ports in a controlled way. You will have to create a new user and add it to the users that can use "sudo", because kippo cannot be started as root. 

```bash
adduser kippo sudo
```

The username is just example, replace it with whatever you want.

Bind the port 22

```bash
touch /etc/authbind/byport/22
chown kippo:kippo /etc/authbind/byport/22
chmod 755 /etc/authbind/byport/22
```

It came the time to download the Kippo

```bash
svn checkout http://kippo.googlecode.com/svn/trunk/ ./kippo
```

Enter in the kippo directory

```bash
cd kippo
```

Now rename the following file and change the port 2222 to 22, don't use any other number ! 

```bash
mv kippo.cfg.dist kippo.cfg
nano kippo.cfg
```

Once you changed the port, scroll down few rows with your keyboard arrow keys, find **hostname** and name it like distribution name, I am using "FedoraHardenedServer".. nice name for a Debian server ;D

![](img/file/kippo/kippoportandhostname.png)

Want to fool the hacker again that he attempts to enter in legitimate server, you will place some text that will be shown before the log-in attempt. While you are in the kippo.cfg file, press CTRL+W to find the word **banner**, once you find it uncomment the **banner_file =** and make it to look like **banner_file = b.txt**, save and exit from that file.

![](img/file/kippo/banner.png)

Create that b.txt file and type whatever message you want

```bash
nano b.txt
```

Checkout what's mine:

![](img/file/kippo/bannertext.png)

Now you have to edit someting else:

```bash
nano start.sh
```

Add the following thig as is without changing anything else !

```bash
authbind --deep twistd -y kippo.tac -l log/kippo.log --pidfile kippo.pid
```

Save the file and do:

```bash
cd ..
chown -R kippo kippo
mv kippo /home/kippo
```

Now you will install mysql server to log everything that happens in kippo - even nmap scannings will be logged

```bash
apt-get install python-mysqldb phpmyadmin mysql-server
```

Take your time and decide what password you want to use.

Once you answered to all MySQL questions you will have to create new database `mysql -u root -p`

```sql
CREATE DATABASE kippo;
GRANT ALL ON kippo.* TO 'kippo'@'localhost' IDENTIFIED BY 'Kippo-DB-pass';
exit
```

Go back to the kippo directory and edit the kippo.cfg file to add the new configuration which we tell on kippo to log everything in the MySQL database:

```bash
cd /home/kippo/kippo
nano kippo.cfg
```

Press CTRL+W and find **database_mysql**, take a look what looks like my configuration, then adjust it to yours.

![](img/file/kippo/kippomysql.png)

Log out from the root, and log-in as your kippo user and do that:

```bash
cd kippo
sh start.sh
```

You are done, just in case you want to access your MySQL database from other local computer you must to grant privileges to it's ip and username. Again, you can access your MySQL database and read everything via phpadmin from your browser, but I am using application called DBeaver that is connected directly to the database. Anyway, if you want to use some  universal database tool like DBeaver or other program then log-in as root and do:

```sql
mysql -u root -p
use mysql
GRANT ALL ON *.* to root@'192.168.10.4' IDENTIFIED BY 'your MySQL password'; 
exit
```

Change 192.168.10.4 according to your remote machine ip. If it's dynamic then better set it to static, otherwise you will have to grant always privileges to the newer ip. Restart the MySQL server and you are done.

```bash
service mysql restart
```

Keep an eye on the tables for any activity, then examine and learn what,how and why they do this.

![](img/file/kippo/dbeaver.png)
