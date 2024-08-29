
---

Query xorg and show the currently used keyboard layout, can be combined to i3, conky or other programs.

Create a file named `main.c`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>
#include <X11/XKBlib.h>

int main(void) {
  Display *display = XOpenDisplay(NULL);
  char *group = NULL;
  XkbStateRec state;

  if (NULL == display) {
    printf("%s\n", "Cannot open X server");
    return EXIT_FAILURE;
  }

  XkbGetState(display, XkbUseCoreKbd, &state);
  XkbDescPtr desc = XkbGetKeyboard(display, XkbAllComponentsMask, XkbUseCoreKbd);
  group = XGetAtomName(display, desc->names->groups[state.group]);

  printf("%s\n", (group != NULL ? group : "unknown"));

  XFree(group);
  XCloseDisplay(display);

  return EXIT_SUCCESS;
}
```

Create a file named `Makefile`.

```bash
CFLAGS+=-Wall -Wextra -O2
LDFLAGS+=-lX11

PACKAGE=kb-layout
PROG=main.c

all:
	$(CC) $(CFLAGS) -o $(PACKAGE) $(PROG) $(LDFLAGS)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f /usr/bin/$(PACKAGE)

.PHONY: all install clean
```