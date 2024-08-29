
---

If you want to create a `for` or `while` loop that will parse your input and the code must match it, you are probably using `if` statements.

But here we go, our scenario is to match the input string and launch function to this match.

Here's what you probably going to do.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

if (!strcmp(inputStr), "hack"){
  ...
}
else if (!strcmp(inputStr), "crush")) {
  ...
}
```

A lot of **if** and **else if** ... we can do better than this.

Declare them globally.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Opt
{
    const char *cmd;
    void (*my_func)(const char *str);
};

/* The `do` functions must exist in your code */
static const struct Opt opt[] = {
    {"ls", do_ls},
    {"help", do_help},
    {"cat", do_cat}
};

/* And somewhere in your `main' or other function */
int main(int argc, char *argv[]) {
  unsigned int x = 0U;
  const char *buf = "Hello World";
  for (x = 0U; x < sizeof(opt) / sizeof(opt[0]); x++)
  {
    if (!(strcmp(opt[x].cmd, cmd)))
    {
      matchCmd = 1;
      break;
    }
  }

  if (matchCmd == 0)
  {
    puts("Nothing found your match.");
    return EXIT_FAILURE;
  }

  /* and here's how to launch the desired function according to the match */
  opt[x].my_func(buf); /* and here you pass the variable to the function */

  return EXIT_SUCCESS;
}
```