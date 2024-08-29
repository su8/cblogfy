
---

I just don't get it. GPG is using the weakest as possible encryption algorithms by default.

Let's have a look what we can do about it.

It's all about the compatibility between newer and older GPG versions, but the fact that you've started using GPG means that you care about your privacy, so what's the point then ?

Your are signing all of the emails with SHA-1 which is known to be extremely weak. The signing is used to prove that you are the person that has wrote and sent that email and not someone else.

Start with changing the deault GPG preferences.

Open up `~/.gnupg/gpg.conf` as normal user and add the following at the bottom:

```
personal-digest-preferences SHA512 SHA384 SHA256 SHA224
cert-digest-algo SHA512
default-preference-list AES256 CAMELLIA256 AES192 CAMELLIA192 AES CAMELLIA128 TWOFISH CAST5 3DES SHA512 SHA384 SHA256 SHA224 SHA1 RIPEMD160 ZLIB BZIP2 ZIP Uncompressed
personal-cipher-preferences AES256 CAMELLIA256 TWOFISH
```

For signatures we've set SHA-512, note that the preferred algorithms go first. For the cipher we prefer AES256, so far we managed to get rid off the sha1 and cast5 algoritms that your keys &amp; signature are created and protected with.

We will benefit from the newer default algorithms as well. Create a new keypair, we will be using salting, strengthening and slow down if not make impossible dictionary attacks with:

```bash
gpg --cert-digest-algo SHA512 --cipher-algo AES256 --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 --s2k-mode 3 --s2k-count 64981052 --gen-key
# Choose 4096 key length
# if you ever need to edit your keys
gpg --cert-digest-algo SHA512 --cipher-algo AES256 --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 --s2k-mode 3 --s2k-count 64981052 --edit-key your@email.com
```

What is **s2k** and the values that we specified - visit the [following link](https://www.gnupg.org/documentation/manuals/gnupg/OpenPGP-Options.html). Used the highest s2k count value as possible to slow down greatly those who got managed to get your private key and are trying dictionary attack against it, so don't decrease that value.

GPG offers an option to include a photo of yourself, although it sounds 'cool' this is a two edged sword since you don't wish to be added in any [https://en.wikipedia.org/wiki/Facial_recognition_system](https://en.wikipedia.org/wiki/Facial_recognition_system) database because of the fact that you are encrypting your emails and the so famous warrantless wiretapping agencies can misunderstand your profile and target you as **extremist**, so don't ease them !

Email question from visitor: **"How to use the verification signature that comes with the archlinux iso ?"**

Answer:
![](img/file/1misc/archlinux-pgp-sig-iso.png)
