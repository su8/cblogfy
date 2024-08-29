
---

Here's how to merge different switches/keys from programs options into one long array called `combined` in the `main` function. We walk thru the entire array and strip the trailing space character.

Compile with `gcc -Wall -Wextra -O2 -o main program.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <argp.h>

#define VLA 256

static void parse_opts(int argc, char *argv[], char *combined);
static error_t parse_opt(int key, char *arg, struct argp_state *state);

const char *argp_program_version = "1.0.0";
const char *argp_program_bug_address = "https://github.com/su8 ";
static const char doc[] = "Program info";
static const struct argp_option options[] = {
  { .doc = "Available options:" },
  { .name = "one", .key = 'o', .doc = "The first option in this program"},
  { .name = "two", .key = 't', .doc = "The second option in this program"},
  { .doc = NULL }
};

struct arguments {
  char *all;
};

static const struct argp arg_parser = {
  .parser = parse_opt,
  .options = options,
  .doc = doc
};

static error_t parse_opt(int key, char *arg, struct argp_state *state) {

  struct arguments *arguments = state->input;
  switch(key) {
    case 'o':
        arguments->all += snprintf(arguments->all, VLA, "%s ", "first option");
        break;
    case 't':
        arguments->all += snprintf(arguments->all, VLA, "%s ", "second option");
        break;
    default:
      return ARGP_ERR_UNKNOWN;
  }
  return EXIT_SUCCESS;
}

static void parse_opts(int argc, char *argv[], char *combined) {
  struct arguments arguments = {
    .all = combined
  };
  argp_parse(&arg_parser, argc, argv, ARGP_IN_ORDER, NULL, &arguments);
}

int main(int argc, char *argv[]) {
  char combined[VLA] = {'\0'};
  char *all = combined;
  char *combinedPtr = combined;

  parse_opts(argc, argv, all);

  for (; *combinedPtr; combinedPtr++) { ; } /* walk thru the entire array */
  *(--combinedPtr) = '\0'; /* remove the trailing space */

  puts(combined);

  return EXIT_SUCCESS;
}
```