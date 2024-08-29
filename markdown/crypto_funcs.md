
---

More shell functions to make your life easier.

But I need a "Network Manager". Bring your NIC up/down and assign some fake mac address, also remove ipv6 to make the fingerprinting harder.

Filename **network.zsh**

```bash
bHz='192.168.10'
inftz='eth0'
netmazk='24'
typeset -gA dT


netup() {
    __gen_rants

    sudo ip link set dev ${inftz} \
        address ${dT[fakemac]}

    __loop_until_ok \
        __gen_rants; \
        sudo ip link set dev ${inftz} \
            address ${dT[fakemac]}

    sudo ip link set dev ${inftz} up
    sudo ip addr add ${dT[addr]}/${netmazk} \
        broadcast ${dT[broadcast]} dev ${inftz}

    sudo ip route add default via ${dT[gateway]}
    sleep 2  # it takes some time to bring the NIC up
    sudo ip -family inet6 addr del \
        `ip a | gawk '/inet6/ {x=$2};END{print x}'` dev ${inftz}

    printf '%s\n' 'You are good to go.'

;}

netdown() {
    sudo ip addr flush dev ${inftz}
    sudo ip route flush dev ${inftz}
    sudo ip link set dev ${inftz} down

    sudo pkill dhcpcd
    sudo pkill dnsmasq
    sudo pkill dnscrypt-proxy
;}
```

Now create the file **diehard.zsh** which will hold the non-interactive functions that does all the heavy lifting:

```bash
# check the last program exit code status
# and repeat it until it exits with 0
# code meaning 'success'
__loop_until_ok() { while [[ $? != 0 ]]; do $@; done ;}

# generate random internal (local) ip
# and some fake MAC addresses
__gen_rants() {
    for x in {1..2}
    do
        gen_addr=$[RANDOM%250]
        gen_mac=$(for x in {1..6};do printf '%02x:' $[RANDOM%256];done)
        gen_mac[18]=''
    done

    dT=(
        'addr'       "${bHz}.${gen_addr}"
        'broadcast'  "${bHz}.255"
        'gateway'    "${bHz}.254"
        'fakemac'    "${gen_mac}"
    )
;}
```

LUKS related functions, filename **crypto-luks.zsh**

```bash
#---------------------------------------------
# LUKS encryption functions
#---------------------------------------------

# Create or expand LUKS encrypted file system
# within single file that will act as
# Truecrypt-like container.
# I do not wish my $USER to be able to access
# the LUKS encrypted fs. created by the function
# below, instead 'root' access is required for
# every single action. If you want to copy something
# from the encrypted fs. back to your $HOME dir and
# restore the file/folder owner, you can always `chown'
# example: chown user:group -R given_file
# This function will create LUKS encrypted file system (fs.)
# within single file with prefixed file size, you can always
# expand the file size at any time without damaging the encrypted
# data in it.
luks() {
    cd $HOME

    __am_i_null $1 && return 1

    case $1 in
        4200) # DVD disc
                local fname='cryptdvd'
                local device_name='encdvd'
                local SiZe=4200
           ;;
         690) # CD disc
                local fname='cryptcd'
                local device_name='enccd'
                local SiZe=690
           ;;
           *) # Custom size
                local fname='cryptdb'
                local device_name='encdb'
                local SiZe=$1
           ;;
    esac

    local the_mappeR="/dev/mapper/${device_name}"

    # if ${fname} exists, we assume that
    # the user wants to extend/expand it.
    if [[ -f ${fname} ]]
    then
        [[ -e ${the_mappeR} ]] && closecrypt ${device_name}

        dd if=/dev/urandom bs=1MB count=${SiZe} \
            iflag=fullblock | cat - >> ${fname}

        printf '%s\n' "Now we are going to expand ${fname}"
        __opencrypt_mini sudo cryptsetup open --type luks ${fname} ${device_name}
        sudo e2fsck -f ${the_mappeR}
        sudo resize2fs ${the_mappeR}
        sudo cryptsetup close ${device_name}

        return 0
    else
        dd if=/dev/urandom of=${fname} bs=1MB count=${SiZe} \
            iflag=fullblock conv=fsync
    fi

    # spend 50 seconds in iteration before any action
    # to take place, 50000 = 50 seconds. If anyone
    # manages to get your CD/DVD disc, they will
    # have only 1 bruteforce attempt every 50 seconds.
    sudo cryptsetup --verbose --cipher aes-xts-plain64 --key-size 512 \
        --hash sha512 --iter-time 50000 --use-random luksFormat ${fname}

    __loop_until_ok sudo cryptsetup --verbose --cipher aes-xts-plain64 --key-size 512 \
        --hash sha512 --iter-time 50000 --use-random luksFormat ${fname}

    __opencrypt_mini sudo cryptsetup open --type luks ${fname} ${device_name}
    # https://unix.stackexchange.com/questions/14010/the-merits-of-a-partitionless-filesystem/14062#14062
    sudo mkfs.ext4 ${the_mappeR}
    sudo mount -t ext4 ${the_mappeR} '/mnt'

    printf '%s\n' 'Transfer your data in /mnt, once done invoke:'
    printf '%s\n' "closecrypt ${device_name}"

    cat <<EOF > "${fname}-readme.txt"
Access your files back:

sudo cryptsetup open --type luks ${fname} ${device_name}
sudo mount -t ext4 ${the_mappeR} /mnt

sudo umount -R /mnt
sudo cryptsetup close ${device_name}
EOF
    printf '%s\n' "Created ${fname}-readme.txt"
;}


# unlock and mount partition/device
opencrypt() {
    __null_test $2

    __opencrypt_mini sudo cryptsetup open --type luks $1 ${dmnqme}
    sudo mount -t ext4 "/dev/mapper/${dmnqme}" ${_mount_point}

    unset dmnqme _mount_point
;}

# unmount and close the unlocked partition/device
closecrypt() {
    __null_test $1

    sudo umount -R ${_mount_point}
    sudo cryptsetup close ${dmnqme}

    unset dmnqme _mount_point
    clearbuff
;}
```

Requirements: Already encrypted file/device.

Usage: `opencrypt /dev/sdf root`, `closecrypt root`, `luks 800`.

Append the following functions to **diehard.zsh**

```bash
# Is the given variable empty ?
__am_i_null() {
    if [[ -z $1 ]]
    then
        printf '%s\n' 'Houston, we have a problem'
        return 0 # __am_i_null ${var} && do_empty_thing || do_non_empty_thing
    else
        return 1
    fi
;}

# crypto-luks.zsh
# determine whether the user has supplied a
# device mapper name and assign the appropriate
# string to the variable 'dmnqme' and mount point
# My boot partition is encrypted... new kernel ...
__null_test() {
    [[ ! -z $1 ]] && dmnqme="$1" || dmnqme='root'
    [[ ${dmnqme} == 'boot' ]] && _mount_point='/boot' \
        || _mount_point='/mnt'
;}


# crypto-luks.zsh
__opencrypt_mini() {
    $@
    __loop_until_ok $@
;}
```

Filename **crypto-misc.zsh**

```bash
#---------------------------------------------
# Miscellaneous encryption functions
#---------------------------------------------

# Generate new ssh key
sshgen() { ssh-keygen -t rsa -b 4096 -E sha512 -C $USER@$HOST -o -a 5000 ;}

# dns encryption
encdns() {
  set -A _srvs CUR_SERV
  source "${XDG_CONFIG_HOME}/misc/dns_servers/servers4.conf"

  # Don't touch
  _Num=$[RANDOM%${#_srvs[@]}]
  while [[ ${_Num} == 0 ]]; do _Num=$[RANDOM%${#_srvs[@]}]; done
  CUR_SERV=("${(@s/,/)_srvs[_Num]}")

  netdown
  netup
  sudo service dnsmasq restart
	sudo dnscrypt-proxy \
	--provider-key=${CUR_SERV[1]} \
	--provider-name=${CUR_SERV[2]} \
	--resolver-address=${CUR_SERV[3]}:443 \
	--local-address=127.0.0.2:53 \
	--user=nobody --daemonize
;}

# generate random password
ranp() {
  local pass_len=25 gen_pass=10

  tr -dc '[:print:]' < /dev/urandom | \
    fold --width ${pass_len} | \
      gawk '{
        for (x = 1; x < '${gen_pass}'; x++) {
          getline;
          print;
        }
        exit;
      }'
;}

# Fix the metadata leaks, some of your
# programs won't be able to "remember" anymore
fixleaks() {
    local XbeL="$XDG_DATA_HOME/recently-used.xbel"
    local gvfs_metaF="$XDG_DATA_HOME/gvfs-metadata"

    rm -rf ${gvfs_metaF}
    echo '' > ${Xbel}

    mkdir --mode=700 ${gvfs_metaF}
    chmod 600 ${Xbel}

    sudo chattr +i ${gvfs_metaF}
    sudo chattr +i ${Xbel}
;}
```

The following file serves as an example what `encdns` tries to "source":

```bash
# Source http://meo.ws/dnsrec.php

# /usr/share/dnscrypt-proxy/dnscrypt-resolvers.csv
_srvs=(
# dnscrypt-key,dnscrypt-name,address/ipv4

'1971:7C1A:C550:6C09:F09B:ACB1:1AF7:C349:6425:2676:247F:B738:1C5A:243A:C1CC:89F4,2.dnscrypt-cert.cloudns.com.au,113.20.6.2'

'25C4:E188:2915:4697:8F9C:2BBD:B6A7:AFA4:01ED:A051:0508:5D53:03E7:1928:C066:8F21,2.dnscrypt-cert.soltysiak.com,178.216.201.222'

'A45D:3F4A:2F1E:1D22:47C2:2D75:0877:5735:724E:A144:607B:26B0:76DD:F990:CDD1:1411,2.fvz-rec-jp-tk-01.dnscrypt-cert.meo.ws,106.185.41.36'

)
```

Better learn what dnscrypt-proxy is and how to configure/use it, before even thinking using it.
