
---

Ever wanted to exapnd already encrypted LUKS container with custom size ?

Here is how to do it:

```bash
# encrypted_file.luks is your LUKS encrypted container
dd if=/dev/urandom bs=1MB count=690 iflag=fullblock | cat - >> enrcypted_file.luks
sudo cryptsetup open --type luks encrypted_file.luks encdb
sudo e2fsck -f /dev/mapper/encdb
sudo resize2fs /dev/mapper/encdb
sudo cryptsetup close encdb
```