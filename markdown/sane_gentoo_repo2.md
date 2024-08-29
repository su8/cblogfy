
---

In this post we will create a new ssh key which will be used to pull, clone and push git projects much more securely.

```bash
# Create the key
ssh-keygen -t rsa -b 4096 -C 'your@email'

# copy the output
cat ~/.ssh/id_rsa.pub

# make a copy
sudo cp -r ~/.ssh /root

# add your key
eval "$(ssh-agent -s)"
ssh-add

# Check the key
ssh-add -l -E -md5

# Test the key
ssh -T git@github.com
# Hi wifiextender! You've successfully authenticated.
```

In your GitHub profile go to the [settings], create a new SSH key and paste the public key output.

Exchange the sync-uri protocol in **/etc/portage/repos.conf/gentoo.conf**

```diff
--- 
+++ 
- sync-uri=git://github.com/gentoo-mirror/gentoo.git
+ sync-uri=git@github.com:gentoo-mirror/gentoo.git
```

Some changes to the **update** function and creating a new one:

```bash
# gentoo.zsh
source '/lib/gentoo/functions.sh'

update() {
    einfo 'Running sync' 
    __emerge --sync

    einfo 'Running emaint' 
    sudo emaint --fix cleanresume

    einfo 'Running portage update' 
    __emerge --oneshot --update portage

    einfo 'Running system update' 
    rebuild

    einfo 'Running metadata regeneration' 
    __emerge --regen --quiet

    sudo cp -r /var/cache/eix/{portage.eix,previous.eix}
    einfo 'Running eix update' 
    sudo eix-update  # eix-diff to see whats new
    eix-diff

    einfo 'Running external kernel modules rebuild' 
    __emerge '@module-rebuild'

    einfo 'Running preserved libs rebuild'
    preserved-rebuild

    einfo 'Running Reverse Dep. Rebuilder'
    revdep
;}
```

[settings]: https://github.com/settings/ssh
