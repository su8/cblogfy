
---

Using multiple arguments to your C/C++ functions can be a tedios task to maintain.

One approach is to use `struct`, but we have something better.

```c
#include <argp.h>

/* `x' here is char* pointer to char array in the `main' function */
#define GLUE(x, z, ...) (x+=snprintf(x, 256, z, __VA_ARGS__))

#define GET_AND_FMT(arg1, arg2, arg3, ...) \
  launchMyFunction(arg1, arg2, arg3); \
  GLUE(__VA_ARGS__);

/* `arg' is your switch current run-time argument */
#define NEW_ARG_LABEL(lbl, declareVar, useVar, num, ...) \
  case lbl: \
  { \
    declareVar; \
    GET_AND_FMT(useVar, arg, num, arguments->all, __VA_ARGS__, useVar); \
  } \
  break;

/* and while parsing your options with `switch' */
NEW_ARG_LABEL('b', char todo[256], todo, 1, "%s %s %s %s %s");

const char *argp_program_version = "1.0.0";
const char *argp_program_bug_address = "https://github.com/su8/pinky-bar ";
static const char doc[] = "Statusbar program for anything (Window Manager, terminal multiplexer, etc..)";
static const struct argp_option options[] = {
  { .doc = "Available options:" },
  { .name = "mpd", .key = 'M', .doc = "The song filename."},
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
    default:
      return ARGP_ERR_UNKNOWN;
  }
  return EXIT_SUCCESS;
}

void parse_opts(int argc, char *argv[], char *combined) {
  struct arguments arguments = {
    .all = combined
  };
  argp_parse(&arg_parser, argc, argv, ARGP_IN_ORDER, NULL, &arguments);
}

int main(int argc, char *argv[]) {
  char combined[256] = {'\0'};
  char *all = combined;

  parse_opts(all);

  return EXIT_SUCCESS;
}
```

All of the above is equal to:

```c

/* `x' here is char* pointer to char array in the `main' function */
case 'b':
{
  char todo[256] = {'\0'};
  launchMyFunction(arg1, arg2, arg3);
  arguments->all+=snprintf(arguments->all, sizeof(todo - 1), "%s %s %s %s %s", func2var, func3var, func4var, func5var, func6var);

}
break;
```