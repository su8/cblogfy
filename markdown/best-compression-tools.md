
---

Nowadays in GNU/Linux we often use the file managers to archive and compress out data.

But did you knew that in the terminal you can use different compression tool than the provided in the file manager ?

I made 3 tests which will compare some of the popular compression tools and we'll see which tool is the best when it comes to data compression.

Let me show you the first table which reveals some data, and later I'll give you the commands which I used.

##Test one: compressing mixed content##

1 main folder, 687.2 MB in size with 643 files and 34 sub-folders. The content in it is mixed: from pictures, songs, video files to binary, text files, scripts and all the normal stuff you'll find in your drive.

| \#  | Compression tool | Total waiting time | Archive size(out. file) |
|-----|------------------|--------------------|-------------------------|
| 1   | lzma             | 5min 25sec         | 624.4 MB                |
| 2   | xz               | 5min 49sec         | 619.7 MB                |
| 3   | gz               | 0min 27sec         | 663.4 MB                |
| 4   | bzip2            | 3min 19sec         | 662.3 MB                |
| 5   | 7zip             | 2min 35sec         | 615.4 MB                |
| 6   | zip              | 0min 27sec         | 663.5 MB                |

This is the first test out of three and it reveals which compression tool is the best to compress mixed content for the shortest time but with the lowest file size as possible, in the remaining tests we'll see does 7zip will continue to be so awesome.

As it turns out, for mixed content **7zip** should be used.

##Test 2: compressing binary content##

1 folder with 292 files, 0 sub-folders and 597.9 MB in size, with content of binary files.

| \#  | Compression tool | Total waiting time | Archive size(out. file) |
|-----|------------------|--------------------|-------------------------|
| 1   | lzma             | 4min 1sec          | 790.1 KB                |
| 2   | xz               | 6min 51sec         | 793.2 KB                |
| 3   | gz               | 2min 3sec          | 246.7 MB                |
| 4   | bzip2            | 1min 30sec         | 215.8 MB                |
| 5   | 7zip             | 3min 33sec         | 2.8 MB                  |
| 6   | zip              | 2min 1sec          | 246.9 MB                |

The results may surprise you. So if you have a folder with binary files only, you'll prefer to use **lzma** anytime, and out leader 7zip is feeling the pressure.

##The final test: compressing text files/scripts##

1 folder with 4973 files, 0 sub-folders and 770.2 MB in size, with content of python, bash scripts and text files.

| \#  | Compression tool | Total waiting time | Archive size(out. file) |
|-----|------------------|--------------------|-------------------------|
| 1   | lzma             | 3min 27sec         | 209.8 KB                |
| 2   | xz               | 9 min 33 sec       | 202.9 KB                |
| 3   | gz               | 3 min 25sec        | 188.6 MB                |
| 4   | bzip2            | 12 min 42 sec      | 54.5 MB                 |
| 5   | 7zip             | 3 min 5 sec        | 155.7 KB                |
| 6   | zip              | 3min 16sec         | 189.4 MB                |

We have a winner, superb. After 3 different tests, 2 won by 7zip, we can declare that 7zip is the best compression tool. Now you know, if you want to compress anything else than binary files, **7zip** is your best bet.

Used commands:

**lzma:**

```
tar cv docs | lzma -z -9 > docs.tar.lzma
```

**xz:**

```
XZ_OPT=-9e tar -cJf docs.tar.xz docs
```

**gz:**

```
GZIP=-9 tar cvzf docs.tar.gz docs
```

**bzip2:**

```
BZIP2=-9 tar -jcvf docs.tar.bz2 docs
```

**7zip:**

```
7za a -mx=9 docs.7z docs
```

**zip:**

```
zip -9 -r docs.zip docs
```

Until next time :}
