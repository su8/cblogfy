
---

Despite being april 1st, we won't joke about drive encryption.

TrueCrypt is no more, and the purpose of this post is to show you straightforward partition encryption with dm-crypt luks.

DM-Crypt is transparent drive encryption that is kernel module and part of the device mapper framework for mapping physical block device onto higher-level virtual block devices, it uses cryptographic routines from the kernel's crypto api. Long story short, device mapping encryption provided by the kernel "linux" crypto api.

Make sure that you have **at least** one partition with no data in it. If you don't have any partitions available, use parted, gparted or whatever program you like to shrink some of your existing partitions and create a new one.

I'll use partition called `/dev/sda3`, and our first task will be to overwrite that partition 3 times with random data, that's enough to protect you against forensic investigation. It took me nearly 30 minutes for 20 GB partition to be overwritten 3 times.

```bash
shred --verbose --random-source=/dev/urandom --iterations=3 /dev/sda3
```

Create cryptographic device mapper device in LUKS encryption mode:

```bash
cryptsetup --verbose --cipher aes-xts-plain64 --key-size 512 --hash sha512 --iter-time 5000 --use-random luksFormat /dev/sda3
```

You'll be asked the following question:

```
WARNING!
========
This will overwrite data on /dev/sda3 irrevocably.

Are you sure? (Type uppercase yes): YES
Enter passphrase:
Verify passphrase:
Command successful
```

Unlock the partition, here **"root"** is device mapper name, think of it as label.

```bash
cryptsetup open --type luks /dev/sda3 root
```

We have to create filesystem in order to write encrypted data that would be accessible through the device mapper name (label).

```bash
mkfs.ext4 /dev/mapper/root
```

Mount the device and transfer all of your data:

```bash
mount -t ext4 /dev/mapper/root /mnt
```

Unmount and close the device once you are done:

```bash
umount /mnt
cryptsetup close root
```

Last but not least, clear the copy and cache buffers:

```bash
sysctl --write vm.drop_caches=3
```

That was it, simple and straightforward encryption. From now on all you have to do is: unlock, mount, transfer data, unmount and close the device.

If you have couple hours to spare and experiment, feel free to read those pages:

[link 1](http://crunchbang.org/forums/viewtopic.php?id=24722)

[link 2](https://bbs.archlinux.org/viewtopic.php?pid=943338)

[link 3](https://wiki.archlinux.org/index.php/Dm-crypt/Device_encryption)

[link 4](https://wiki.archlinux.org/index.php/Dm-crypt)

[link 5](https://wiki.gentoo.org/wiki/DM-Crypt_LUKS)

[link 6](https://wiki.gentoo.org/wiki/Dm-crypt)

[link 7](https://help.ubuntu.com/community/EncryptedFilesystemHowto)

Protect your **/boot** partition if you want full disk encryption. Everything is written in great details how to do it in the above links.

Post edit: The things get even better as I just learnt that it is possible to burn LUKS encrypted CD and DVD discs.

Instead using drive partition, we will create a file via **dd** and the kernel's random number generator **/dev/urandom** that will fill the initial file with entropy.

Create 500MB file that will be used as file system within a single file.

```bash
dd if=/dev/urandom of=encrypted.volume bs=1MB count=500
```

Just replace the first command in this post **(shred)** with the **dd** one and type the rest commands as is.

Now you can be sure that no one will get past your data that it is burn within the single file which is entire file system in LUKS encryption, just make sure to unmount and close **encrypted.volume** before burning it to the disc.
