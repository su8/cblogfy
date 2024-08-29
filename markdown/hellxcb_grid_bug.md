
---

I have fixed flickering and freezing of floating programs such as Gimp as he tried to steal the focus with the Grid mode/layout [su8/hellxcb@0cf2cc2](https://github.com/su8/hellxcb/commit/0cf2cc211d9380e344b5538f3cf9333d02838c36)

```c
void grid(int hh, int cy) {

for (client *c=head; c; c=c->next) {
    if (c->isfloating) continue; /* don't resize floating windows */
...
}
```

To try it out, start with Tiled mode and open up some programs e.g for example 2 terminals and Gimp, then switch to Grid mode/layout to see the bug in action.