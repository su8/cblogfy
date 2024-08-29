
---

When I moved to Gentoo back in August 2015, there wasn't a way to keep your system up-to-date by using the Gentoo GitHub mirrors, as they was primarely for it's developers.

After writing up my previous post (and updating portage to version 2.2.28) I found out that there is a user-wide portage mirror on GitHub.

Up until now the only two ways to "speed up" portage was [squashing] it and using [sqlite] cache.

By using Git (not GitHub), we finally have delta compression which eliminates the "hacks" that we had to use.

Without too much thinking I switched to the GitHub repository & synced.

![](img/file/gentoo_repo/mirror.png)

Once I ran `du -sh .` afterwards, I saw 1GB off of my SSD usage.

Now the **update** function from my previous post takes no more than 20 seconds to complete. R.I.P rsync and old overlays.

Here is what I did. Created the **/etc/portage/repos.conf/** dir, then ~~moved my old gentoo.conf~~ created a new **gentoo.conf** file in this dir with the following content:

```ini
[DEFAULT]
main-repo=gentoo

[gentoo]
location=/usr/portage
sync-type=git
sync-uri=git://github.com/gentoo-mirror/gentoo.git
auto-sync=yes
sync-depth=1
```

Type the sync-uri as is, found out that "nothing have changed" when I used https protocol instead git.

Instruct `eix` to use the already generated `emerge --regen` cache by editing **/etc/eixrc/00-eixrc**:

```bash
OVERLAY_CACHE_METHOD="assign"
```

The only thing I cared was the distfiles, so I backed them up, synced the new GitHub portage tree and ran the update function:

```bash
sudo mv /usr/portage /usr/portage.old
sudo emerge --sync
sudo mv /usr/portage.old/distfiles /usr/portage/
update
# nuke /usr/portage.old
```

For those of you demanding more security checks, GitHub supports [GPG] signed commits.

I don't think that I'll ever go back and use any rsync mirror.

[squashing]: https://wiki.gentoo.org/wiki/SquashFS#External_resources
[sqlite]: http://gentoo-en.vfose.ru/wiki/Portage_SQLite_Cache
[GPG]: https://github.com/blog/2144-gpg-signature-verification
