
---

Query GitHub and number all unread notifications, can be combined to i3, conky or other programs.

Replace the text within the variable **TOKEN** with your [own token](https://github.com/settings/tokens/new?scopes=notifications&description=query-github)

Create a file named `main.c`.

```c
/*
   04/05/2018 https://github.com/su8/query-github

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include <curl/curl.h>

static size_t read_github_data_cb(char *, size_t, size_t, char *);

static size_t
read_github_data_cb(char *data, size_t size, size_t nmemb, char *str1) {
  char *ptr = data;
  size_t sz = nmemb * size,z = 0;
  static size_t x = 0;

  for (; *ptr; ptr++,z++) {
    if ((z+4) < sz) { /* Verifying up to *(ptr+4) */

      if ('u' == *ptr) { /* unread */
        if ('n' == *(ptr+1) && 'r' == *(ptr+2) && 'e' == *(ptr+3)) {
          ++x;
        }
      }

    }
  }
  snprintf(str1, 49, "%zu", x);

  return sz;
}


int main(void) {
  char str[50];
  const char *const github_url = "https://api.github.com/notifications?access_token=" GITHUB_TOKEN;

  CURL *curl = NULL;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_ALL);

  if (NULL == (curl = curl_easy_init())) {
    goto error;
  }

  curl_easy_setopt(curl, CURLOPT_URL, github_url);
  curl_easy_setopt(curl, CURLOPT_ACCEPT_ENCODING, "gzip");
  curl_easy_setopt(curl, CURLOPT_USERAGENT, "query-github/1.0");
  curl_easy_setopt(curl, CURLOPT_USE_SSL, (long)CURLUSESSL_ALL); 
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 20L);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, read_github_data_cb);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, str);

  res = curl_easy_perform(curl);
  if (CURLE_OK != res) {
    goto error;
  }

  printf("Unread Notifications %s\n", str);

error:
  if (NULL != curl) {
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();

  return EXIT_SUCCESS;
}
```

Create a file named `Makefile`.

```bash
CFLAGS+=-Wall -Wextra -O2
LDFLAGS+=-lcurl

PACKAGE=github
PROG=main.c

all:
	$(CC) -DGITHUB_TOKEN=\"'$(TOKEN)'\" $(CFLAGS) $(LDFLAGS) -o $(PACKAGE) $(PROG)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f /usr/bin/$(PACKAGE)

.PHONY: all install clean
```

Now type:

```bash
make TOKEN="123456789"
sudo make install
# just execute `github' to show you the unread notifications
```
