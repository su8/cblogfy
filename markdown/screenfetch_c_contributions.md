
---

Back in January 29 2015 I contributed for second time to screenfetch-c, but my pull request got closed, because William wants to split it in small commits -- `commits are counted and not the code behind them`.

I had more free time these days and did some changes to screenfetch-c,
will list the changes again. I don't have internet at home, so execuse
me if this pull request overrides any previous changes.

colors.h - edited the manifest constant TNRM in order to prevent any issues
like the one with the arch logo being showed with bright/bold colour when
darker one was substituted.

detect.h - the detect_distro prototype/declaration now takes one formal
parameter instead two, the second one which we was using while ago for the
"user@hostname" colour is now passed as argument to the function
main_ascii_output located in disp.c . This way the user can pass the -D
flag/option/command line argument and print different logo, and the
"user@hostname" will be showed with the same colour as the passed distro
string or detected distro one.

`plat/linux/detect.c` - The second formal parameter/argument to the detect_distro function header
was removed, same goes for all `sprintf(str2, "%s", MANIFEST_CONSTANT_COLOUR);`
function calls. detect_host now fills the passed char arrays separately.
detect_uptime variables secs, mins, hrs, days was changed to unsigned int
instead signed int types, same goes for their formatting specifiers used by
snprintf(); function calls. detect_pkgs is using unsigned short int instead
signed int type. detect_cpu, the 'end' variable is now of type size_t instead
int, because strlen() returns the string length of size_t type, the 'for' loop
variable 'i' declaration and initialization was declared right below size_t
end; also it's type was changed to unsigned short int instead signed int.
detect_disk, the function calls to snprintf() was using wrong formatting
specifiers of signed long int while the passed variables was declared as
unsigned long int, so had to be corrected with "%lu" instead "%ld". detect_mem
total_mem, free_mem, used_mem variables are now of type unsigned long int
instead long long int, thus making the program 32-bit compatible, their cast
type was also exchanged to accomodate the new int type, used_mem now substracts
the 'bufferram' and 'sharedram' thus displaying smaller ram usage, the function
call to snprintf() is now using newer formatting specifiers to accomadate the
new variables int type. detect_res, the variables 'width' and 'height' are now
of type unsigned short int instead signed int, the snprintf() formatting
specifiers was also exchanged.

util.c - the split_uptime function header was edited, so the passed
arguments/parameters will be of type unsigned int instead signed int, same goes
for the cast types in it's function body for the pointer variables. Added `<time.h>`
header file, and edited the take_screenshot function body so it can execute the
external screenshot utility either for Macintosh or GNU/Linux with the following
formatted time: "screenfetch-%Y-%m-%d-%H%M%S.png", the strftime function handles
the date formating before the whole char array is passed to the sysmte function.

util.h - the split_uptime function prototype was edited to accomodate the newer
int type.

Wrote header file "logos_length.h" which contains manifest constants/macros
used to control the 'for' loop iteration cycles in some of the disp.c
functions, the dragonfly bsd logo was with wrong length causing the program to
terminate with dumped core.

disp.c - comment in display_verbose function because it was merged into
main_text_output function. process_logo_only and process_data are using the
manifest constants from logos_length.h header file, the function header process_data
was edited to accomodate the newer changes which include: passed
colour from the detected distro or the one set with -D flag/option/command line
arg, detected user and host from the plat/linux/detected.c module, user_host
character array that will be colorized with the passed colour and it will
combine 'user' and 'host' arrays into it. main_text_output function header now
takes three additional formal parameters/arguments which we will be used to
fill the user_host char array, but this time it won't be colorized.

disp.h - same description as the edited function headers in disp.c, but this
time the function prototypes/declarations was edited to accomodate the newer
changes.

logos.c - fixed some of the char array logos to be with the real char array
size as the ones in logos_length.h, later on saw that some of the printed logos
indentation was more or less and fixed those logos. DragonFly BSD is still
printed with abnormal indentation.

main.c - replaced host_colour char array with two other char arrays - 'UseR'
and 'HosT' which will be filled by detect.c and more especially the detect_host
function. detected_arr_names will print the semi-colin with white colour thus
making it distinctive from the previous colourized text. Removed the actual
argument host_colour that was passed to some of the function calls, and/or
replaced it with the UseR, HosT char arrays. display_verbose was renamed to
main_text_output which now takes bool type argument/parameter to check
whether we are in verbose mode.

This pull request is result of 3 days work, and I described only the first
one here. On the second day decided that the program will use only structures
but on third day saw that it would break the compatibility with the others
plat/*/detect.c modules, nor I have to mention that it would require a lot
time to accomodate the structure syntax in those modules, and on third day
took the copy of my first day work and did other changes, so my second
day work was pretty much wasted time. The most notable change is in disp.c
and I'm sure you'll like it, and probably inspire you to add more distros.

I've wrote nice shell version processing function, so take advantage of it
and add support for moar shells.

I really want to contribute more often but I don't have internet nor I could
test the other plat/*/detect.c modules, as I have a lot experience with OpenBSD

In *BSD the header file sys/sysctl.h includes few sysctl functions, replace
all popen calls.

detect_mem (BSD sysctl):
total - vm.stats.vm.v_page_count
free - vm.stats.vm.v_free_count
inactive - vm.stats.vm.v_inactive_count

If you want to add support for systems average load:

```c
include <stddlib.h>
double x[3];

getloadavg(x, 3);

string printf "%.2f %.2f %.2f" x[0], x[1], x[2]
```

This commit brings fallback mechanisms
regarding Solaris and GNU/Linux that allows
them to compile the program with and without
X11 and OpenGL headers, so those running
servers can enjoy the program without the
need to install those libraries in order to
compile it flawlessly.

The bash script detectwm was using repeateable
code and some of the case labels was trying to
match WMs that was not present in the 'wmnames'
array. Removed the repeatable code and added
more WMs.

Edited the README file, so it includes infor
mation regarding the jpeglib.h library and
how to install it, so the users can benefit
from the custom screenshot creation and sav
ing code in 'take_screenshot()' function.

x11.m4 now have fallback test if X11 headers
are not installed and if the user runs
GNU/Linux or Solaris the test will check
for the presence of lspci which is used
by detectgpu script. If it's missing too
'configure' will terminate with pre-defined
error message letting the user know that they
have to install X11 and/or lspci in order to
compile the program. xdpyinfo is checked for
presence too but it is not mandatory as lspci.
Same goes for their detect.c modules, they will
fallback to the bash scripts if the program
is compiled without X11 headers. GNU/Linux will
fallback to detectgpu if OpenGL headers are
not installed too.

The detection functions headers and their
prototypes was deparameterized, those credits
goes to you.

Will wait till you push all changes from my
screenfetch-c fork, as I have wrote some
huge functions that can go in util.c, for
example is the hybrid between xml and
config parser that depends entirely on
the standard C libraries, I'm talking
about the manual mode and the configu
ration file that is created and read
afterwards.
There is lot more code to be revealed
and pushed, but I don't want to put
you off with my huge commits as the
master branch have to catch up nearly
4000+ changes.

![](img/file/screenfetch/1.png)

Here's a `diff` file containing all of this explanation about my commits back then - https://su8.github.io/img/file/screenfetch/screenfetch-my-contributions.diff