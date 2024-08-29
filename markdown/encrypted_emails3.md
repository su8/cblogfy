
---

From the previous part we learned how to create a keypair and gpg configuration file.

The last email encryption part will cover the installation and usage of an text based email client called Mutt.

The GUI programs tend to remove the learning curve, and oftentimes the people refuse to switch and use something else because all other alternatives **sucks**. The alternatives sucks because they doesn't meet their needs and are lazy enough to spend some time and learn the alternative properly to meet those needs.

With Mutt you are the one that controls the program and not the otherwise. You have to create a configuration file to instruct Mutt how to work properly. And yes, you can turn in into a full-fledged replacement for your current email client. At the end you'll have better understanding how the electronic mail process works, and you can be pride that you have became a power-user that is not affraid to get their hands dirty.

Feel free to borrow my Mutt [configs](https://github.com/wifiextender/dotfiles/tree/master/archlinux-openbsd/home/frost/.config/mutt) and learn what they do. Exchange the information where needed to fit your needs. You'll have to download my whole dotfiles repository, later on you can borrow other configration files not related to Mutt to tailor your needs or use them as starting point.

Explore how you authenticate with your email provider and how you send emails. Protocol hints: IMAP, SMTP, POP3. Adjust those details in the configration files.

I've split the configuration among several files to make the maintenance process easier, and the variables that have to remain secret are encrypted with GPG. There are plenty of themes to make Mutt eyecandy, and all of that is compressed in archive and sourced on-the-fly.

In order this post to stay relevant when the installation process changes, I will point you a [link](https://projects.archlinux.org/svntogit/packages.git/tree/trunk?h=packages/mutt) that will guide you how to download, compile and install Mutt if you want to verify with your eyes that there are no strings attached. Alternatively, if your distribution is binary and you trust the packagers, you can install Mutt with a single command from your package manager.

If you are Arch Linux user, you can use ABS:

```bash
pacman -S abs fakeroot
abs
cp -r /var/abs/extra/mutt /tmp && cd /tmp/mutt
makepkg --clean --install --force --syncdeps
```

Once you configured Mutt to work properly, it is time to show you how to send encrypted emails and how to operate Mutt with your keyboard.

To compose an email press `m`

![](img/file/mutt_encryption/create_a_new_email.png)

Fill the message body with an text editor (vim) that is specified with the **set editor** variable (formats config file).

![](img/file/mutt_encryption/write_message_body.png)

To attach a file press `a` and you'll be asked to enter the file location manually, after that press `p` to bring the encryption menu, then press `b` to sign and encrypt the message, and `y` to send it

![](img/file/mutt_encryption/attach_pubkey_as_file.png)

You can attach a public key manually as file or press `Escape-k` and leave mutt deal with that:

![](img/file/mutt_encryption/attach_pubkey.png)

The recipient will have to decrypt the email with their private/secret key in order to read it

![](img/file/mutt_encryption/enter_pass_to_decrypt_email.png)

And they will see the email content

![](img/file/mutt_encryption/decrypted_email.png)

To save the attachments press `v` to view them and `s` to save the desired attachment

![](img/file/mutt_encryption/view_and_save_attachments.png)

Mark email for deletion with `d`, undo mark deletion; jump to email by it's number and press `SHIFT-w` afterwards press `d`, if you press `w` (without shift-w) you can set different flag such as delete, new, read etc.

![](img/file/mutt_encryption/set_flag.png)

Where are Sent, Drafts, Trash folders ? Press `c-?` (c shift /)

![](img/file/mutt_encryption/change_folder.png)

Return to your inbox with `y`

![](img/file/mutt_encryption/return_to_inbox.png)

Whenever you stuck, just type `?` (shift /) to issue the help documentation.

And [this](img/file/mutt_encryption/the_encrypted_mail) is what the encrypted email looks like when someone gets a copy of it while it travels around the world until it reaches the recipient inbox.
