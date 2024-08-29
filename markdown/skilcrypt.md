
---

# skilcrypt

Three file-based encryption scripts utilizing GPG. skilcrypt-looper and skilcrypt-daemon are trying to mimic EncFS, while the skilcrypt script is the most simplistic of the three and requires manual operation all the time, [Github page](https://github.com/su8/skilcrypt).

GPG can be installed in most major operating systems, thus you will be able encrypt and decrypt your files no matter what OS or GPG program/port you've used.

`skilcrypt` script.

```bash
#!/usr/bin/env bash

# Copyright 03/19/2016 https://github.com/su8

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

__printf() { printf '%s\n' "$@" ;}

__skilcrypt_rmcmd() {
    _switch_opt="$1"
    shift

    find "$@" -type f ${_switch_opt} -name "*.gpg" -print0 | xargs -0 rm --force

    __printf 'Done !'
}

__skilcrypt_invoke_gpg() {
    _da_action=$1
    shift

    [[ $1 == "pwf" ]] && {
        shift

        _da_pazZz=$1
        [[ ! -f ${_da_pazZz} ]] && {
            __printf "Ooops, ${_da_pazZz} doesnt exist."
            __printf 'Point the correct location of your password.'
            return
        }

        _pw_switch='--passphrase-file'
        shift

    } || {
        while [[ -z ${_da_pazZz} ]]
        do
            __printf "Enter your password to ${_da_action} your files."
            __printf 'Make sure that you remember your password !'
            read -s -r _da_pazZz
        done

        _pw_switch='--passphrase'
    }

    __printf 'Working... please wait'

    [[ ${_da_action} == "encrypt" ]] && {
        find "$@" -type f ! -name "*.gpg" -print0 | xargs -0 -I{} \
            gpg --batch --quiet ${_pw_switch} ${_da_pazZz} \
            --cert-digest-algo SHA512 --cipher-algo AES256 \
            --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 \
            --s2k-mode 3 --s2k-count 64981052 --compress-algo 0 --symmetric {}
    } || {
        find "$@" -type f -name "*.gpg" -print0 | xargs -0 -I{} \
            gpg --batch --quiet ${_pw_switch} ${_da_pazZz} {}
    }

    __printf 'Done !'

    unset _da_pazZz
}

skilcrypt_main() {
    declare -a _targets
    _targets=('encrypt' 'decrypt' 'rmsrc' 'rmgpg')
    [[ -z $1 ]] || [[ ! " ${_targets[@]} " =~ " $1 " ]] && {
        __printf 'skilcrypt [option] target(s)'
        __printf 'Available options: encrypt [pwf], decrypt [pwf], rmsrc, rmgpg'
        __printf ''
        __printf 'Non-interactive (password stored in file) encryption/decryption:'
        __printf 'skilcrypt encrypt/decrypt pwf /tmp/password file1 file2 folder3'
        __printf ''
        __printf 'Interactive (ask for password) encryption/decryption:'
        __printf 'skilcrypt encrypt/decrypt file1 file2 folder3'
        __printf ''
        __printf 'Think before you invoke the rmsrc and rmgpg options !'
        __printf 'rmsrc  --  remove the source files and leave only the encrypted one'
        __printf 'rmgpg  --  remove the encrypted files and leave only the source one'
        return
    }

    [[ -z $2 ]] && {
        __printf 'The target(s) cannot be empty.'
        return
    }

    [[ $2 == "pwf" ]] && {
        [[ -z $3 ]] || [[ ! -f $3 ]] && {
            __printf 'Point the correct location of your password.'
            return
        }

        [[ -z $4 ]] && {
            __printf "What are we going to $1 ?"
            return
        }
    }

    _sw_opt=$1
    shift

    case ${_sw_opt} in
        encrypt)     __skilcrypt_invoke_gpg   'encrypt'   "$@"      ;;
        decrypt)     __skilcrypt_invoke_gpg   'decrypt'   "$@"      ;;
        rmsrc)       __skilcrypt_rmcmd        '!'         "$@"      ;;
        rmgpg)       __skilcrypt_rmcmd        ''          "$@"      ;;
    esac

}

skilcrypt_main "$@"
```


# skilcrypt-looper (tries to mimic EncFS)
This script basically tries to mimic EncFS by mirroring your files from $DECRYPTED_FILES directory into $ENCRYPTED_FILES directory where they become encrypted. In order the script to know when and which file is added/removed/changed it uses dead simple database.

You can work on a project and only the files that you've changed will be re-encrypted. This way your $ENCRYPTED_FILES dir. can be in constant sync. with some "cloud" or external device/hdd/flash drive.

That's how I wrote this script. It was developed entirely in my $DECRYPTED_FILES dir. and whenever I saved it in vim, the script was automatically mirrored and re-encrypted in $ENCRYPTED_FILES dir. which on the other hand is Google Drive WebDAV folder.

Whenever $ENCRYPTED_FILES or $DECRYPTED_FILES directory become empty, the script will mirror and decrypt or encrypt the files from the one folder into the other, just make sure that you've supplied the correct GPG password for file decryption if $DECRYPTED_FILES is empty, but $ENCRYPTED_FILES has files in it.

This script is much more cpu and disk intensive than the daemon.

`skilcrypt-looper` script:

```bash
#!/usr/bin/env bash

# Copyright 03/26/2016 https://github.com/su8

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

# Adjust those variables
DECRYPTED_FILES="$HOME/Documents/Private"
ENCRYPTED_FILES="$HOME/encrypted_files"
PASSWORD_FILE='/tmp/pws'
SKILCRYPT_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
FILE_TO_TRACK_CHANGES="${SKILCRYPT_HOME}"/skilcrypt/file_db


### Don't touch anything below this line ###
[[ ! -d "${DECRYPTED_FILES}" ]] && mkdir --parents --mode=700 "${DECRYPTED_FILES}"
[[ ! -d "${ENCRYPTED_FILES}" ]] && mkdir --parents --mode=700 "${ENCRYPTED_FILES}"
[[ ! -d "${FILE_TO_TRACK_CHANGES}" ]] && \
    mkdir --parents --mode=700 "${FILE_TO_TRACK_CHANGES%/*}"
[[ ! -f "${PASSWORD_FILE}" ]] && { printf '%s\n' 'Missing password file'; exit 1 ;}

declare -a _check_lockfile_db1
declare -a _check_lockfile_db2
declare -a _file_in_copy_arr
declare -a _check_filez_two
declare -a _check_filez
declare -a _new_size
declare -a _fdb_arr

_fdb="${FILE_TO_TRACK_CHANGES}"
_fdb_two="${_fdb}".bak

IFS=$'\n'

__is_file_in_copy() {
    for y in {1..5}
    do
        sleep 1
        _file_in_copy_arr[${y}]=$(date -r "${2}" +%F%R%S)
    done

    [[ "${1}" == 'db1' ]] && _check_lockfile_db1=("${_file_in_copy_arr[@]}") || \
        _check_lockfile_db2=("${_file_in_copy_arr[@]}")
}

__refresh_db() {

    [[ -f "${_fdb}" ]] && {
        cp -r "${_fdb}" "${_fdb_two}"
        first_init='nope'
    }

    find "${DECRYPTED_FILES}" -type f ! -name "*.gpg" | {
        while read x
        do
            echo "${x};`stat -c %s ${x}`" >> "${_fdb}"
        done

        [[ ! -z "${first_init}" ]] && {
            diff -Nwaur "${_fdb}" "${_fdb_two}" | \
                gawk '/^+/ {if (NR > 3) {gsub("+",""); print $0 }}' >> "${_fdb}"
            sort --field-separator=';' --key=1,1 --unique "${_fdb}" --output="${_fdb}".temp
            mv "${_fdb}".temp "${_fdb}"
        }
    }
}

while true
do

    _check_filez=(`find "${ENCRYPTED_FILES}" -type f -name "*.gpg"`)
    [[ -z "${_check_filez[@]}" ]] && {
        find "${DECRYPTED_FILES}" -type f ! -name "*.gpg" | {
            while read x
            do
                [[ ! -f "${x}" ]] && continue

                _new_place="${x/${DECRYPTED_FILES}/${ENCRYPTED_FILES}}"
                [[ ! -d "${_new_place%/*}" ]] && mkdir --parents --mode=700 "${_new_place%/*}"

                gpg --batch --quiet --yes --passphrase-file "${PASSWORD_FILE}" \
                --cert-digest-algo SHA512 --cipher-algo AES256 \
                --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 \
                --s2k-mode 3 --s2k-count 64981052 --compress-algo 0 \
                 --output "${_new_place}".gpg --symmetric "${x}"
            done

            __refresh_db
        }
    }

    _check_filez_two=(`find "${DECRYPTED_FILES}" -type f ! -name "*.gpg"`)
    [[ -z "${_check_filez_two[@]}" ]] && [[ ! -z "${_check_filez[@]}" ]] && {
        find "${ENCRYPTED_FILES}" -type f -name "*.gpg" | {
            while read x
            do
                [[ ! -f "${x}" ]] && continue

                _new_place="${x/${ENCRYPTED_FILES}/${DECRYPTED_FILES}}"
                [[ ! -d "${_new_place%/*}" ]] && mkdir --parents --mode=700 "${_new_place%/*}"

                gpg --batch --quiet --yes --passphrase-file "${PASSWORD_FILE}" \
                    --output "${_new_place%.gpg}" "${x}"
            done

            __refresh_db
        }
    }

    [[ ! -f "${_fdb}" ]] && {
        __refresh_db
        sleep 1
        continue
    } || __refresh_db

    _fdb_arr=(`<${_fdb}`)

    for z in "${_fdb_arr[@]}"
    do
        x="${z%;*}"
        str_to_delete="${z//\//\\\/}"     # / to \/
        _new_place="${x/${DECRYPTED_FILES}/${ENCRYPTED_FILES}}"

        _lock_file="${x//\//.}"
        _lock_file="/tmp/${_lock_file// /.}-lock"

        [[ ! -f "${x}" ]] && {
            rm -rf "${_new_place}".gpg
            sed -i "/${str_to_delete}/d" "${_fdb}"
            [[ -f "${_lock_file}" ]]  && rm -rf "${_lock_file}"
            continue
        }

        _da_size_in_db="${z##*;}"
        _da_size_now="$(stat -c %s ${x})"

        [[ "${_da_size_in_db}" != "${_da_size_now}" ]] && {
            touch "${_lock_file}"

            __is_file_in_copy 'db1'  "${x}"
            __is_file_in_copy 'db2'  "${x}"

            [[ " ${_check_lockfile_db1[@]} " =~ " ${_check_lockfile_db2[@]} " ]] \
                && {
                    rm -rf "${_lock_file}"
                    sed -i "\$a${x};`stat -c %s ${x}`" "${_fdb}"
                    sed -i "s|${x};${_da_size_in_db}|${x};`stat -c %s ${x}`|g" "${_fdb}"
                } || continue

        } || [[ ! -f "${_new_place}".gpg ]] && [[ ! -f "${_lock_file}" ]] && {

            for y in {1..5}
            do
                sleep 0.2
                _new_size[${y}]=$(stat -c %s "${x}")
            done

            [[ ! " ${_new_size[@]} " =~ " ${_da_size_now} " ]] && {
                touch "${_lock_file}"
                continue
            }

            [[ ! -d "${_new_place%/*}" ]] && mkdir --parents --mode=700 "${_new_place%/*}"

            gpg --batch --quiet --yes --passphrase-file "${PASSWORD_FILE}" \
            --cert-digest-algo SHA512 --cipher-algo AES256 \
            --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 \
            --s2k-mode 3 --s2k-count 64981052 --compress-algo 0 \
             --output "${_new_place}".gpg --symmetric "${x}"

            [[ $? == 0 ]] && [[ " ${_new_size[@]} " =~ " `stat -c %s ${x}` " ]] && {
                sed -i "\$a${x};`stat -c %s ${x}`" "${_fdb}"
                sed -i "s|${x};${_da_size_in_db}|${x};`stat -c %s ${x}`|g" "${_fdb}"
            }
        }

    done

    sleep 1

done
unset PASSWORD_FILE
unset IFS
```

# skilcrypt-daemon (inspired by EncFS)
This fellow is suitable if you constantly edit & save files and want them to be automatically encrypted and ready for transfer A.S.A.P.

Whenever files (not ending with **.gpg**) are put inside the $SOURCE_FILES folder, they will be encrypted instantly in the background without your interaction, just make sure that you've edited the variable $PASSWORD_FILE. Please use the [diceware](https://en.wikipedia.org/wiki/Diceware) method for creating passwords.

The script will run in infinite loop, it's resource friendly don't worry.

`skilcrypt-daemon` script:

```bash
#!/usr/bin/env bash

# Copyright 03/20/2016 https://github.com/su8

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.


# Adjust those variables
SOURCE_FILES="$HOME/encrypted_cloud"
PASSWORD_FILE='/tmp/pws'


### Don't touch anything below this line ###
[[ ! -d "${SOURCE_FILES}" ]] && mkdir --mode=700 "${SOURCE_FILES}"
[[ ! -f "${PASSWORD_FILE}" ]] && { printf '%s\n' 'Missing password file'; exit 1 ;}
declare -a _check_lockfile_db1
declare -a _check_lockfile_db2
declare -a _file_in_copy_arr
declare -a _check_filez
declare -a _new_size


__is_file_in_copy() {
    for y in {1..5}
    do
        sleep 1
        _file_in_copy_arr[${y}]=$(date -r "${2}" +%F%R%S)
    done

    [[ "${1}" == 'db1' ]] && _check_lockfile_db1=("${_file_in_copy_arr[@]}") || \
        _check_lockfile_db2=("${_file_in_copy_arr[@]}")
}

while true
do
    _check_filez=(`find "${SOURCE_FILES}" -type f ! -name "*.gpg"`)

    [[ ! -z "${_check_filez[@]}" ]] && {

        find "${SOURCE_FILES}" -type f ! -name "*.gpg" | {
            while read x
            do
                #x="${x/\/}"

                _lock_file="${x//\//.}"
                _lock_file="/tmp/${_lock_file// /.}-lock"

                # Deleted files -> catch 'em
                [[ ! -f "${x}" ]] && continue
                [[ -f "${_lock_file}" ]] && [[ ! -f "${x}" ]] && rm -rf "${_lock_file}"

                # Process the catched in-copy file
                [[ -f "${_lock_file}" ]] && {
                    __is_file_in_copy 'db1'  "${x}"
                    __is_file_in_copy 'db2'  "${x}"

                    [[ " ${_check_lockfile_db1[@]} " =~ " ${_check_lockfile_db2[@]} " ]] \
                        && rm -rf "${_lock_file}" || continue
                } || {

                    _orig_size=$(stat -c %s "${x}")

                    # Is ${x} in-copy progress ?
                    for z in {1..5}
                    do
                        sleep 0.2
                        _new_size[${z}]=$(stat -c %s "${x}")
                    done

                    [[ ! " ${_new_size[@]} " =~ " ${_orig_size} " ]] && {
                        touch "${_lock_file}"
                        continue
                    }

                    gpg --batch --quiet --yes --passphrase-file "${PASSWORD_FILE}" \
                    --cert-digest-algo SHA512 --cipher-algo AES256 \
                    --digest-algo SHA512 --s2k-cipher-algo AES256 --s2k-digest-algo SHA512 \
                    --s2k-mode 3 --s2k-count 64981052 --compress-algo 0 --symmetric "${x}"

                    rm -rf "${x}"
                }

            done
        }
    }

    # Be resource friendly
    sleep 2

done
unset PASSWORD_FILE
```

[EncFS](https://defuse.ca/audits/encfs.htm) is pretty much out of the game.