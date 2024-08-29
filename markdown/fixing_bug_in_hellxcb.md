
---

Uploading files or closing xfce terminal with busy tabs conflicts and they try to steal the focus which makes them completely unclosable and when I kill the dialog window it closes the entire browser/terminal.

The WM is compiled with `FOLLOW_MOUSE True`, `CLICK_TO_FOCUS False` and if I set the `CLICK_TO_FOCUS to True` and `FOLLOW_MOUSE False` -- it's working correctly.

Try to simulate busy xfce terminal. Type in at least 2 tabs:` while true; do sleep 1;done` and try to close it with keyboard combo buttons. The terminal must NOT be the only launched program, because the closing dialog works fine in this scenario. Open up other program.

Here was what the bug looked like.

![](img/file/fixing_hellxcb_bug/1.png)

![](img/file/fixing_hellxcb_bug/2.png)

![](img/file/fixing_hellxcb_bug/3.png)

I have fixed it in - [link1](https://github.com/su8/hellxcb/commit/5b91d54be7fbd8d195d462428eaaeb4cc8a2832f)  , [link2](https://github.com/su8/hellxcb/commit/0c1b4f8def3c30e1cb25ae8b09a619cdfb65274a) commits.