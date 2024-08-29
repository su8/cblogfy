
---

Do you type a lot of commands ? Do you want somekind of automation which with a single mouse click to complete the desired task ? I guarantee you that after reading my tutorial you will know how to ease your tasks from now on.

Check out what shell you are using

```bash
ps -p $$
```

Writing the most simple disk space checker, modify the script if you are using cli server -> New_file.sh  

```bash
#!/bin/bash
xfce4-terminal -H -x /home/frost/New_file2.sh
exit
```

New_file2.sh

```bash
#!/bin/bash
partition=sda3
percent=80
hdd=`df -h |grep $partition | awk '{ print $5 }' | cut -d'%' -f1`
if [ $hdd -gt $percent ]; then
echo -e "\e[93mUsed space in %: \e[31m$hdd"
echo Running out of disk space > /home/frost/Desktop/readme.txt
echo -e "\033[0m"
else
echo -e "\e[40;38;5;82mUsed space in %: \e[44m$hdd"
echo -e "\033[0m"
fi
```

The New_file.sh bash is telling on xfce4-terminal to open new terminal window, browse and execute  New_file2.sh

New_file2.sh: run "lsblk" to see what's yours partitions. Then modify the "partition" name in the script. "percent" specify the number when it will warn you about the used space. Take your time because your next task is to examine the rest of the script and try to learn why those lines are there.

##Wine#

Do you have windows applications ? Is it possible to run them via bash instead manually navigating to the folder where they resides ?

Yes it is possible with the mighty Bash again

I am huge MMORPG fan - yes that's me :D

Got the application, so let's create a bash script that will launch automatically this app without the need to manually browse it's directory

openmu.sh

```bash
#!/bin/bash
cd /home/frost/Documents/OpenMu
wine main.exe
exit
```

cd, dvd, blu-ray, floppy

wine main.exe - tells on wine to execute main.exe, while exit is used to exit from the shell and stop the process from endless main.exe launchings - read these words CAREFULLY !

##GitHub file uploader#

To be honest there isn't eyecandy file uploaders for linux, we still use the good old terminal. The next script aims to save your time while adding,commiting and pushing your files. We are about to use two-step launching script again.

gi.sh

```bash
#!/bin/bash
xfce4-terminal -H -x /home/frost/tt/gi2.sh
exit
```

I already explained at the beginning that script actions. Let's move to second script.

gi2.sh

```bash
#!/bin/bash
cd /home/frost/tt/site
git add -A
git commit -am "blog"
git push origin gh-pages
exit
```

I was using many opened terminals in the past to browse each folder, add the desired files, commit the changes and finally upload everything to my "gh-pages", since I realized that with bash I can save my precious time I can easily write a bash script to do all of this.

My panel with the GitHub uploader

![](img/file/1misc/panel-07-26.png)

While writing this tutorial I think to create another script that will browse my blogpy folder and automatically generate new posts. 

You can use icons to those scripts and pin them like me to your panel, I am using "lxmed" and "alacarte". 
