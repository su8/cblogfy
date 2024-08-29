
---

Emerging specific version of package:

```bash
eix gegl

[I] media-libs/gegl
     Available versions:  
     (0)    0.2.0-r2{tbz2} ~0.2.0-r4 0.2.0-r5
     (0.3)  0.3.0{tbz2} ~0.3.0-r1 0.3.8{tbz2} ~0.3.8-r1 ~0.3.20 ~0.3.24 0.3.26{tbz2} ~0.3.28 **9999
       {cairo debug ffmpeg +introspection jpeg jpeg2k lcms lensfun libav openexr png raw sdl svg test tiff umfpack v4l vala webp CPU_FLAGS_X86="mmx sse"}
     Installed versions:  0.2.0-r5{tbz2}(06:57:22 PM 03/10/2018)(cairo ffmpeg jpeg png sdl svg -debug -jpeg2k -lensfun -libav -openexr -raw -umfpack CPU_FLAGS_X86="mmx sse") 0.3.26(0.3){tbz2}(04:13:51 PM 03/10/2018)(cairo ffmpeg lcms sdl svg -debug -introspection -jpeg2k -lensfun -openexr -raw -test -tiff -umfpack -v4l -vala -webp CPU_FLAGS_X86="mmx sse")
     Homepage:            http://www.gegl.org/
     Description:         A graph based image processing framework
```

In order to emerge version 0.2.0-r5 we write the following:

```bash
# Note the quotes
emerge -a '=gegl-0.2.0-r5'
```

---

Got ebuild and want to download and compile the project ?

```bash
ebuild project-9999.ebuild manifest clean prepare configure compile install qmerge merge
```
