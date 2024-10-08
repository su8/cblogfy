
---

![](img/file/urxvt-man2pdf/man2pdf.png)

Convert man page while reading it to pdf in urxvt.
No need to quit reading or open another terminal instance/tab.
Bind the desired keyboard shortcut and this extension will do all the heavy lifting for you.

# Installation

Simply place the script in **/usr/lib/urxvt/perl/** for
system-wide availability or in **~/.urxvt/ext/** for user-only availability.
You can also put it in a folder of your choice, but then you have to add this
line to your **.Xdefaults/.Xresources**:

```bash
URxvt.perl-lib: /home/user/your/folder/
# extension to activate
URxvt.perl-ext-common           : man

# keyboard shortcut to trigger the extension
URxvt.keysym.Control-Shift-X    : perl:man:topdf
```

You can convert man pages with your mouse, by default this functionallity is disabled so not to confuse any other extensions, such as url-select.

To enable this functionallity add the following to your **.Xdefaults/.Xresources**:

```bash
URxvt.perl-ext-common           : selection-to-clipboard,man

# 3 is the "right" mouse click button
URxvt.man2pdf.button: 3

# Mark the man page name with
# your left mouse button and right click
# to start the conversion process
```

# Requirements

* ghostscript
* urxvt (rxvt-unicode) compiled with support for perl

Here is the extension code:

```perl
#!/usr/bin/env perl
# Website:  https://github.com/su8/urxvt-man2pdf
# License:  GPLv3

# Usage: put the following lines in your .Xdefaults/.Xresources:
# URxvt.perl-ext-common           : man
# URxvt.keysym.Control-Shift-X    : perl:man:topdf

use strict;
use warnings;


sub on_user_command {
  my ($self, $cmd) = @_;

  if ($cmd eq "man:topdf") {
    my $cur_row = $self->nrow - 1;
    my $top = $self->top_row;

    return unless (-w $ENV{HOME});

    while ($cur_row >= $top) {
      my $line_obj = $self->line ($cur_row);
      my $it_found_smth = $self->scan_line (\$line_obj->t);

      last if ($it_found_smth);
      $cur_row = $line_obj->beg - 1;
    }
  }
  return;
}


sub on_start {
  my ($self) = @_;

  $self->{manBtn} = $self->x_resource("man2pdf.button") || 1337;
  return 0;
}


sub on_button_press {
  my ($self, $evt) = @_;

  return 0 unless ($evt->{button} == $self->{manBtn});

  my $page = $self->selection;
  return 0 unless defined $page;

  if ($page ne "") {
    if (20 > length $page) {
      my $clean_sel = ${$self->trim_em(\$page)};
      $self->check_n_convert (\$clean_sel);
    }
  }
  return 0;
}


sub trim_em {
  my ($self, $refs) = @_;
  my $deref = $$refs;

  $deref =~ s/\([^)]*\)//g;             # strip (1) from printf(1)
  $deref =~ s/(?!\-|\.)[[:punct:]]//g;  # strip [\$#@~!&*()\[\];,:?^`\\\/]+;

  return \$deref;
}


sub send_notif {
  my ($self, $refs) = @_;

  my $msg = "Trying to convert $$refs";
  my $overlayz = $self->overlay_simple (0, 0, $msg);

  $self->{taimer} = urxvt::timer->new->after(3)->cb (
   sub {
     delete $self->{taimer};
     undef $overlayz;
  });

  return;
}


sub check_n_convert {
  my ($self, $refs) = @_;

  my $page = lc $$refs;
  my $pdf_dir = $ENV{HOME} . "/man2pdf";

  my $has_ext = `man -Iw $page`;
  return 0 unless (0 == $?);

  if ($has_ext =~ /\.\w+$/) {
    mkdir ($pdf_dir, 0700) unless (-d $pdf_dir);
    my $pdf = "$pdf_dir/$page.pdf";

    $self->exec_async ("man -Tpdf $page > $pdf");
    $self->send_notif (\$pdf);
    return 1;
  }
  return 0;
}


sub scan_line {
  my ($self, $refs) = @_;
  my $deref = $$refs;

  return 0 unless $deref =~ /\w+\([^)]*\)/;
  $deref = ${$self->trim_em($refs)};

  my @arr = split(/\s+/, $deref);
  my $page = $arr[$#arr] ? lc $arr[$#arr] : "";
  return 0 if $page eq "";

  # the LESS pager line makes it easy for us
  if ($page =~ /\d+$/) {
    my @new_arr = split(" ", join(" ", @arr)); # strip left-right space
    if (lc $new_arr[0] eq "manual" and lc $new_arr[3] eq "line") {
      $page = lc $new_arr[2];
    }
  }
  return 0 if $page eq ".";

  return $self->check_n_convert (\$page);
}
```