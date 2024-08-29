
---

Pick the language you are most familiar with and you can extend Thunar the way you want to via plugins.

In this post I'll show you my compression and extraction functions that use nothing, but the shell itself. For the fun I'll use python to create and extract zip archives instead installing moar dependecies such as zip, unzip, thunar-archive-plugin, xarchiver/file-roller/ark.

Let's start with the compression functions.

Filename **compress.zsh**:

```bash
compresstar() { tar --verbose --dereference --create --file\
                 `basename $1`.tar "$@" ;}
compressxz()  { compresstar "$@"
                 xz --verbose --force -9 --extreme `basename $1.tar` ;}
compressgz()  { compresstar "$@"
                 __run_parallel pigz gzip $1 ;}
compressbz()  { compresstar "$@"
                 __run_parallel lbzip2 bzip2 $1 ;}
compresslz()  { compresstar "$@"
                 xz --verbose --force -9 --extreme \
                    --format=lzma `basename $1.tar` ;}
compresslz4() { compresstar "$@"
                 lz4 -vf9 `basename $1.tar`
                 rm `basename $1.tar` ;}
compresslzo() { compresstar "$@"
                 lzop --verbose --force -9 `basename $1.tar`
                 rm `basename $1.tar` ;}
compresslrz() { compresstar "$@"
                 lrzip --verbose --force -f -L 9 `basename $1.tar`
                 rm `basename $1.tar` }
compress7z()  { 7za a -mx=9 `basename $1`.7z "$@" ;}
compresszip() {
    python2 -c"import os;from zipfile import ZipFile,ZIP_DEFLATED;
ufo_obj='"$1"'.split(' ');the_list=list();path_join=os.path.join;
norm='\033[0m';blue='\033[1;94m';magenta='\033[1;95m';
def zip_filez():
  with ZipFile(os.path.basename(ufo_obj[0])+'.zip','a',ZIP_DEFLATED) as archive:
    [archive.write(x) for x in the_list];
    for x in the_list:
      x=(x if not x.startswith(os.sep) else x.replace(os.sep,str(),1));
      print(' {0}adding{1}: {2}{3}{1}'.format(magenta,norm,blue,x));
for x in ufo_obj:
  if os.path.isdir(x):
    for root,_,files in os.walk(x):
      for z in files:
         the_list.append(path_join(root,z));
  else:  the_list.append(x);
zip_filez();"
;}
```

Extraction function.

Filename **extract.zsh**:

```bash
extract() {
  for xXx in "$@"
  do
    if [[ -f $xXx ]]
    then
      # --bzip2, --gzip, --xz, --lzma, --lzop
      # are 'long' `tar' options standing for:
      # extract the archive and filter it
      # through program --xxx
      case $xXx in
         *.tar.bz2) __fucktard $xXx  --bzip2          ;;
         *.bz2)     __fucktard $xXx  bz2-orig         ;;
         *.t[zb]?*) __fucktard $xXx  --bzip2          ;;
         *.tar.gz)  __fucktard $xXx  --gzip           ;;
         *.gz)      __fucktard $xXx  gz-orig          ;;
         *.t[ag]z)  __fucktard $xXx  --gzip           ;;
         *.tz)      __fucktard $xXx  --gzip           ;;
         *.tar.xz)  __fucktard $xXx  --xz             ;;
         *.xz)      __fucktard $xXx  xz-orig          ;;
         *.txz)     __fucktard $xXx  --xz             ;;
         *.tpxz)    __fucktard $xXx  --xz             ;;
         *.lzma)    __fucktard $xXx  --lzma           ;;
         *.tlz)     __fucktard $xXx  --lzma           ;;
         *.tar)     __fucktard $xXx  tar-orig         ;;
         *.rar)     __fucktard $xXx  rar-orig         ;;
         *.zip)     __fucktard $xXx  zip-orig         ;;
         *.xpi)     __fucktard $xXx  zip-orig         ;;
         *.lz4)     __fucktard $xXx  lz4-orig         ;;
         *.lrz)     __fucktard $xXx  lrz-orig         ;;
         *.tar.lzo) __fucktard $xXx  --lzop           ;;
         *.lzo)     __fucktard $xXx  lzo-orig         ;;
         *.Z)       uncompress $xXx                   ;;
         *.7z)      __fucktard $xXx  seven_zip        ;;
         *.exe)     cabextract $xXx                   ;;
         *)                                           ;;
      esac
    fi
  done
  unset xXx
;}
```

Non-interactive functions that does most of the heavy work.

Filename **diehard.zsh**:

```bash
# compress.zsh
# pixz does not show any benefits
# pbzip2 is twice slower than lbzip2
__run_parallel() {
    [[ -x "$(command -v $1)" ]] && local comp_prog=$1 \
        || local comp_prog=$2

    ${comp_prog} --verbose --force -9 `basename $3.tar`
;}


# extract.zsh
# The extraction function that does
# all the heavy lifting by using steroids
# and several other prohibited substances
__fucktard() {
    [[ "$(dirname $1)" == "." ]] && local dir_name="${PWD}" \
        || local dir_name="$(dirname $1)"

    local f_name="$(basename $1)"
    local temp_one="$(mktemp --directory --tmpdir XXXXXXX)"
    local temp_two="$(mktemp --directory --tmpdir=${temp_one} XXXXXXX)"

    mv $1 "${temp_two}" && cd "${temp_two}"

    case $2 in
        bz2-orig)  bunzip2 --verbose "${f_name}"              ;;
        gz-orig)   gunzip  --verbose "${f_name}"              ;;
        xz-orig)   unxz    --verbose "${f_name}"              ;;
        zip-orig)  python2 -c"from zipfile import ZipFile;
with ZipFile('"${f_name}"', 'r') as archive:
    print('\n'.join(' \033[1;95mextracted\033[0m: \033[1;94m{0}\033[0m'.format(x.filename)\
    for x in archive.infolist()));archive.extractall()"       ;;
        seven_zip) 7z x "${f_name}"                           ;;
        rar-orig)  unrar x "${f_name}"                        ;;
        lzop-orig) lzop --verbose --extract "${f_name}"       ;;
        lrz-orig)  lrzuntar -v "${f_name}"                    ;;
        tar-orig|lz4-orig)
                if [[ "$2" == "lz4-orig"  ]]
                then
                    lz4 --verbose --decompress "${f_name}"
                    f_name="${f_name%%.lz4}"
                fi
                if [[ "${f_name}" == *.tar ]]
                then
                    tar --skip-old-files --no-overwrite-dir \
                        --verbose --extract --file "${f_name}"
                fi                                         ;;
           # filter the archive through program $2(--xxx)
           *) tar --skip-old-files --no-overwrite-dir\
                  --verbose --extract $2 --file "${f_name}"  ;;
    esac
    # The more scenarios I can think of, `mv'
    # becomes true trouble maker. Let's leave
    # python to deal most common issues (if any)
    python2 -c"import os;from shutil import move,rmtree;
whos_here=os.listdir(os.getcwd());charge=os.path.join;
is_grenate=os.path.isfile;is_dynamite=os.path.isdir;defuse=os.remove;
for x in whos_here:
    say_what=charge('"${dir_name}"',x);
    if is_grenate(say_what):  defuse(say_what);
    if is_dynamite(say_what): rmtree(say_what);
[move(x,'"$dir_name"') for x in whos_here];"
    cd "${dir_name}" && rm -rf "${temp_one}"
;}
```

The plugin interface that invokes the archive creation and extraction.

Filename **my\_thunar\_plugin.zsh**:

```bash
#!/usr/bin/env zsh
files_to_source=(
    'compress.zsh' 'extract.zsh'
    'diehard.zsh'
)

for x in ${files_to_source[@]}
do
    source "$HOME/.config/zsh/functions/$x"
done
unset x files_to_source

case $1 in
   gzf) shift; compressgz "$@" ;;
  extr) shift; extract "$@"    ;;
     *)                        ;;
esac
```

Open up Thunar, select Edit, then at the very bottom you'll see Configure custom actions - click it.

![](img/file/thunar_plugin/1.png)

A new window will be opened, click the + symbol to the right to add a new custom action. The first custom action that we will - archive extraction.

![](img/file/thunar_plugin/2.png)

In the Name field type **Extract here**, and in the Command field type:

![](img/file/thunar_plugin/3.png)

```bash
zsh --exec $HOME/.config/misc/my_thunar_plugin.zsh extr %N
```

Switch to Appearance tab and in the File Pattern field type:

![](img/file/thunar_plugin/4.png)

```bash
*.tar.bz2;*.bz2;*.tz2;*.tbz2;*.tbz;*.tb2;*.tar.gz;*.gz;*.tgz;*.taz;*.tz;*.tar.xz;*.xz;*.txz;*.tpxz;*.lzma;*.tlz;*.rar;*.zip;*.xpi;*.tar;*.lz4;*.lrz;*.tar.lzo;*.lzo;*.Z;*.7z;*.exe
```

Make sure to toggle the **Other Files** switch as shown in the picture above.

Now the second action - archive creation and compression. Pretty much the same steps with some exceptions.

Again click the + symbol, in the Name field type **Compress to gzip** and in the Command field type:

![](img/file/thunar_plugin/5.png)

```bash
zsh --exec $HOME/.config/misc/my_thunar_plugin.zsh gzf %N
```

Switch to Appearance tab and in the File Pattern field type \*. Toggle all switches as shown in the below picture.

![](img/file/thunar_plugin/6.png)

Once you select single/multiple file(s) in Thunar and right click, these custom actions should appear.

![](img/file/thunar_plugin/7.png)

![](img/file/thunar_plugin/8.png)

This approach of writing Thunar plugins by using the shell itself allows you to invoke the functions on a daily basis as well use them with file manager when you need to. **mktemp** makes life easier when extracting archives downloaded from the wild west internet, as it chmods each file and takes care of rogue symbolic links.

The use of **/tmp** also helps to speed up the extraction since it reads and writes only in the RAM without touching your drive during that time.

Since there is no GUI involved in here, the extraction is lightning fast, as the GUI programs have to firstable read the archive content before even the extraction to begin, which in most cases will cause twice slower extraction than using the shell alternatives presented here.
