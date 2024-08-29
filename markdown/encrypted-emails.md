
---

I would like to make an announcement about my fifth Linux From Scratch installation.

This time I tried to install it for record breaking time and I did it in range of two and half days - without sleeping at all. LFS makes the Gentoo installation a walk in the park.

If you are gnu/linux enthusiast and haven't done at least one LFS installation, I will recommend you to not hurry with the installation process since it's so easy to burn out and give up because the whole process is really exhausting and you'll have to follow everything that is written in their book.

The next challege in my list is: Beyond Linux From Scratch

Okay, lets move to the email encryption. I assume that you have installed **Thunderbird**, **gnupg2** and some **game**

Generate a key pair (public and private keys) from the command line, because in case of error you'll be more likely to see it there instead in crashed GUI application. Type `gpg --gen-key` and follow the pictures:

![](img/file/encrypted_emails/gpg-gen-key.png)

![](img/file/encrypted_emails/gpg-gen-key1.png)

![](img/file/encrypted_emails/gpg-gen-key2.png)

![](img/file/encrypted_emails/gpg-gen-key3.png)

![](img/file/encrypted_emails/gpg-gen-key4.png)

![](img/file/encrypted_emails/gpg-gen-key5.png)

![](img/file/encrypted_emails/gpg-gen-key6.png)

Start some game and play it, in my case I played Red Eclipse.

![](img/file/encrypted_emails/gpg-gen-key7.png)

Open up Thunderbind. By default, Thunderbird has hidden the menu bar so we will have to make it visible. Right click below your window title and enable the menu bar option. 

![](img/file/encrypted_emails/menu-bar.png)

Prefer plain text over HTML and never use PGP/MIME or S/MIME. Why you should not use them - read the information in this website [https://futureboy.us/pgp.html](https://futureboy.us/pgp.html)

![](img/file/encrypted_emails/message-body-plain-text.png)

Enable phishing protection - also known as **email scams**. Edit -> Preferences -> Security -> Email Scams

![](img/file/encrypted_emails/email-scams.png)

This is a email client, so we don't actually need cookies.

![](img/file/encrypted_emails/accept-cookies.png)

Install the Enigmail addon: Tools -> Add-ons

![](img/file/encrypted_emails/install-enigmail.png)

Once installed, it will ask you to restart the bird, do it and verify that OpenPGP is listed in the menu bar after that.

![](img/file/encrypted_emails/openpgp-in-menu-bar.png)

Click over the OpenPGP and select Setup Wizard

![](img/file/encrypted_emails/openpgp-setup-wizard.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-1.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-2.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-3.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-4.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-5.png)

![](img/file/encrypted_emails/openpgp-setup-wizard-6.png)

In case of multiple accounts, repeat those steps for each one.

It's time to exchange your public keys with others, before doing this I would recommend you to experiment with a second email account or alias.

Write some random email to the second email address and:

![](img/file/encrypted_emails/exchange-pub-keys.png)

![](img/file/encrypted_emails/exchange-pub-keys1.png)

Once the email is received in your other email account, make sure to - sign and encrypt the message and attach your public key for first time.

![](img/file/encrypted_emails/exchange-pub-keys3.png)

![](img/file/encrypted_emails/exchange-pub-keys4.png)

In order to read the encrypted email reply, you will have to enter your passphrase. After that import the sender's public key.

![](img/file/encrypted_emails/exchange-pub-keys5.png)

![](img/file/encrypted_emails/keys-exchanged.png)

![](img/file/encrypted_emails/keys-exchanged1.png)

![](img/file/encrypted_emails/exchange-pub-keys6.png)

Change the trust settings for the sender's public key, notice the blue background and how it will be changed with a green one.

![](img/file/encrypted_emails/exchange-pub-keys7.png)

![](img/file/encrypted_emails/exchange-pub-keys8.png)

The last picture demonstrates how to check the email source and see that the email is really encrypted.

If you want to send and receive encrypted emails from your alias, click over Edit and select Account Settings

![](img/file/encrypted_emails/add-alias.png)

![](img/file/encrypted_emails/add-alias-1.png)

Click **add**

![](img/file/encrypted_emails/add-alias-2.png)

In the **Settings** tab fill your Real Name and alias email address

![](img/file/encrypted_emails/add-alias-3.png)

![](img/file/encrypted_emails/add-alias-4.png)

Some commands that you should know:

Generate a key pair

```bash
gpg --gen-key

List keys
gpg --list-keys

Export my private/public keys by using my email address
gpg --export --armor --output my_pub_key.asc user@email.com
gpg --export-secret-keys --armor --output my_private_key.asc user@email.com

Export my whole private/public keyring
gpg --export --armor --output pub_keyring.asc
gpg --export-secret-keys --armor --output private_keyring.asc

When importing a key, first import the public key then the secret one.
gpg --import pub_keyring.asc

Certificate Managers:
kgpg, seahorse, kleopatra
```
