
---

A weekly backup strategy is necessary step to avoid huge data loss in case of an issue.

There are many open source programs that will help you to do that, but why do you have to rely on a 3rd party program when you can create a small script and or program that will achieve the same result &#63;

The space on our drives is the factor that we should think of first, because performing weekly backups could easily fill up the drive pretty quickly if we don't use a incremental backups strategy.

As the name **incremental** suggests, the latest backups will include only the newest entries to the directories and or files which we want to backup, thus saving a lot space.

Lets say we have a single folder that has 1000 files and is 100 MB in size. When we perform a incremental backup, the first (initial) backup will create an archive and a list-like incremetal file that contains a record of all files which are included in the first (inital) archive. From now on, when we add new files to that folder the next incremental backups will include only the newly added files, so we will not going to backup the whole folder again, instead the incremental file will notice which files are changed and or added and the newly created backups will include the changes, plus the incremental file will add the newest entries and or changed files.

Here are the gzip and xz incremental backup commands, xz is first:

```bash
# The first (initial) xz backup
XZ_OPT=-9e tar -cJf home-dir.tar.xz /home/user/ -g incremetal
# The newer backup with only the changed files
XZ_OPT=-9e tar -cJf home-dir-07-26-2014.tar.xz /home/user/ -g incremetal
# The data restore will use the incremental file
tar xvf home-dir.tar.xz
tar xvf home-dir-07-26-2014.tar.xz
```

gzip:

```bash
# The first (initial) gzip backup
GZIP=-9 tar cvzg incremetal -f home-dir.tar.gz /home/user/
# The newer backup with only the changed files
GZIP=-9 tar cvzg incremetal -f home-dir-07-26-2014.tar.gz /home/user/
# The data restore will use the incremental file
tar zxvf home-dir.tar.gz
tar zxvf home-dir-07-26-2014.tar.gz
```

We know what the hackers did the last summer, taken from my archive lol.

![](img/file/inc_bak/ubuntu-hacked.png)
![](img/file/inc_bak/ubuntu-hacked2.png)

I've started learning C one week ago, and dunno if I'll be able to continue writing posts each week. I'm trying to find a balance between been husband, father of two children, employee, educating others in python and learning C.

I have plans for OpenBSD related how-to website, but that's in future project.
