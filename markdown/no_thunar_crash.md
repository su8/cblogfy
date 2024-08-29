
---

I've had enough crashed sessions caused by just trying to rename some file/directory in Thunar.

It's not like this problem started since 1.6.10, it's been for awhile.

Decided that it's time to take action and replace the built-in renaming function. The new renaming function will also be sanitezed. Only valid alphabets, numbers and some punctuation marks are allowed, everything else will be discarded.

```cpp
/*
   Copyright Aaron Caffrey https://github.com/wifiextender
 
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
 
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.

   Compile with:
    gcc -Wall -Wextra -O2 main.c -o rename `pkg-config --cflags --libs gtk+-3.0`
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <gtk/gtk.h>

#define POS_LEFT 1
#define POS_RIGHT 2
#define MAX_NAME_LEN 300

void try_to_rename(void);
void sanitize_name(char *);
void display_warning(const char *, const char *);

GtkWidget *window, *entry;
char orig[MAX_NAME_LEN];

int main(int argc, char *argv[]) {
  if (argc == 1 || argc > 2) {
    exit (EXIT_FAILURE);
  }

  snprintf (orig, MAX_NAME_LEN, "%s", argv[1]);
  if (0 != access (orig, F_OK) || 0 != access (orig, W_OK)) {
    exit (EXIT_FAILURE);
  }

  GtkWidget *grid, *entry_label, *ok_button;

  gtk_init(&argc, &argv);

  window       = gtk_window_new (GTK_WINDOW_TOPLEVEL);
  gtk_window_set_title (GTK_WINDOW(window), "Rename");
  gtk_container_set_border_width (GTK_CONTAINER(window), 6);
  gtk_window_set_default_size (GTK_WINDOW(window), 250, 20);

  grid         = gtk_grid_new();
  gtk_grid_set_row_spacing (GTK_GRID(grid), 7);
  gtk_grid_set_column_spacing (GTK_GRID(grid), 5);
  gtk_container_set_border_width (GTK_CONTAINER(grid), 2);
  gtk_container_add (GTK_CONTAINER(window), grid);

  entry_label  = gtk_label_new ("New name:");
  gtk_grid_attach (GTK_GRID(grid), entry_label, POS_LEFT, 1, 1, 1);

  entry        = gtk_entry_new();
  gtk_entry_set_width_chars (GTK_ENTRY(entry), 1);
  gtk_entry_set_text (GTK_ENTRY(entry), orig);
  gtk_entry_set_max_length (GTK_ENTRY(entry), 200);
  gtk_grid_attach (GTK_GRID(grid), entry, POS_RIGHT, 1, 1, 1);

  ok_button    = gtk_button_new_with_label ("OK");
  g_signal_connect (G_OBJECT(ok_button), "clicked", G_CALLBACK(try_to_rename), NULL);
  gtk_grid_attach (GTK_GRID(grid), ok_button, POS_RIGHT, 2, 1, 1);

  g_object_set (G_OBJECT(entry), "activates-default", TRUE, NULL);
  g_object_set (G_OBJECT(ok_button), "can-default", TRUE, "has-default", TRUE, NULL);

  g_signal_connect (G_OBJECT(window), "destroy", G_CALLBACK(gtk_main_quit), NULL);
  gtk_widget_show_all (window);
  gtk_main();

  return EXIT_SUCCESS;
}


void try_to_rename(void) {
  char sanitized[MAX_NAME_LEN];
  const gchar *new_name = gtk_entry_get_text (GTK_ENTRY(entry));

  snprintf (sanitized, MAX_NAME_LEN, "%s", new_name);
  sanitize_name (sanitized);
  gtk_entry_set_text (GTK_ENTRY(entry), sanitized);

  if (0 == strcmp (orig, sanitized)) {
    display_warning ("Not funny", "Same name ?!");

  } else if ('\0' == sanitized[0] ||
      '\0' == orig[0]) {
    display_warning ("U mad br0", "Empty huh ?!");

  } else {

    if (0 != access (orig, F_OK)) {
      display_warning ("Snafu ?!", "The file doesnt exist anymore.");
    } else {
      rename (orig, sanitized);
    }
    gtk_main_quit();
  }
}

void sanitize_name (char *str) {
  char *ptr = str;
  char allowed[] = "()_.-";

  /* Discard all the leading '    space' */
  while (*ptr) {
    if (isspace((unsigned char) *ptr)) {
      ptr++;
    } else {
      break;
    }
  }

  for (; *ptr; ptr++) {
    if (isspace((unsigned char) *ptr) &&
        (isalnum((unsigned char) *(ptr + 1)) ||
        NULL != strchr(allowed, *(ptr + 1)))) {
      *str++ = '_';
    } else if (isalnum((unsigned char) *ptr) || (NULL != strchr(allowed, *ptr)
        && (*ptr != *(ptr + 1)))) {
      *str++ = *ptr;
    }
  }
  *str = '\0';
}


void display_warning(const char *str1, const char *str2) {
  GtkWidget *warning = gtk_message_dialog_new(
    GTK_WINDOW(window), GTK_DIALOG_MODAL,
    GTK_MESSAGE_WARNING, GTK_BUTTONS_OK, "%s", str1
  );
  gtk_message_dialog_format_secondary_text (GTK_MESSAGE_DIALOG(warning), "%s", str2);
  gtk_dialog_run (GTK_DIALOG(warning));
  gtk_widget_destroy (warning);
}
```

## Compile

Run the command below to compile the program, move it in your $HOME/.cache dir. Backup the source code **main.c**.

```bash
# -Wundef -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -W -Wshadow -Wconversion -Wpointer-arith -Wstrict-prototypes -Wformat=2 -Wmissing-prototypes 

gcc -Wall -Wextra -O2 main.c -o rename `pkg-config --cflags --libs gtk+-3.0`
```

## Configure

Open up Thunar, hover over the **Edit** section and select **Configure custom actions**

![](img/file/no_thunar_rename_crash/edit.png)

Click the \+ symbol to add a new custom action.

![](img/file/no_thunar_rename_crash/action.png)

In the Name filed type **Rename (New)**, in the command field select/type the program location and append **%n** at the end.

![](img/file/no_thunar_rename_crash/basic.png)

Switch to the appearance tab, in the **File Pattern** filed type \* and toggle all the checkboxes.

![](img/file/no_thunar_rename_crash/appearance.png)

Re-open Thunar, select some file/folder/zombie and right click to see and test the new Rename action.

![](img/file/no_thunar_rename_crash/rename.png)

![](img/file/no_thunar_rename_crash/dialogue.png)

Say goodbye to the rename crashing bug that's been with Thunar for so many years.

## Note

If your window manager is tiling, add exception to make this program floating and centered.
