
---

At first glance generating snapshots from video file by using the command line version of vlc wasn't successful.

I'm addicted to the terminal and wanted to use the cvlc to generate snapshots from a video file, having that said it took me nearly half day to find out the proper combination of cvlc options in order to achieve this goal.

    $ cvlc -vvv -I dummy --start-time=20 --stop-time=27 --video-filter=scene --vout=dummy --no-audio --scene-format=png --scene-prefix=snap --scene-path=Pictures/ /home/user/path/to/videofile.mp4 vlc://quit

This command generates 4 snapshots at 2 seconds interval between the seconds 20 and 27 from the given file.

'--scene-path=Pictures/' is the directory where the pictures will be generated.

'--scene-prefix=snap' is the prefixed name which will be used to name the pictures.

Now let's move to screencasting with cvlc again.

    $ cvlc screen:// :screen-fps=24 :sout='#transcode{vcodec=h264,acodec=mpga,ab=128,channels=2,samplerate=44100}:file{dst=/home/user/path/to/recorededvideofile.mp4}'

The above screencasting command gives me nice quality and file size ratio, so I don't have to worry about getting large file that have to be uploaded to YouTube.

Running your own pastebin-like server ? Yup that's true, python made it easy ! Download and unzip [simple pastebin server](https://github.com/xumingming/simple-pastebin-server), the best of all is: any device that python can be installed on it can be the server and the files that are colourized are stored in plain text. So you can share the wanted paste with anyone, just give them your external ip with port 8000 (123.456.789.000:8000)

Once downloaded, create folder named **data** and type `python2 pastebin.py`.

I already tried it and worked fine on my android phone and tablet. I don't think that anyone can get a website up and running with less work without using python `python3 -m http.server`
