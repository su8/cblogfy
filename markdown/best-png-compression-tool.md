
---

You know what they say 'png for websites and jpg for photographs'.

Although the usage of jpg images in your website can reduce the overall used space, thus doesn't mean that the images won't look like a sphagetti mess. There is just no way to compress jpg images without losing quality.

We will compare some of the popular png compression tools to find out which one is the best. Some of the tools are not presented because:
**Trimage** is front end GUI for optipng and jpegoptim. zopflipng-git takes up to 30 minutes to compress a single image which makes it useless if you want to compress a bundle of images.

![](img/file/1misc/jpg_vs_png.png)

Let's begin with the comparison and later I'll give you the commands which I used.

1 main folder, 131.9 MB in size with 332 files and 4 sub-folders. I've compressed 3 images with GIMP and 2 more with 'tinypng' to see does the compression tools will notice previous compression.

| \#  | Compression tool | Total waiting time | Main folder size |
|-----|------------------|--------------------|------------------|
| 1   | pngcrush         | 1 hour 18 min      | 121.5 MB         |
| 2   | optipng          | 1 hour 33 min      | 120.4 MB         |
| 3   | pngout           | 4 hours            | 121.2 MB         |

pngcrush doesn't detected the compressed images, so far it's the most harmless tool because it didn't added more or less size to the compressed images that I've thrown.
optipng 'Trying: xxx.png is already optimized.' - awesome !
pngout detected the compressed images 'Unable to compress further', but added additional size and re-compressed the already compressed images - downvote for pngout.

All of the png compression tools was using just one of our CPU cores. `optipng` is the best png compression tool, it detects and skips already compressed images which makes it really useful if you want to utilize all of your CPU cores by starting few optipng instances simultaneously, also it gave us the best compression ratio.

Used commands:

```bash
find . -type f -name "*.png" -exec replace_with_command_here {} \;
```

**pngcrush**

```bash
pngcrush -brute -d /home/user/images/ image.png
```


**optipng:**

```bash
optipng -o7 image.png
```

**pngout**

```bash
pngout image.png
```
