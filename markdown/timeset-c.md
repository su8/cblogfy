
---

![](img/file/timeset-c/timeset.png)

Manage system date and time, C version of https://github.com/aadityabagga/timeset

File `main.c`:

```c
/*
   07/29/2018

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
*/

#include <argp.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "constants.h"

static const char doc[] = "TimeSet - Manage System Date and Time.\vMandatory arguments to long options are mandatory for short options too.\n";
const char *argp_program_version = "timeset 1.0.5";
static struct argp_option options[] =
{
  { .doc = "" },
  { .name = "show-date-time",   .key = 's', .doc = MENU_OPT1  },
  { .name = "show-timezone",    .key = 't', .doc = MENU_OPT2  },
  { .name = "read-hw-time",     .key = 'r', .doc = MENU_OPT9  },
  { .doc = NULL }
};

static error_t parse_opt(int key, char *arg, struct argp_state *state)
{
  (void)arg;
  (void)state;

  switch(key)
  {
    case 's': non_interactive2(CMD1);   break;
    case 't': non_interactive2(CMD2);   break;
    case 'r': non_interactive2(CMD9);   break;
    default: return ARGP_ERR_UNKNOWN;
  }
  return EXIT_SUCCESS;
}

int main(int argc, char *argv[])
{
  int return_val = -1;
  struct argp arg_parser = {
    .doc = doc,
    .options = options,
    .parser = parse_opt
  };
  argp_parse(&arg_parser, argc, argv, 0, NULL, NULL);

  /*
     Do not continue if the user has
     used the command line options
  */
  if (argc > 1)
  {
    return EXIT_SUCCESS;
  }

  /*
     Do not permit non-root users.
     This doesn't affect the command
     line options/arguments.
  */
  if (0 != (geteuid()))
  {
    puts("You are not a root user, exiting.");
    return EXIT_FAILURE;
  }

  while (0 != (return_val = draw_menu()))
  {
    system("clear");
    switch(return_val)
    {
      case 1: non_interactive(1, CMD1, PRESS_ENTER); break;
      case 2: non_interactive(2, CMD2, DONE);        break;
      case 3: ask_n_run_cmd(CMD3, OPT3);             break;
      case 4: non_interactive(4, CMD4, DONE);        break;
      case 5: ask_zero_or_one(CMD5, OPT5);           break;
      case 6: non_interactive(6, CMD6, DONE);        break;
      case 7: non_interactive(7, CMD7, DONE);        break;
      case 8: ask_zero_or_one(CMD8, OPT8);           break;
      case 9: non_interactive(9, CMD9, PRESS_ENTER); break;
      case 10: non_interactive(10, CMD10, DONE);     break;
      case 11: non_interactive(11, CMD11, DONE);     break;
      case 12: ask_n_run_cmd(CMD12, OPT12);
        if (EOF == (scanf("%*s")))
        {
          EXIT_BAD();
        }
        break;
      default:
        break;
    }
  }

  return EXIT_SUCCESS;
}
```

File `functions.c`:

```c
/*
   07/29/2018

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
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "constants.h"

/*
   print/draw the menu and return
   the user option choice back to main.c
*/
int draw_menu(void)
{
  int input = -1;
  static const char draw_menu[] =
  {
    BLUE"-"NORM"!"BLUE"-  "PROGRAM_TITLE"\n"
    MENU_ROW("1",  MENU_OPT1)
    MENU_ROW("2",  MENU_OPT2)
    MENU_ROW("3",  MENU_OPT3)
    MENU_ROW("4",  MENU_OPT4)
    MENU_ROW("5",  MENU_OPT5)
    MENU_ROW("6",  MENU_OPT6)
    MENU_ROW("7",  MENU_OPT7)
    MENU_ROW("8",  MENU_OPT8)
    MENU_ROW("9",  MENU_OPT9)
    MENU_ROW("10", MENU_OPT10)
    MENU_ROW("11", MENU_OPT11)
    MENU_ROW("12", MENU_OPT12)
    MENU_ROW("0",  MENU_OPT0)
    BLUE"-"NORM"!"BLUE"-  0-12: "NORM
  };

  printf("%s", draw_menu);
  if (0 != (fflush(stdout)))
  {
    EXIT_BAD();
  }

  if (EOF == (scanf("%d", &input)))
  {
    EXIT_BAD();
  }
  getchar();  /* dispose the newline char */

  return input;
}

/*
   all commands passed to this function
   doesn't require user interaction, nor
   change anything to the system date and/or time
*/
void non_interactive(const int x, const char *exec_str, const char *print_str)
{
  system(exec_str);

  if (!puts(print_str))
  {
    EXIT_BAD();
  }

  if (1 == x || 9 == x)
  {
    getchar();  /* hold on (press enter) was printed */
  }
  return;
}

/* The user used the command line options */
void non_interactive2(const char *exec_str) {
  system(exec_str);

  return;
}

/* setting timezone and time */
void ask_n_run_cmd(const char *str1, const char *str2)
{
  char typed[100], exec_str[200];

  if (!puts(str2))
  {
    EXIT_BAD();
  }

  if (EOF == (scanf("%s", typed)))
  {
    EXIT_BAD();
  }
  snprintf(exec_str, 199, "%s \"%s\"", str1, typed);
  system(exec_str);

  if (!puts(DONE))
  {
    EXIT_BAD();
  }
  return;
}

/*
   ask the question passed to the formal parameter str2
   and restrict the user answer to 0 and 1
*/
void ask_zero_or_one(const char *str1, const char *str2)
{
  char exec_str[40];
  int enter_status = -1, entered_val = -1;

  SYSTEM_TDCTL();
  if (!puts(str2))
  {
    EXIT_BAD();
  }

  while (1 != (enter_status = (scanf("%d", &entered_val))) ||
    (entered_val < 0 || entered_val > 1))
  {
    if (1 != enter_status)
    {
      if (EOF == (scanf("%*s"))) /* skip bad input (chars) */
      {
        EXIT_BAD();
      }
    }
    SYSTEM_TDCTL();
    if (!puts(str2))
    {
      EXIT_BAD();
    }
  }
  snprintf(exec_str, 39, "%s %d", str1, entered_val);
  system(exec_str);

  if (!puts(DONE))
  {
    EXIT_BAD();
  }
  return;
}
```

File `constants.h`:

```c
/*
   07/29/2018

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
*/

/* constants and function declarations */
#ifndef CONSTANTS_H
#define CONSTANTS_H

/* the colours */
#define PINK "\x1B[1;95m"
#define BLUE "\x1B[1;94m"
#define GREEN "\x1B[1;92m"
#define YELLOW "\x1B[1;93m"
#define RED "\x1B[1;91m"
#define NORM "\x1B[0;0m"

/* misc */
#define STREQ(STR1, STR2) (0 == (strcmp(STR1, STR2)))
#define MENU_ROW(NUM, OPT) BLUE "[" NORM NUM BLUE "]" NORM " " OPT "\n"
#define EXIT_BAD() \
  puts("Something went wrong, exiting !!!"); \
  exit(EXIT_FAILURE);

/* runtime strings */
#define PLEASE_ENTER "Please enter a value between 0 and 1:\n0 means"
#define OPT8 PLEASE_ENTER " Hardware clock to UTC\nand 1 means set it to Local time"
#define OPT5 PLEASE_ENTER " disable NTP and 1 means enable NTP"
#define OPT3 "Enter the timezone. It should be like \nContinent/City - Europe/Berlin"
#define OPT12 "Enter the time. The time may be specified\nin the format  2018-08-01 09:12:45"
#define PRESS_ENTER "\nPress \"Enter\" to continue"
#define DONE "Done."

/* draw_menu strings */
#define PROGRAM_TITLE "TimeSet: Manage System Date and Time"
#define MENU_OPT1 " Show Current Date and Time Configurations"
#define MENU_OPT2 " Show Known Timezones"
#define MENU_OPT3 " Set System Timezone"
#define MENU_OPT4 " Synchronize Time from the Network (NTP)"
#define MENU_OPT5 " Control whether NTP is used for system time or not"
#define MENU_OPT6 " Enable NTP at Startup"
#define MENU_OPT7 " Disable NTP at Startup"
#define MENU_OPT8 " Control whether Hardware Clock is in Local Time or not"
#define MENU_OPT9 " Read the time from the Hardware Clock"
#define MENU_OPT10 "Synchronize Hardware Clock from the System Time"
#define MENU_OPT11 "Synchronize System Time from the Hardware Clock"
#define MENU_OPT12 "Set System Time manually"
#define MENU_OPT0 " Exit"

/* commands to execute */
#define CMD1 "timedatectl status"
#define CMD2 "timedatectl list-timezones"
#define CMD3 "timedatectl set-timezone"
#define CMD4 "ntpd"
#define CMD5 "timedatectl set-ntp"
#define CMD6 "systemctl enable ntpd"
#define CMD7 "systemctl disable ntpd"
#define CMD8 "timedatectl set-local-rtc"
#define CMD9 "hwclock --verbose"
#define CMD10 "hwclock -w"
#define CMD11 "hwclock -s"
#define CMD12 "timedatectl set-time"

/* misc2 */
#define SYSTEM_TDCTL() if (STREQ(CMD8, str1)) system("timedatectl | grep local");

/* prototype the functions */
int draw_menu(void);
void non_interactive(const int , const char *, const char *);
void non_interactive2(const char *);
void ask_n_run_cmd(const char *, const char *);
void ask_zero_or_one(const char *, const char *);

#endif /* CONSTANTS_H */
```

File `Makefile`:

```bash
#   07/29/2018
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or
#   (at your option) any later version.

#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.

#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#   MA 02110-1301, USA.

CFLAGS=-g2 -Wall -Wextra -O2 -std=c99 -pipe -pedantic -Wundef -Wshadow -W -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -Wconversion -Wpointer-arith -Wstrict-prototypes -Wformat=2 -Wsign-compare -Wendif-labels -Wredundant-decls -Winit-self
LDFLAGS=
CFILES=$(wildcard *.c)
OBJ_CODE=$(CFILES:.c=.o)
PROGRAM=timeset
PROGRAM_BINDIR=/usr/bin/$(PROGRAM)

all: $(OBJ_CODE)
	$(CC) $(CFLAGS) $^ -o $(PROGRAM) $(LDFLAGS)

.c.o:
	$(CC) $(CFLAGS) -c $< -o $@ $(LDFLAGS)

install:
	install -D -s -m 755 -c $(PROGRAM) $(PROGRAM_BINDIR)
	@echo 'To start the program type: timeset'

uninstall:
	rm -f $(PROGRAM_BINDIR)

clean:
	rm -f *.o
	rm -f $(PROGRAM)

.PHONY: all uninstall install clean
```