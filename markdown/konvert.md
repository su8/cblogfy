
---

ImageMagick's convert alternative in python.

## Requirements

* python2
* python2-pillow
* ghostscript

## Usage Options:

    input image formats:
        jpg, png, gif, bmp, pcx, ppm, tiff, pdf, tif, im, eps, xwd, pgm, pbm, tga

    output image formats:
        jpg, png, gif, bmp, pcx, ppm, tiff, pdf, tif, im, webp, pgm, pbm, tga

    input image = 1.png , output image = 2.png

    konvert image to image:
        konvert 1.png 1.jpg

    resize image:
        konvert 1.png -resize 600x700 2.png

    rotate image:
        konvert 1.png -rotate 60 2.png

    image information:
        konvert 1.png -info

    crop:
        konvert 1.png -crop 425x250 2.png

    contrast, color, brightness, sharpness: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%
    input image = 1.png , output image = 2.png

    contrast:
            konvert 1.png -contrast 1 2.png
    color:
            konvert 1.png -color 1 2.png
    sharpness:
            konvert 1.png -sharpness 1 2.png
    brightness:
            konvert 1.png -brightness 1 2.png

## Effects:

    input image = 1.png , output image = 2.png

    blur:
        konvert 1.png -blur 2.png
    contour:
        konvert 1.png -contour 2.png
    detail:
        konvert 1.png -detail 2.png
    edge:
        konvert 1.png -edge 2.png
    edge2:
        konvert 1.png -edge2 2.png
    edge3:
        konvert 1.png -edge3 2.png
    embross:
        konvert 1.png -embross 2.png
    smooth:
        konvert 1.png -smooth 2.png

## PDF konversion options:

    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page, 6 image format, 7 sDevice (type: konvert -help sdevice)
    konvert file.pdf 100 20 30 png png16m

    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page, 6 image format (png, jpg, bmp, tiff)
    konvert file.pdf 100 20 30 png

    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page
    konvert file.pdf 100 20 30

    1 program name, 2 file name, 3 from page, 4 to
    konvert file.pdf 20 30

## Individual options or effects usage:

    konvert -help rotate
    konvert -help crop
    and so on ...

The `konvert` script:

```python
#!/usr/bin/env python2
# Created by Aaron Caffrey
# License: GPLv3
from __future__ import print_function
import os
from sys import argv
from subprocess import PIPE, Popen
from shutil import rmtree, move
from PIL import Image, ImageEnhance, ImageFilter

# install ghostscript, python2-pillow

class konvert:

    def __init__(self):
        infile = argv[1]
        infile_name, infile_extension = os.path.splitext(infile)

        if len(argv[1:]) >= 2:

            # sharpen effect
            if argv[2] == "-sharpen":
                Image.open(argv[1]).filter(ImageFilter.SHARPEN).save(argv[3])

            # smooth effect
            if argv[2] == "-smooth":
                Image.open(argv[1]).filter(ImageFilter.SMOOTH).save(argv[3])

            # embross effect
            if argv[2] == "-embross":
                Image.open(argv[1]).filter(ImageFilter.EMBOSS).save(argv[3])

            # edge3 effect
            if argv[2] == "-edge3":
                Image.open(argv[1]).filter(ImageFilter.FIND_EDGES).save(argv[3])

            # edge2 effect
            if argv[2] == "-edge2":
                Image.open(argv[1]).filter(ImageFilter.EDGE_ENHANCE_MORE).save(argv[3])

            # edge effect
            if argv[2] == "-edge":
                Image.open(argv[1]).filter(ImageFilter.EDGE_ENHANCE).save(argv[3])

            # detail effect
            if argv[2] == "-detail":
                Image.open(argv[1]).filter(ImageFilter.DETAIL).save(argv[3])

            # blur effect
            if argv[2] == "-blur":
                Image.open(argv[1]).filter(ImageFilter.BLUR).save(argv[3])

            # contour effect
            if argv[2] == "-contour":
                Image.open(argv[1]).filter(ImageFilter.CONTOUR).save(argv[3])

            # resize
            if argv[2] == "-resize":
                r = argv[3] + "x200"  # example: 600x700x200
                ar1, ar2, ar3 = r.split("x")  # ar1=600, ar2=700, ar3=200, ar3 won't going to be used
                Image.open(argv[1]).resize((int(ar1), int(ar2))).save(argv[4])

            # rotate
            if argv[2] == "-rotate":
                Image.open(argv[1]).rotate((int(argv[3]))).save(argv[4])

            # color
            if argv[2] == "-color":
                ImageEnhance.Color(Image.open(argv[1])).enhance(float(argv[3])).save(argv[4])

            # sharpness
            if argv[2] == "-sharpness":
                ImageEnhance.Sharpness(Image.open(argv[1])).enhance(float(argv[3])).save(argv[4])

            # brightness
            if argv[2] == "-brightness":
                ImageEnhance.Brightness(Image.open(argv[1])).enhance(float(argv[3])).save(argv[4])

            # contrast
            if argv[2] == "-contrast":
                ImageEnhance.Contrast(Image.open(argv[1])).enhance(float(argv[3])).save(argv[4])

            # crop
            if argv[2] == "-crop":
                r = argv[3] + "x200"  # example: 600x700x200
                ar1, ar2, ar3 = r.split("x")  # ar1=600, ar2=700, ar3=200, ar3 won't going to be used
                Image.open(argv[1]).crop((0, 0, int(ar1), int(ar2))).save(argv[4])

            # information
            if argv[2] == "-info":
                print(infile, Image.open(argv[1]).format, "{0}x{1}".format(Image.open(argv[1]).size, Image.open(argv[1]).mode))

            # pdf
            if infile.endswith("pdf"):
                print("\nProcessing {0}, please wait..\n".format(infile))
                if not os.path.exists(infile_name + "_images"):
                    os.makedirs(infile_name + "_images")
                else:
                    rmtree(infile_name + "_images/")
                    os.makedirs(infile_name + "_images")

                if len(argv[1:]) == 6:
                    sub = range(int(argv[4])+2 - int(argv[3]))
                    del sub[0]
                    page_range = range(int(argv[3]), int(argv[4])+1)
                    arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                         "-sOutputFile={0}_images/{1}_page_%01d.{2}".format(infile_name, infile_name, argv[5]), "-sDEVICE={0}".format(argv[6]), "-r{0}".format(argv[2]), infile]
                    Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()
                    for (x, z) in (zip(page_range, sub)):
                        move("{0}_images/{1}_page_{2}.{3}".format(infile_name, infile_name, z, argv[5]), "{0}_images/{1} page {2}.{3}".format(infile_name, infile_name, x, argv[5]))

                elif len(argv[1:]) == 5:
                    sub = range(int(argv[4])+2 - int(argv[3]))
                    del sub[0]
                    page_range = range(int(argv[3]), int(argv[4])+1)

                    if argv[5] == "png":
                        arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                             "-sOutputFile={0}_images/{1}_page_%01d.png".format(infile_name, infile_name), "-sDEVICE=png16m", "-r{0}".format(argv[2]), infile]
                        Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    elif argv[5] == "jpeg" or argv[5] == "jpg":
                        arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                             "-sOutputFile={0}_images/{1}_page_%01d.jpg".format(infile_name, infile_name), "-sDEVICE=jpeg", "-r{0}".format(argv[2]), infile]
                        Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    elif argv[5] == "bmp":
                        arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                             "-sOutputFile={0}_images/{1}_page_%01d.bmp".format(infile_name, infile_name), "-sDEVICE=bmp16m", "-r{0}".format(argv[2]), infile]
                        Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    elif argv[5] == "tiff":
                        arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                             "-sOutputFile={0}_images/{1}_page_%01d.tiff".format(infile_name, infile_name), "-sDEVICE=tiff24nc", "-r{0}".format(argv[2]), infile]
                        Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    else:
                        Call().Help()

                    for (x, z) in (zip(page_range, sub)):
                        move("{0}_images/{1}_page_{2}.{3}".format(infile_name, infile_name, z, argv[5]), "{0}_images/{1} page {2}.{3}".format(infile_name, infile_name, x, argv[5]))

                elif len(argv[1:]) == 4:
                    sub = range(int(argv[4])+2 - int(argv[3]))
                    del sub[0]
                    page_range = range(int(argv[3]), int(argv[4])+1)
                    arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[3]), "-dLastPage={0}".format(argv[4]),
                         "-sOutputFile={0}_images/{1}_page_%01d.png".format(infile_name, infile_name), "-sDEVICE=png16m", "-r{0}".format(argv[2]), infile]
                    Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    for (x, z) in (zip(page_range, sub)):
                        move("{0}_images/{1}_page_{2}.png".format(infile_name, infile_name, z), "{0}_images/{1} page {2}.png".format(infile_name, infile_name, x))

                elif len(argv[1:]) == 3:
                    sub = range(int(argv[3])+2 - int(argv[2]))
                    del sub[0]
                    page_range = range(int(argv[2]), int(argv[3])+1)
                    arglist = ["gs", "-dBATCH", "-dNOPAUSE", "-dFirstPage={0}".format(argv[2]), "-dLastPage={0}".format(argv[3]),
                         "-sOutputFile={0}_images/{1}_page_%01d.png".format(infile_name, infile_name), "-sDEVICE=png16m", "-r200", infile]
                    Popen(args=arglist, stdout=PIPE, stderr=PIPE).communicate()

                    for (x, z) in (zip(page_range, sub)):
                        move("{0}_images/{1}_page_{2}.png".format(infile_name, infile_name, z), "{0}_images/{1} page {2}.png".format(infile_name, infile_name, x))
                else:
                    Call().Help()

            if not argv[2].endswith(infile_extension):
                out_name, out_extension = os.path.splitext(argv[2])

                formats = {
                    'inputfile':
                    [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".pcx",
                    ".ppm", ".tiff", ".pdf", ".tif", ".im", ".eps", ".xwd", ".pgm",
                    ".pbm", ".tga"],

                    'outfile':
                    [".jpg", ".png", ".gif", ".bmp", ".pcx", ".ppm", ".jpeg",
                     ".tiff", ".pdf", ".tif", ".im", ".webp", ".pgm", ".pbm", ".tga"]
                    }

                if not infile_extension in formats['inputfile']:
                    print("\n{0} is not supported\n".format(infile_extension))
                else:
                    if argv[2].endswith(tuple(formats['outfile'])):
                        Image.open(infile).save(argv[2])

            # help options
            if infile == "-help" and argv[2] == "sdevice":
                print("\nAvailable sDevices:\n\npng16m, pngalpha, pnggray\njpeg, jpegcmyk, jpeggray\nbmp16m, bmpgray\ntiff24nc, tiffgray\n")

            if infile == "-help" and argv[2] == "smooth":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -smooth 2.png\n")

            if infile == "-help" and argv[2] == "embross":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -embross 2.png\n")

            if infile == "-help" and argv[2] == "edge" or argv[2] == "edge2" or argv[2] == "edge3":
                print("\nAvailable edge effects: edge, edge2, edge3\n")
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -edge3 2.png\n")

            if infile == "-help" and argv[2] == "detail":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -detail 2.png\n")

            if infile == "-help" and argv[2] == "contour":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -contour 2.png\n")

            if infile == "-help" and argv[2] == "blur":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -blur 2.png\n")

            if infile == "-help" and argv[2] == "brightness":
                print("\nbrightness: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%")
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -brightness 1 2.png\n")

            if infile == "-help" and argv[2] == "sharpness":
                print("\nsharpness: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%")
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -sharpness 1 2.png\n")

            if infile == "-help" and argv[2] == "color":
                print("\ncolor: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%")
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -color 1 2.png\n")

            if infile == "-help" and argv[2] == "contrast":
                print("\ncontrast: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%")
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -contrast 1 2.png\n")

            if infile == "-help" and argv[2] == "crop":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -crop 425x250 2.png\n")

            if infile == "-help" and argv[2] == "info":
                print("\nImage information:\nkonvert 1.png -info\n")

            if infile == "-help" and argv[2] == "rotate":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -rotate 60 2.png\n")

            if infile == "-help" and argv[2] == "resize":
                print("\nInput image: 1.png , Output image: 2.png\nkonvert 1.png -resize 600x700 2.png\n")

        # 1 arg given
        else:
            Call().Help()

class Call:

    def Help(self):
        print("""
Supported image formats:
    input image formats:
        jpg, png, gif, bmp, pcx, ppm, tiff, pdf, tif, im, eps, xwd, pgm, pbm, tga

    output image formats:
        jpg, png, gif, bmp, pcx, ppm, tiff, pdf, tif, im, webp, pgm, pbm, tga

Options:
    input image = 1.png , output image = 2.png

    konvert image to image:
        konvert 1.png 1.jpg

    resize image:
        konvert 1.png -resize 600x700 2.png

    rotate image:
        konvert 1.png -rotate 60 2.png

    image information:
        konvert 1.png -info

    crop:
        konvert 1.png -crop 425x250 2.png

    contrast, color, brightness, sharpness: 1 = 100% (the original is 100%), 1.5 = 150%, 2 = 200%, 2.5 = 250%
    input image = 1.png , output image = 2.png

    contrast:
            konvert 1.png -contrast 1 2.png
    color:
            konvert 1.png -color 1 2.png
    sharpness:
            konvert 1.png -sharpness 1 2.png
    brightness:
            konvert 1.png -brightness 1 2.png

Effects:
    input image = 1.png , output image = 2.png

    blur:
        konvert 1.png -blur 2.png
    contour:
        konvert 1.png -contour 2.png
    detail:
        konvert 1.png -detail 2.png
    edge:
        konvert 1.png -edge 2.png
    edge2:
        konvert 1.png -edge2 2.png
    edge3:
        konvert 1.png -edge3 2.png
    embross:
        konvert 1.png -embross 2.png
    smooth:
        konvert 1.png -smooth 2.png

PDF konversion options:
    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page, 6 image format, 7 sDevice (type: konvert -help sdevice)
    konvert file.pdf 100 20 30 png png16m

    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page, 6 image format (png, jpg, bmp, tiff)
    konvert file.pdf 100 20 30 png

    1 program name, 2 file name, 3 resolution, 4 from page, 5 to page
    konvert file.pdf 100 20 30

    1 program name, 2 file name, 3 from page, 4 to
    konvert file.pdf 20 30

Individual options or effects usage:
    konvert -help rotate
    konvert -help crop
    and so on ...
""")

if __name__ == "__main__":
    try:
        konvert()
    except (OSError, IOError):
        print("\nThere is no such file {0} in the current directory.\n".format(argv[1]))
    except (ValueError, IndexError):
        Call().Help()
```