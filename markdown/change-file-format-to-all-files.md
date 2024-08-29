
---

Yesterday faced weird problem. My CentOS server have nearly 200 logs and I needed to change their file format from **log** to **txt**.

The server is handled only with command lines and there is no GUI nor X neither file manager which I can select, right click and rename the wanted files, so python came handy.

I've wrote such program nearly 20 days ago in responses of a post in unixmen since one of their authors wrote it in bash, but it was too limited.

```python
import os
from sys import argv

for filenames in (Suffix for Suffix in os.listdir('.') if Suffix.endswith(argv[1])):
    new_name, newname_extension = os.path.splitext(filenames)
    os.rename(filenames, new_name + argv[2])
```

Usage: python rename.py .log .txt
Result: 1.log, 2.log, 3.log -> 1.txt, 2.txt, 3.txt

![](img/file/1misc/uni.png)

What's pitty is the same author deleted my comment, wrote python alternative to his bash program, where my program was far more usable and greater than his. Asked him what is the reason for my comment removal, and the silence killed my motivation to comment further in this website. The way we learn things is by sharing the information and go over our **ego**.

I'm moving to another town and don't have time to write archlinux installation tutorial right now. Once everything is settled down and got internet will post the tutorial.
