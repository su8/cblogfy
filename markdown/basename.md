
---

Create a filename `basename.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  size_t len = 0;
  char *srcptr = NULL, *temp = NULL, *temp2 = NULL;

  if (1 == argc) {
    fprintf(stderr, "%s\n", "Missing argument(s)");
    return EXIT_FAILURE;
  }
  temp  = argv[1];
  temp2 = argv[1];

  if (NULL == (srcptr = strrchr(temp, '/'))) {
    goto out;
  }

  if (!*(srcptr+1)) {
    if (1 >= (len = strlen(argv[1]))){
      goto out;
    }
    temp2[len - 1] = '\0';
    if (NULL == (srcptr = strrchr(temp2, '/'))) {
      goto out;
    }
  }

  ++srcptr;
  puts(srcptr);

out:
  return EXIT_SUCCESS;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main basename.c`.