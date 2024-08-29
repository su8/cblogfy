
---

Create a file named `dirname.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  size_t len = 0, x = 0, cut_here = 0;
  char *srcptr = NULL, *temp = NULL, *src = NULL;
  char buf[5000];

  if (1 == argc) {
    fprintf(stderr, "%s\n", "Missing argument(s)");
    return EXIT_FAILURE;
  }
  src  = argv[1];
  temp = argv[1];

  len = strlen(argv[1]);

  if (NULL == (srcptr = strrchr(temp, '/'))) {
    goto out;
  }

  if (!*(srcptr+1)) {
    src[len - 1] = '\0';
  }

  for (; *temp; x++, temp++) {
    if ('/' == *temp) {
      cut_here = x;
    }
  }

  if (0 == cut_here) {
    goto out;
  }

  memcpy(buf, src, cut_here);
  buf[cut_here] = '\0';

  puts(buf);

out:
  return EXIT_SUCCESS;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main dirname.c`.