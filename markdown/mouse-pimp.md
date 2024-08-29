
---

My mouse that I purchased back in September 2015 just died. 

The hilarious thing is that I switched to hardened profile, started recompiling my entire system with the hardened gcc and my mouse died after a while.

![](img/file/mouse-pimp/gcc-config.png)

![](img/file/mouse-pimp/rumble.png)

In such unfortunate moment I do appreciate my choice to still use tiling window manager, which is only operable by keyboard.

The actual mouse usage was roughly 3 months, so for $2 I couldn't not be mad at her. The "package" that I purchased back in the day:

![](img/file/new_keyboard/kb.jpg)

I really liked my mouse size and weight, so took one old mouse and switched the circuits. 

![](img/file/mouse-pimp/mouse-circuit.jpg)
![](img/file/mouse-pimp/mouse-shell.jpg)

Had to "hack" the plastic to fit the donor circuit, as the old mouse circuit was shorter than my current one, which was causing the scroll wheel to be placed in different location and not in the allocated (molded) place.

---

Edited few hours later after trying to compile **hardened-sources**, here's the snafu:

```bash
  LD      Documentation/video4linux/built-in.o
  HOSTCC  Documentation/watchdog/src/watchdog-simple
  HOSTLD  Documentation/vDSO/vdso_standalone_test_x86
collect2: error: ld returned 1 exit status
scripts/Makefile.host:134: recipe for target 'Documentation/vDSO/vdso_standalone_test_x86' failed
make[2]: *** [Documentation/vDSO/vdso_standalone_test_x86] Error 1
scripts/Makefile.build:403: recipe for target 'Documentation/vDSO' failed
make[1]: *** [Documentation/vDSO] Error 2
make[1]: *** Waiting for unfinished jobs....
  HOSTCC  Documentation/watchdog/src/watchdog-test
Makefile:922: recipe for target 'vmlinux' failed
make: *** [vmlinux] Error 2
  INSTALL Documentation/connector/cn_test.ko
  INSTALL drivers/acpi/button.ko
  INSTALL drivers/block/sx8.ko
cp: cannot stat ‘Documentation/connector/cn_test.ko’: No such file or directory
cp: cannot stat ‘drivers/acpi/button.ko’: No such file or directory
At main.c:255:
- SSL error:02001002:system library:fopen:No such file or directory: bss_file.c:175
- SSL error:2006D080:BIO routines:BIO_new_file:no such file: bss_file.c:178
sign-file: cp: cannot stat ‘drivers/block/sx8.ko’: No such file or directory
/lib/modules/4.4.8-hardened-r1/kernel/Documentation/connector/cn_test.ko: No such file or directory
At main.c:255:
- SSL error:02001002:system library:fopen:No such file or directory: bss_file.c:175
- SSL error:2006D080:BIO routines:BIO_new_file:no such file: bss_file.c:178
sign-file: /lib/modules/4.4.8-hardened-r1/kernel/drivers/acpi/button.ko: No such file or directory
scripts/Makefile.modinst:35: recipe for target 'Documentation/connector/cn_test.ko' failed
make[1]: *** [Documentation/connector/cn_test.ko] Error 1
make[1]: *** Waiting for unfinished jobs....
scripts/Makefile.modinst:35: recipe for target 'drivers/acpi/button.ko' failed
make[1]: *** [drivers/acpi/button.ko] Error 1
At main.c:255:
- SSL error:02001002:system library:fopen:No such file or directory: bss_file.c:175
- SSL error:2006D080:BIO routines:BIO_new_file:no such file: bss_file.c:178
sign-file: /lib/modules/4.4.8-hardened-r1/kernel/drivers/block/sx8.ko: No such file or directory
scripts/Makefile.modinst:35: recipe for target 'drivers/block/sx8.ko' failed
make[1]: *** [drivers/block/sx8.ko] Error 1
```

There are 2 more stable **hardened-sources** kernels. Hoping that some of them will compile flawlessly, otherwise the rollback will take me another day.
