
---

I'm proud to announce that I have wrote pdf2img in C.

Read on and I'll reveal my **uname** implementation.

I quickly get used and loved C (started half year ago). The language is pretty small, and doesn't come with **batteries included**, nor it has **cheese shop** as some other languages.

Instead there are some libraries considered as **"standard libraries"**, but they are not part of the language itself.

The new version of pdf2img not only runs faster than it's python cousins, it preserves the same look and functionalities, but has sligthly more features than them, have a look: [https://github.com/wifiextender/pdf2img-c](https://github.com/wifiextender/pdf2img-c)

If anyone wants to start with C as first programming language that would be terrible mistake.

Python, ruby or perl on other hand will give you the necessary how-to, **object-oriented** knowledge, and many good principles like "Don't repeat yourself".

You won't appreciate how useful, time saving and cross platform are the language modules until you dive in C where you'll be forced to write their alternatives.

You have to know some programming language from A to Z in order to make successful jump in C, otherwise you will be spending most of your developing time in the search engines and forums asking others to write your program's code instead YOU.

Let me show you my **uname** implementation, the only difference between your pre-installed uname and my implementation is that my version doesn't have '-i' and '-o' options, otherwise the program behaves exactly as uname.

Here is the program itself, please note that this is a picture taken from my text editor, there is a link to the program's source code right below the picture.

![](img/file/1misc/uname2.png)

You can download the source code here: [img/file/1misc/uname2.c](img/file/1misc/uname2.c)

Compile the program with:

```bash
gcc -Wall -O2 -o uname2 uname2.c
```

Whenever you stuck just issue `./uname2 --help`

Now I can have my breakfast, lol.
