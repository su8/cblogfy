
---

Dead simple replacement for the python's `SimpleHTTPServer` module, based on the [following](https://github.com/Duncaen/dotfiles/blob/master/bin/nginx-here) script.

```nginx
# nginxserve [DIR] [PORT] - serve current directory (or DIR) on PORT (or 8080)
nginxserve() {
  DIR=$(realpath ${1:-.})
  PORT=${2:-8080}

  mkdir -p /tmp/.nginx-here.$$
  cat >/tmp/.nginx-here.$$/cfg <<EOF
worker_processes 1;
error_log "/dev/stdout";
daemon off;
pid "/tmp/.nginx-here.$$/pid";
events {
  worker_connections 1024;
}

http {
  access_log "/dev/stdout";
  client_body_temp_path "/tmp/.nginx-here.$$";
  scgi_cache off;
  scgi_temp_path "/tmp/.nginx-here.$$";
  uwsgi_cache off;
  uwsgi_temp_path "/tmp/.nginx-here.$$";
  fastcgi_cache off;
  #fastcgi_cache_path "/tmp/.nginx-here.$$" 1;
  fastcgi_temp_path "/tmp/.nginx-here.$$";
  proxy_temp_path "/tmp/.nginx-here.$$";

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  gzip on;
  # only if build --with-http_gzip_static_module
  # gzip_static on;
  gzip_comp_level 3;
  gzip_types application/javascript application/json application/vnd.ms-fontobject application/x-font-ttf image/svg+xml text/css text/plain text/xml;
  server_tokens off;

  add_header    X-Content-Type-Options nosniff;
  add_header    X-Frame-Options DENY;
  add_header    X-XSS-Protection "1; mode=block";

  server {
    listen $PORT;

    location / {
      root "$DIR";
      autoindex on;
      index index.html index.htm;
    }
  }
}
EOF
  nginx -p /tmp/.nginx-here.$$ -c cfg
  rm -rf /tmp/.nginx-here.$$
}
```
