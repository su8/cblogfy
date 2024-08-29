
---

We revisit the email encryption one more time.

In the first part we will talk about key creation which is the first self-defense step towards overreaching and out of control goventments/regime.

Quote from [https://www.gnupg.org](https://www.gnupg.org): Even if you have nothing to hide, using encryption helps protect the privacy of people you communicate with, and makes life difficult for bulk surveillance systems. If you do have something important to hide, you are in good company; GnuPG is one of the tools that Edward Snowden used to uncover his secrets about the NSA.

GPG is the GNU privacy guard implementation of the [OpenPGP](https://www.philzimmermann.com/EN/essays/WhyIWrotePGP.html). In order to start using GPG we have to create keypair that is known as public and private keys. The public key is used by your contacts to encrypt the emails they send to you, and for decryption your private key will be used. The public key is the one you want everyone to know about, while the private key is the one that no one should have it; except you.

Even if someone manages to get your private key, we will take some extra stepts to make the key extremly difficult to bruteforce.

Add the following environment variable in your shell configuration file to instruct GPG where to store your keypair, your $HOME directory is not (dumpster) the place where you should keep all the configuration files. There is special folder called **.config** where your programs should store their configuration files, so the chance to delete some improtant configration file will be pretty low:

```bash
export GNUPGHOME="$HOME/.config/gnupg"
```

Generate the key with the following options set as is:

```bash
gpg2 --cert-digest-algo SHA512 --cipher-algo AES256 --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 --s2k-mode 3 --s2k-count 64981052 --full-gen-key
```

Visit the [following link](https://www.gnupg.org/documentation/manuals/gnupg/OpenPGP-Options.html) to learn what these options do.

Follow the steps as shown in the below picture, and replace the input information where needed.

![](img/file/encrypted_emails2/gpg-full-gen-key.png)

Play some game, browse the internet or in other words - use your computer constantly in order GPG to generate the needed entropy.

Once your keypair is created, append the following preferences in **$HOME/.config/gnupg/gpg.conf**

```bash
Your public key goes here
default-key 0x7A923C0D83E349AE

The hash used in key signing
cert-digest-algo SHA512

default-preference-list AES256 CAMELLIA256 AES192 CAMELLIA192 AES CAMELLIA128 TWOFISH CAST5 3DES SHA512 SHA384 SHA256 SHA224 SHA1 RIPEMD160 BZIP2 ZLIB ZIP Uncompressed

a/symetic encryption prefs
personal-cipher-preferences AES256 CAMELLIA256 TWOFISH
personal-digest-preferences SHA512 SHA384 SHA256 SHA224
personal-compress-preferences BZIP2 ZLIB ZIP Uncompressed

encryption settings
cipher-algo AES256
digest-algo SHA512
s2k-cipher-algo AES256
s2k-digest-algo SHA512
s2k-mode 3
s2k-count 64981052

compression prefs
compress-algo BZIP2
compress-level 9
bzip2-compress-level 9

metadata prefs
no-emit-version
no-comments

runtime prefs
keyid-format 0xLONG
with-fingerprint
```

From now on, if you have to create another keypair just type `gpg2 --full-gen-key`, because all the options will be provided by your **gpg.conf**

Exchange the trust level of your **own** keypair:

```bash
gpg2 --edit-key groovy@baby.shaggy
trust
5
y
quit
```

If you did everything correctly, you shouldn't see **gpg: decryption failed: No secret key** whenever you try to decrypt an email or file encrypted with GPG. Having said that, file encryption is [trivial](https://github.com/wifiextender/secure_passwordless_backups/blob/master/encrypt_decrypt.zsh).

Some commands that you should learn:

```bash
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
gpg --allow-secret-key-import --import private_keyring.asc

Certificate Managers:
kgpg, seahorse, kleopatra
```

In next part we will download, compile, configure and use an email client that doesn't pinpoint you and sucks less. As you probably guessed, we will send encrypted emails too.
