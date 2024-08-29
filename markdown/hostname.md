
---

Create a file named `hostname.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <err.h>
#include <unistd.h>
#include <limits.h>

int main(int argc, char *argv[]) {
  char name[256] = {'\0'};

  if (1 == argc) {
    if (gethostname(name, sizeof(name))) {
      err(EXIT_FAILURE, "gethostname");
    }
    puts(name);
  } else {
    if (sethostname(argv[1], strlen(argv[1]))) {
      err(EXIT_FAILURE, "sethostname");
    }
  }

  return EXIT_SUCCESS;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main hostname.c`.