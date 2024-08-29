
---

I can do deploy this thing in my debian server for less than a 7 minutes, but RHEL made everything to be "secure", so in order to install some packages you have to seek external repositories. I don't think that 3rd party repositories are good idea to mess with, but it's red hat decision which packages they want to have. Since this CentOS server is meant to used as personal cloud storage, I decided that there is no need from xcache for caching, but it is up to you if you want caching for Few pages...

Download these 3rd party repos

```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
```

Edit these repositories and make sure that the top is **enabled=1**

```bash
nano /etc/yum.repos.d/epel.repo 
nano /etc/yum.repos.d/remi.repo
```

Since you will be using PostgreSQL you will have to remove the default installed mysql database, it's installed even in the minimal CentOS iso image.

```bash
yum remove mysql* mysql-server mysql-devel mysql-libs
yum update
```

Now install the following packages that you will be using in order to run ownCloud properly without issues.

```bash
yum install postgresql postgresql-libs postgresql-server php-fpm php-gd php-ldap php-pear php-xml php-xmlrpc php-magickwand php-magpierss php-mbstring php-mcrypt php-shout php-snmp php-soap php-tidy php-pgsql php-pdo 
```

Start the PostgreSQL.

```bash
service postgresql initdb 
service postgresql start
chkconfig postgresql on
```

Create new PostgreSQL user and database.

```sql
su - -c "psql" postgres

CREATE USER cloud WITH PASSWORD 'userpass'; 
CREATE DATABASE cloudbase OWNER cloud ENCODING 'UTF8'; 
GRANT ALL PRIVILEGES ON DATABASE cloudbase TO cloud;
```

If you don't know what is **php.ini** then you are not familiar with php at all.

```bash
nano /etc/php.ini
```

Find the following strings and edit the content after **=**, **max_filesize** is to determine the maximum size of single file that you or someone else will want to upload in your ownCloud server. 

```bash
post_max_size = 2G
cgi.fix_pathinfo = 0
upload_max_filesize = 2G
```

See what is your timezone:

```bash
cat /etc/sysconfig/clock
```

Then add it to php.ini, find the string **date.timezone**

```bash
nano /etc/php.ini

date.timezone = "America/New York"
```

Edit the following file to use unix socket instead of tcp.

```bash
nano /etc/php-fpm.d/www.conf

# Change the line:

;listen = 127.0.0.1:9000

# to:

listen = /var/run/php-fpm/php-fpm.sock
```

Start the php-fpm service

```bash
chkconfig php-fpm on 
service php-fpm start
```

Edit the postgresql config file to allow password logins:

```bash
nano /var/lib/pgsql/data/pg_hba.conf
```

Change the line:

```
IPv4 local connections: 
host all all 127.0.0.1/32 ident
```

to:

```
IPv4 local connections: 
host all all 127.0.0.1/32 password
```

Restart the postgresql database.

```bash
service postgresql restart
```

Install nginx.

```bash
yum install nginx
service nginx start 
chkconfig nginx on 
service nginx stop
```

If you are familiar with apache virtual hosts, then the next file that you will have to create is exactly that.

```bash
nano /etc/nginx/conf.d/cloud.conf
```

Add the following configuration there:

```nginx
server {
listen 80;
server_name 192.168.10.30; #replace with your internal ip or domain name
return 301 https://$server_name$request_uri;
}
server {
listen 443 ssl;
server_name 192.168.10.30; #replace with your internal ip or domain name
ssl_certificate /etc/nginx/cert/server.crt;
ssl_certificate_key /etc/nginx/cert/server.key;
root /var/www/owncloud;
index index.php;
client_max_body_size 2G;
fastcgi_buffers 64 4K;
rewrite ^/webdav(.*)$ /remote.php/webdav$1 redirect;
error_page 403 = /core/templates/403.php;
error_page 404 = /core/templates/404.php;
location = /robots.txt {
allow all;
log_not_found off;
access_log off;
}
location / {
rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
rewrite ^/.well-known/host-meta.json /public.php?service=host-json last;
rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;
try_files $uri $uri/ index.php;
}
location @webdav {
fastcgi_split_path_info ^(.+\.php)(/.*)$;
fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
fastcgi_param HTTPS on;
include  fastcgi_params;
}
location ~ ^(.+?\.php)(/.*)?$ {
try_files $1 = 404;
fastcgi_param PATH_INFO $2;
fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
fastcgi_param HTTPS on;
include  fastcgi_params;
}
}
```

As you specified in the nginx "virtual host" above, your ownCloud server will be using SSL, so let's create these certificates, shall we ?

```bash
mkdir -p /etc/nginx/cert/ 

cd /etc/nginx/certs/ 

openssl genrsa -des3 -out server.key 2048 

openssl req -new -key server.key -out server.csr 

cp server.key server.key.org 

openssl rsa -in server.key.org -out server.key 

openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt

service nginx start
```

Next, download, uncompress and set permissions for the owncloud.

```bash
cd /var/www
wget http://download.owncloud.org/community/owncloud-5.0.7.tar.bz2 
tar xjf owncloud 
mkdir -p owncloud/data 
chmod 755 owncloud/data 
chown -R root:apache owncloud
rm -rf owncloud-5.0.7.tar.bz2
```

Allow incomming tcp connections to your server ports: 80 and 443. If you or someone else call your server internal ip it will be redirected to https://yourserverinternalip, because you specified that in the nginx "virtual host" earlier.

```bash
iptables -I INPUT 4 -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 4 -p tcp --dport 443 -j ACCEPT  
service iptables save 
service iptables restart
```

That's all, open up your browser and point your server ip. Choose whatever log-in name and password you like.

![](img/file/1misc/centos-owncloud.png)
