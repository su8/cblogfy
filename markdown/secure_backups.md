
---

How can you create a secure passwordless backup ?

Is it possible to use your public/private keys that you generated one month ago by following the Thunderbird email encryption post ?

Thankfully, GPG once again shows it's strength. And yes, you can create a passwordless backup with gpg by using your public key and for decryption the private key will be required.

Firstable you should manually verify or change the trust level of your own key.

![](img/file/1misc/gpg-trust-key.png)

And here is another gpg based program written by me. GUI version is waiting to be written by you, so roll up your sleeves and get it done to handle multiple and single folders, multiple and single files. Please notice the **pub** acronym while listing the keys, this is your own and unique public key ID.

```python
#!/usr/bin/env python3
import os
from sys import argv
from subprocess import call

class Backup(object):

    def __init__(self, obj):
        given_obj = (obj if not obj.endswith(os.sep) else obj[:-1])
        pub_key = 'D747A316'  # type gpg --list-keys and replace this one

        self.encrypt(given_obj, pub_key)

    def encrypt(self, obj, key):
        if os.path.isfile(obj):
            call('gpg --hidden-recipient {pub_key_id} \
                    --encrypt "{obj_to_encrypt}"'
                        .format(
                            pub_key_id=key, obj_to_encrypt=obj), shell=True)
        else:
            call(
                'XZ_OPT=-9e tar cJf - -C "{dir}" . | \
                    gpg -z 9 --batch --yes --encrypt \
                    --hidden-recipient {pub_key_id} --output "{encrypted_file}"'
                        .format(dir=obj, pub_key_id=key,
                            encrypted_file=obj + '.tar.xz.gpg'), shell=True)

if __name__ == '__main__':
    Backup(''.join(argv[1:]))
```

Usage - save it with some name.py then: python2 name.py '/path/to/folder' or python3 name.py '/path/to/file'

Decrypt tha backup with `gpg mybackup.gpg`

Transfer the gpg encrypted backups with ssh, scp, sftp or other favourite tool and be sure that no one will be able to decrypt them. Just don't lose your private key.
