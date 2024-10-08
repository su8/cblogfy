
---

Query gmail and show all unread emails, can be combined to i3, conky or other programs.

Make sure that you have not blocked the requests by turning the following option on - https://myaccount.google.com/lesssecureapps , once it's on wait 5 minutes before you make a request.

Create a file named `mail.c`.

```c
/*
   04/02/2018 https://github.com/su8/query-gmail

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
#include <ctype.h>

#include <curl/curl.h>

static size_t read_gmail_data_cb(char *, size_t size, size_t nmemb, char *);

static size_t
read_gmail_data_cb(char *data, size_t size, size_t nmemb, char *str1) {
  char *ptr = data;
  static char buf[50];
  static char *ptr2 = buf;
  size_t sz = nmemb * size, x = 0;

  for (; *ptr; ptr++, x++) {
    if ((x+17) < sz) { /* Verifying up to *(ptr+17) */

      if ('f' == *ptr) { /* fullcount */
        if ('u' == *(ptr+1) && 'l' == *(ptr+2) && 'l' == *(ptr+3)) {
          *ptr2++ = *(ptr+10); /* 1 email */
          if (0 != (isdigit((unsigned char) *(ptr+11)))) {
            *ptr2++ = *(ptr+11); /* 10 emails */
          }
          if (0 != (isdigit((unsigned char) *(ptr+12)))) {
            *ptr2++ = *(ptr+12); /* 100 emails */
          }
          if (0 != (isdigit((unsigned char) *(ptr+13)))) {
            *ptr2++ = *(ptr+13); /* 1000 emails */
          }
          if (0 != (isdigit((unsigned char) *(ptr+14)))) {
            *ptr2++ = *(ptr+14); /* 10 000 emails */
          }
          if (0 != (isdigit((unsigned char) *(ptr+15)))) {
            *ptr2++ = *(ptr+15); /* 100 000 emails */
          }
          break;
        }
      }

    }
  }

  snprintf(str1, 49, "%s", buf);
  return sz;
}


int main(void) {
  char str[50] = "0";
  const char *const da_url = "https://mail.google.com/mail/feed/atom";

  CURL *curl = NULL;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_ALL);

  if (NULL == (curl = curl_easy_init())) {
    goto error;
  }

  curl_easy_setopt(curl, CURLOPT_USERNAME, GMAIL_ACC);
  curl_easy_setopt(curl, CURLOPT_PASSWORD, GMAIL_PASS);
  curl_easy_setopt(curl, CURLOPT_URL, da_url);
  curl_easy_setopt(curl, CURLOPT_ACCEPT_ENCODING, "gzip");
  curl_easy_setopt(curl, CURLOPT_USE_SSL, (long)CURLUSESSL_ALL); 
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 20L);
  curl_easy_setopt(curl, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, read_gmail_data_cb);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, str);

  res = curl_easy_perform(curl);
  if (CURLE_OK != res) {
    goto error;
  }

error:
  if (NULL != curl) {
    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();

  printf("Unread Mails %s\n", str);
  return EXIT_SUCCESS;
}
```

Create a file named `Makefile`.

```bash
CFLAGS+=-Wall -Wextra -O2
LDFLAGS+=-lcurl

PACKAGE=mail
PROG=mail.c

all:
	$(CC) -DGMAIL_ACC=\"'$(ACC)'\" -DGMAIL_PASS=\"'$(PASS)'\" $(CFLAGS) $(LDFLAGS) -o $(PACKAGE) $(PROG)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f /usr/bin/$(PACKAGE)
	rm -f $(PACKAGE)

.PHONY: all install clean
```

Now yupe:

```bash
make ACC="foo" PASS="bar"
sudo make install
# and type `mail' to use it
```
