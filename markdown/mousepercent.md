
---

Query xorg and get the mouse speed in percentage, can be combined to i3, conky or other programs.

Create a file named `main.c`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>

int main(void) {
  Display *display = XOpenDisplay(NULL);
  int acc_num = 0, acc_denom = 0, threshold = 0;

  if (NULL == display) {
    printf("%s\n", "Cannot open X server");
    return EXIT_FAILURE;
  }

  XGetPointerControl(display, &acc_num, &acc_denom, &threshold);
  printf("%d%%\n", (110 - threshold));
  XCloseDisplay(display);

  return EXIT_SUCCESS;
}
```

Create a file named `Makefile`.

```bash
CFLAGS+=-Wall -Wextra -O2
LDFLAGS+=-lX11

PACKAGE=mouse-speed
PROG=main.c

all:
	$(CC) $(CFLAGS) $(LDFLAGS) -o $(PACKAGE) $(PROG)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f /usr/bin/$(PACKAGE)

.PHONY: all install clean
```

Now type `mouse-speed`.