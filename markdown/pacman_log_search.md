
---

A module which will search thru all of the pacman.* log files. Also you don't have to type the whole name of the package.

It can search for:

* package name 
* action and package name 
* date only
* advanced: date, action, package.
* last modification date to the pacman.log
* last upgrade date and upgraded packages

## Installation

    sudo python3 setup.py install

## Usage scenarios

```python
import pls
pls.action_package("installed", "openshot")
<generator object action_package at 0x7f5ccf13faa0>

for x in pls.action_package("installed", "openshot"):
    print(x)
[2014-01-15 10:52] [PACMAN] installed openshot (1.4.3-3)

next(iter(pls.action_package("installed", "openshot")))
'[2014-01-15 10:52] [PACMAN] installed openshot (1.4.3-3)'

next(iter(pls.package("openshot")))
"[2014-01-15 10:49] [PACMAN] Running 'pacman -S openshot'"
for x in pls.package("openshot"):
    print(x)
[2014-01-15 10:49] [PACMAN] Running 'pacman -S openshot'
[2014-01-15 10:52] [PACMAN] installed openshot (1.4.3-3)
[2014-01-15 17:04] [PACMAN] Running 'pacman -R openshot'
[2014-01-15 17:04] [PACMAN] removed openshot (1.4.3-3)
[2014-01-27 19:30] [PACMAN] Running 'pacman -S --noconfirm openshot'

next(iter(pls.advanced("2014-01-27", "upgraded", "kde-base-artwork")))
'[2014-01-27 13:46] [PACMAN] upgraded kde-base-artwork (4.12.0-1 -> 4.12.1-1)'
for x in pls.advanced("2014-01-27", "upgraded", "kde-base-artwork"):
    print(x)
[2014-01-27 13:46] [PACMAN] upgraded kde-base-artwork (4.12.0-1 -> 4.12.1-1)

next(iter(pls.date("2014-01-12")))
"[2014-01-12 11:15] [PACMAN] Running 'pacman -S opencv'"
for x in pls.date("2014-01-12"):
    print(x)
[2014-01-12 11:15] [PACMAN] Running 'pacman -S opencv'


for x in pls.last.upgrade():
    print(x)
[2014-02-09 12:58] [PACMAN] starting full system upgrade
-> 4 packages to upgrade ::
[2014-02-09 13:30] [PACMAN] upgraded krb5 (1.11.4-1 -> 1.12.1-1)
[2014-02-09 13:30] [PACMAN] upgraded curl (7.34.0-3 -> 7.35.0-1)
[2014-02-09 13:30] [PACMAN] upgraded dhcpcd (6.1.0-1 -> 6.2.1-1)
[2014-02-09 13:31] [PACMAN] upgraded openssh (6.4p1-1 -> 6.5p1-2)

pls.last.access()
'Sun Feb 9 13:31:16 2014' 

```
## Small Tutorial
```python
>>> line = "[2014-01-15 10:52] [PACMAN] installed openshot (1.4.3-3)"
>>> date, time, pacman, action, package, version = line.split()
>>> date
'[2014-01-15'
>>> time
'10:52]'
>>> pacman
'[PACMAN]'
>>> action
'installed'
>>> package
'openshot'
>>> version
'(1.4.3-3)'
>>> date.replace("[", "")
'2014-01-15'
>>> time.replace("]", "")
'10:52'
>>> print(date.replace("[", ""), time.replace("]", ""), pacman, action, package, version, sep=" ")
2014-01-15 10:52 [PACMAN] installed openshot (1.4.3-3)
>>> line
'[2014-01-15 10:52] [PACMAN] installed openshot (1.4.3-3)'
>>>
```

## Uninstall

    python3 --version
    sudo rm -rf /usr/lib/python3.3/site-packages/pls.py

* You may tweak the module and create similar GUI program like this one - <a href="http://qt-apps.org/content/show.php/Pacman+Log+Viewer?content=150484" target="_blank">http://qt-apps.org/content/show.php/Pacman+Log+Viewer?content=150484</a>

Create a file `setup.py`:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from distutils.core import setup
setup(
    name='pls',
    version='0.1',
    py_modules=['pls'],
    author='Aaron Caffrey',
    author_email='aaron_caffrey@hotmail.com.com',
    url='https://github.com/su8/pacman_log_search',
    license='GPLv3')
```

Create a file `pls`:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Created by Aaron Caffrey
# License: GPLv3 - http://www.gnu.org/licenses/gpl.html
from glob import glob
from time import ctime
from os.path import getmtime
from re import match, findall
from datetime import datetime

class no_class_calls(type):
    def __call__(self, *args, **kwargs):
        raise TypeError("You should NOT instantiate the class, but it's functions !")

class last(metaclass=no_class_calls):
    def upgrade():
        # create new empty lists
        packages = []
        upg_list = []
        # add all upgraded dates to the list with 'for loop'
        for upgrades in package("starting full system upgrade"):
            upg_list.append(upgrades)

        # split the last item
        a = upg_list[-1].split()
        # remove the square bracket from the date, so we can pass it as yyyy-mmmm-dddd
        b = a[0].replace("[", "")
        # read the log
        for lines in open("/var/log/pacman.log", "r"):
            # if the date match and there are upgraded packages, append them to the list
            if match("(.*){0}(.*)".format(b), lines) and \
            match("(.*)upgraded(.*)", lines):
                packages.append(lines)
        # if the packages list is not empty, continue
        if packages:
            # yield the last upgrade date from the upg_list (slice the last item)
            yield upg_list[-1]
            # yield the last number(s) from the enumerated packages
            yield "-> {0} packages to upgrade ::".format(len(packages[0:]))
            # yield all the packages from the "packages" list and remove the newlines
            for packs in packages:
                yield packs.rstrip("\n")
        # packages list is empty, so start again with the previous upg. dates
        else:
            if not len(upg_list[0:]) > 1:
                pass
            else:
                last_upg_date = "{0}".format(upg_list[-1]).split()[0].replace("[", "")
                yield "-> Nothing to upgrade for {0} ::".format(last_upg_date)
                for lines in open("/var/log/pacman.log", "r"):
                    if match("(.*){0}(.*)".format(upg_list[-2].split()[0].replace("[", "")), lines) and \
                    match("(.*)upgraded(.*)", lines):
                        packages.append(lines)
                if packages:
                    yield upg_list[-2]
                    yield "-> {0} packages to upgrade ::".format(len(packages[0:]))
                    for packs in packages:
                        yield packs.rstrip("\n")
                else:
                    if not len(upg_list[0:]) > 2:
                        pass
                    else:
                        last_upg_date = "{0}".format(upg_list[-2]).split()[0].replace("[", "")
                        yield "-> Nothing to upgrade for {0} ::".format(last_upg_date)
                        for lines in open("/var/log/pacman.log", "r"):
                            if match("(.*){0}(.*)".format(upg_list[-3].split()[0].replace("[", "")), lines) and \
                            match("(.*)upgraded(.*)", lines):
                                packages.append(lines)
                        if packages:
                            yield upg_list[-3]
                            yield "-> {0} packages to upgrade ::".format(len(packages[0:]))
                            for packs in packages:
                                yield packs.rstrip("\n")
                        else:
                            last_upg_date = "{0}".format(upg_list[-3]).split()[0].replace("[", "")
                            # substract the current day from the last detected upg date
                            sub_last_upg = datetime.now() - datetime(int(last_upg_date.split('-')[0]),\
                                int(last_upg_date.split('-')[1]),int(last_upg_date.split('-')[2]))
                            yield "-> Nothing to upgrade for {0} ::".format(last_upg_date)
                            yield """-> You haven\'t upgraded your system for at least {0} days ::
-> Always keep your system up-to-date ! ::""".format(sub_last_upg.days)

    def access():
        # return the last modification date to the pacman.log
        return ctime(getmtime("/var/log/pacman.log"))

def package(package):
    # This is the package searching function, test the second character for numbers
    try:
        if isinstance(int(package[1]), int):
            pass
    except:
        pass
        # find all pacman logs
        for all_pacman_logs in glob("/var/log/pacman.*"):
            # read the logs
            for lines in open(all_pacman_logs, "r"):
                # if the package matches the given one, print it
                if match("(.*){0}(.*)".format(package), lines):
                    yield lines.rstrip("\n")

def action_package(action, package):
    # find all pacman logs
    for all_pacman_logs in glob("/var/log/pacman.*"):
        # read the logs
        for lines in open(all_pacman_logs, "r"):
            # if the action and the package matches the given one, print it
            if match("(.*){0} {1}(.*)".format(action, package), lines):
                yield lines.rstrip("\n")

def advanced(date, action, package):
    # find all pacman logs
    for all_pacman_logs in glob("/var/log/pacman.*"):
        # read the logs
        for lines in open(all_pacman_logs, "r"):
            # if the date, action, package matches the given one, print it
            if match("(.*){0} {1}(.*)".format(action, package), lines) and \
            match("(.*){0}(.*)".format(date), lines):
                yield lines.rstrip("\n")

def date(date):
    # if the findall pattern matches the synthax x3(numbers dash), continue
    if findall(r"\d+-\d+\-\d+", date):
        # find all pacman logs
        for all_pacman_logs in glob("/var/log/pacman.*"):
            # read the logs
            for lines in open(all_pacman_logs, "r"):
                # if the date matches the given one, print it
                if match("(.*){0}(.*)".format(date), lines):
                    yield lines.rstrip("\n")
```