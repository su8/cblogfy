
---

More shell functions to replace your day to day GUI programs. In this post we will cover mouse, volume, keyboard and monitor tweaks that will replace some known GUI programs such as volumeicon, lxinput and lxrandr.

Create the interface file called **tweak\_peripherials.zsh**:

```bash
# Increase volume with 5%
volup()   { _change_volume 5+ ;}

# Decrease volume with 5%
voldown() { _change_volume 5- ;}

# Increase mouse sensitivity with 10%
mouseup()   { _change_mouse_speed -10 ;}

# Decrease mouse sensitivity with 10%
mousedown() { _change_mouse_speed +10 ;}

# Increase repeat delay with 100 ms
kbup()   { _change_delay +100 ;}

# Decrease repeat delay with 100 ms
kbdown() { _change_delay -100 ;}

#---------------------------------------------
# Monitor tweaking
#---------------------------------------------
res() {
  if [[ -z $1 ]] ; then
    local all_res="\033[1;93m`xrandr`"
    local cur_res="\033[1;95mCurrent resolution: \033[1;94m`\
      xrandr | gawk -F ',' 'NR==1 {gsub("( |current)","");print $2}'`"
    local gpu="\033[1;95mGPU: \033[1;94m`\
      lspci  | gawk -F '[' '/(VGA)/ {gsub("]","");OFS="";print $2,$3}'`"
    for x in "${all_res}" "${cur_res}" "${gpu}"; do
      printf '%b\n' $x
    done
    printf '%b\n' "\033[0mTo change the current resolution type:\
  \033[1;91mres\033[0m \033[1;44m1280x720"
  else
    local display_port=`gawk '/( connected)/ {print $1}' <(xrandr)`
    xrandr --verbose --output "${display_port}" --mode $1
  fi
}
```

The functions are pretty much self-explanatory, except the resolution changing one. Run it without any arguments and you'll see:

![](img/file/hw_tweaks/1.png)

Now create the file **diehard.zsh** which will hold the non-interactive functions that does all the heavy lifting:

```bash
# save the tweak_peripherials.zsh conf
_save_conf() {
  local mouse=$(gawk '/(threshold:)/ {print $4}' <(xset q))
  local kb=$(gawk '/(repeat delay)/ {print $4}' <(xset q))
  printf "%s" "xset m 20/10 ${mouse} r rate ${kb} 30 b on" \
         > "$XDG_CACHE_HOME/.mouse-kb"
;}


#---------------------------------------------
# Mouse Tweaking
#---------------------------------------------
_change_mouse_speed() {
  let "set_to = $(gawk '/(threshold:)/ {print $4}' <(xset q)) $1"
  let "perc   = 110 - ${set_to}"
  xset m 20/10 "${set_to}"
    # xset mouse:
    #   Acceleration 20
    #   Acceleration Denom (constant=10)
    #   Threshold - variable
  printf '%s%%\n' "Mouse sensitivity ${perc}"
    # Left-handed people:
    #   xmodmap -e "pointer = 3 2 1"
  _save_conf
;}


#---------------------------------------------
# Volume Tweaking
#---------------------------------------------
_change_volume () {
  amixer --quiet sset Master $1 unmute
  local vol=$(gawk '/(%)/ {gsub(/[\[\]]/,""); print $5; exit}'\
                                     <(amixer sget Master))
  printf '%s\n' "Volume set to ${vol}"
;}


#---------------------------------------------
# Keyboard Tweaking
#---------------------------------------------
_change_delay() {
  local cur_delay=$(gawk '/(repeat delay)/ {print $4}' <(xset q))
  local mouse_speed=$(gawk '/(threshold:)/ {print $4}' <(xset q))
  let "new_ms = ${cur_delay} $1"
  xset m 20/10 "${mouse_speed}" r rate "${new_ms}" 30 b on
    # xset keyboard:
    #   Defaults:
    #     [delay 500] - variable
    #     [rate 30]
    #   r rate 500 30 b on
    #   'r' controls autorepeat delay
    #   'rate' controls repeat rate
    #   'b' controls bell volume
    #   The delay is the number of milliseconds before
    #   autorepeat starts, and the rate is the number
    #   of repeats per second.
  printf '%s\n' "Keyboard repeat delay ${new_ms} ms"
  _save_conf
;}
```


The configuration file which `_save_conf` creates is persistent, and we can take advantage of that by configuring **xinitrc** to read this config and applying the changes every single time we boot the system.

```bash
# put it in xinitrc
# keyboard and mouse configuration (delay, speed)
# see tweak_peripherials.zsh
mouse_kb_conf="$HOME/.cache/.mouse-kb"
[[ -f "${mouse_kb_conf}" ]] && $(<"${mouse_kb_conf}")
```

Bonus - lightweight GUI calendar.

![](img/file/hw_tweaks/2.png)

```cpp
/*
  Filename: calendar.c
  Compile with:
    gcc -Wall -Wextra -O2 -o calendar calendar.c `pkg-config --cflags --libs gtk+-3.0`
*/
#include <stdlib.h>
#include <gtk/gtk.h>

int main (int argc, char *argv[])
{
    GtkWidget *window, *box, *calendar;
    gtk_init(&argc, &argv);

    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(window), "Calendar");

    box = gtk_box_new(FALSE, 0);
    gtk_container_add(GTK_CONTAINER(window), box);

    calendar = gtk_calendar_new();
    gtk_container_add(GTK_CONTAINER(box), calendar);

    g_signal_connect(G_OBJECT(window), "destroy", G_CALLBACK(gtk_main_quit), NULL);
    gtk_widget_show_all(window);
    gtk_main();

    return EXIT_SUCCESS;
}
```
