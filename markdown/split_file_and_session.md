
---

Today we will solve a riddle that involves splitting large file on chunks.

Later on we will **capture** and **replay** our interactive shell session, if you think about screencast then you are wrong.

Imagine that you need to upload a large file to cloud service that has some uploading limits or backup 20 TB onto several Blu ray discs.

What would you do if the data exceeds the limits ? The solution is called file splitting. We got the data and will split it on several chunks, so we can write the chunks onto several Blu ray discs or upload them to the cloud flawlessly.

Let's produce a dummy file and demonstrate how to split it. Type `dd if=/dev/zero of=aa.iso count=10MB` , this will produce roughly 5GB file named **aa.iso**

You can split **aa.iso** and compress it's chunks in the same time. **lz4** provides outstanding compression speed by no means. Here is the splitting command itself:

```bash
split --bytes=500M --additional-suffix=.chunk --filter='lz4 > $FILE.lz4' aa.iso
```

Adjust the **--bytes** value according to your needs, the higher value the lesser chunk files and vice versa.

The command produced 10 compressed chunks in our case. Don't even think to use file-manager to extract the chunks.

To restore the original file type `cat *.chunk.lz4 | lz4 -d > aa2.iso`.

It is highly recommended to include simple text file and explain what you've done and how to achieve the wanted result back, so you don't have to scratch your head after a year or two when you decide to restore the file(s).

Make sure that the produced chunks will reside in their own folder along with the simple text file.

As promised at the beginning of this post, we will capture and replay our interactive shell session. I have to **YELL** you that everything you are about to type will be executed in same order, timing and pauses, so don't perform any "remove" or "install" commands during the **capturing**.

Take it seriously because it's that easy to fuck up your system if you type something silly.

Invoke the command `script --timing 2> capture_begin` and you'll get response like **Script started, file is typescript**

From now on everything is recorded and appended to the files capture_begin, typescript.

Invoke some **SAFE** and random commands:

```bash
echo 'Hot + dog = woof woof burger' | xz -9e > shizzle_my_nizzle.xz
date
printf "%s" $SHELL
whoami
```

Once done press CTRL-D to stop the capturing. To replay it type `scriptreplay capture_begin` sit back, watch and laugh.

Merry Christmas and Happy New Year in advance.
