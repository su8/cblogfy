
---

Query xorg to get the current state of numlock, capslock and scroll lock, can be combined to i3, conky or other programs.

Create a file named `main.c`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>

int main(void) {
  Display *display = XOpenDisplay(NULL);
  XKeyboardState x;

  if (NULL == display) {
    printf("%s\n", "Cannot open X server");
    return EXIT_FAILURE;
  }

  XGetKeyboardControl(display, &x);
  XCloseDisplay(display);

  printf("Num %s Caps %s Scroll %s\n",
    (x.led_mask & 2 ? "On" : "Off"),
    (x.led_mask & 1 ? "On" : "Off"),
    (x.led_mask & 4 ? "On" : "Off"));

  return EXIT_SUCCESS;
}
```

Create a file named `Makefile`.

```bash
CFLAGS+=-Wall -Wextra -O2
LDFLAGS+=-lX11

PACKAGE=numcaps
PROG=main.c

all:
	$(CC) $(CFLAGS) $(LDFLAGS) -o $(PACKAGE) $(PROG)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f /usr/bin/$(PACKAGE)

.PHONY: all install clean
```

Just type `numcaps`.

If your keyboard button isn't working:

```bash
# Turn on scroll lock
xset led named "Scroll Lock"

# Turn off scroll lock
xset -led named "Scroll Lock"
```