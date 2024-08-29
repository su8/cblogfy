
---

The discussion in [this](https://github.com/nylira/prism-break/issues/1092) thread reveals the reasons why we should ditch Thunderbird.

My initial reaction was "no, for gods sake - no you can't remove Thunderbird", but after a while I had to agree with the arguments there.

Actually I've used Thunderbird with the Tor's network and TorBirdy, but the need for another email client that doesn't leak my privacy was really high.

Interestingly, three days ago saw another thread in prism-break where a person called **blurmonk** suggested an email client with the name **Mutt** to be included and it caught my attention right on the second. Did a quick search and learnt a littlebit about this email client. Wrote some basic configuration (with some borrowed settings) and started it.

It took me nearly one hour to find out that the library msmtp was refusing the connection to my email provider over SSL, but it allowed me to use insecure connections and trasmit my account name and password in clear text... say what ?!

At this point I almost gave up until I saw that Mutt can be configured to use my email provider SMTP servers instead, and from this moment onwards Mutt became my primary email client.

The learning curve, if you doesn't like the changes and you are addicted to "old school" habits, then nuttin can be made. Stay and use the software that you think is the best for you. On other hand if you are like me, person that doesn't give a fuck and wants the best from everything and you have the will to make the final decision without regret, then the learning curve isn't that huge nor scary at all.

Thunderbird isn't actively maintained, while Mutt is. Mutt is command line operated email client and all of the configuration to make it working properly depends on you, so a code organization is a must have. Actually if you split the configuration over few files and encrypt the most important variables (with gpg), you will make your life much easier and safer.

You can find my Mutt configuration files [here](https://github.com/wifiextender/dotfiles/tree/master/archlinux-openbsd/home/frost/.config/mutt), so if you are looking for email client replacement Mutt must the first in your list.

Breaking news - I've replaced Archlinux with OpenBSD one month ago after a recent paranoia, and I will not stop writing GNU/Linux posts so don't worry.

Arch broke the "user" point and made me developing, creative and wanting moar. I've learned so much for the past 13 months in archlinux than in any other distribution that I have ever used in the past. 

ABS (PKGBUILDS), AUR, bleeding edge, KISS, The Arch way, the richest software repositories among all gnu/linux distros around, the ability to [recompile](https://wiki.archlinux.org/index.php/Pacbuilder) your system, so you don't have to install Gentoo to get the feeling of compiled system (see `/etc/makepkg.conf`), no 6 months kick in the azz upgrades, you can download any arch image even the one 1 year ago, run `pacman -Syu` and install it painlessly.

I can write ton information how arch opened my eyes, but I will not hijack this post, OpenBSD is my sunshine now. There will be always enough room in my heart for Mandriva, Archlinux and OpenBSD, and distros like Faildora doesn't worth their bugginess mention.
