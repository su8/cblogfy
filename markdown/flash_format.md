
---

Simple flash drive formatting to make working with other operating system easier:

```bash
# find the desired device name
lsblk -o NAME,KNAME,FSTYPE,TYPE,SIZE

# check twice before pressing Enter
sudo shred --verbose --random-source=/dev/zero --iterations=1 /dev/sdf

sudo parted -a optimal /dev/sdf
mklabel msdos
mkpart primary 1 -1
print
quit

sudo mkfs.vfat -I /dev/sdf1
```

Have to admit that I managed to reformat one external backup HDD instead the wanted usb stick few minutes ago. Now I have to find the correct `dd` command to recover all the data.

>Never hurry to press enter !
