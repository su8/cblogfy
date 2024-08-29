
---

I have added a way to cycle all of the tiling modes with one key combination `alt + shift + y`

```c
...
/* config.h */
{  MOD1|SHIFT,       XK_y,          cycle_mode,        {NULL}},
...

/* hellxcb.c -- cycle thru all of the tiling modes and reset all floating windows */
static void cycle_mode(const Arg *arg);
static void cycle_mode(const Arg *arg) {
    (void)arg;
    static unsigned int x = 0U;
    for (client *c = head; c; c = c->next) c->isfloating = False;
    if (x >= 4U) x = 0U;
    mode = x++;

    tile(); update_current(current);
    desktopinfo();
}
```

Tada, we have dead simple way to switch between different tiling modes/layouts.