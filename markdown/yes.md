
---

Create a file named `yes.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <signal.h>

void init_da_handler(void);
void sighandler(int num);

static volatile sig_atomic_t call_it_quits = 0;

int main(int argc, char *argv[]) {
  const char *const input = argv[1];

  init_da_handler();

  if (1 == argc) {
    fprintf(stderr, "%s\n", "Missing argument");
    return EXIT_FAILURE;
  }

  while (1) {
    puts(input);
    if (1 == call_it_quits) {
      break;
    }
  }

  return EXIT_SUCCESS;
}

void init_da_handler(void) {
  struct sigaction setup_action;
  memset(&setup_action, 0, sizeof(struct sigaction));

  setup_action.sa_handler = sighandler;

  if (-1 == (sigaction(SIGINT, &setup_action, NULL))) {
    fprintf(stderr, "%s\n", "sigaction() failed");
    exit(EXIT_FAILURE);
  }
}

/* !!! WARNING !!! */
void sighandler(int num) {
/* ASYNC CODE ONLY */
  (void)num;
  call_it_quits = 1;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main yes.c`.