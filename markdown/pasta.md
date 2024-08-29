
---

After reading parts of the **urxvtperl man** page, I was amazed how easy was to paste selected text:

```perl
sub on_sel_grab {
   warn "you selected ", $_[0]->selection;
   ()
}
```

I've been using the [clipboard] extension for a long time, probably since I replaced sakura with urxvt.

Without too much thinking I created a GitHub repository called [pasta], the initial code was pretty much man page ripoff, but my extension couldn't paste content from other X11 apps than urxvt itself.

After reading the rest of the man page, I figured out how to paste content from the X11 clipboard buffer too:

```perl
#! /usr/bin/env perl -w
# Author:   Aaron Caffrey
# Website:  https://github.com/wifiextender/urxvt-pasta
# License:  GPLv3

# Usage: put the following lines in your .Xdefaults/.Xresources:
# URxvt.perl-ext-common           : selection-to-clipboard,pasta
# URxvt.keysym.Control-Shift-V    : perl:pasta:paste

use strict;

sub on_user_command {
  my ($self, $cmd) = @_;
  if ($cmd eq "pasta:paste") {
    $self->selection_request (urxvt::CurrentTime, 3);
  }
  ()
}
```

This just proves that writing self-documented code is not enough. If it wasn't the well documented man page I would not be able to write my extension in first place.

Thanks to Bert, the author behind the wonderful sxiv and the [clipboard] extension for allowing me to use parts of his README and lib docs in my extension.

Here's the ammount of code in the clipboard extension, which my dead simple extension replaces:

```perl
#! perl -w
# Author:   Bert Muennich
# Website:  http://www.github.com/muennich/urxvt-perls
# License:  GPLv2

# Use keyboard shortcuts to copy the selection to the clipboard and to paste
# the clipboard contents (optionally escaping all special characters).
# Requires xsel to be installed!

# Usage: put the following lines in your .Xdefaults/.Xresources:
#   URxvt.perl-ext-common: ...,clipboard
#   URxvt.keysym.M-c:   perl:clipboard:copy
#   URxvt.keysym.M-v:   perl:clipboard:paste
#   URxvt.keysym.M-C-v: perl:clipboard:paste_escaped

# Options:
#   URxvt.clipboard.autocopy: If true, PRIMARY overwrites clipboard

# You can also overwrite the system commands to use for copying/pasting.
# The default ones are:
#   URxvt.clipboard.copycmd:  xsel -ib
#   URxvt.clipboard.pastecmd: xsel -ob
# If you prefer xclip, then put these lines in your .Xdefaults/.Xresources:
#   URxvt.clipboard.copycmd:  xclip -i -selection clipboard
#   URxvt.clipboard.pastecmd: xclip -o -selection clipboard
# On Mac OS X, put these lines in your .Xdefaults/.Xresources:
#   URxvt.clipboard.copycmd:  pbcopy
#   URxvt.clipboard.pastecmd: pbpaste

# The use of the functions should be self-explanatory!

use strict;

sub on_start {
	my ($self) = @_;

	$self->{copy_cmd} = $self->x_resource('clipboard.copycmd') || 'xsel -ib';
	$self->{paste_cmd} = $self->x_resource('clipboard.pastecmd') || 'xsel -ob';

	if ($self->x_resource('clipboard.autocopy') eq 'true') {
		$self->enable(sel_grab => \&sel_grab);
	}

	()
}

sub copy {
	my ($self) = @_;

	if (open(CLIPBOARD, "| $self->{copy_cmd}")) {
		my $sel = $self->selection();
		utf8::encode($sel);
		print CLIPBOARD $sel;
		close(CLIPBOARD);
	} else {
		print STDERR "error running '$self->{copy_cmd}': $!\n";
	}

	()
}

sub paste {
	my ($self) = @_;

	my $str = `$self->{paste_cmd}`;
	if ($? == 0) {
		$self->tt_paste($str);
	} else {
		print STDERR "error running '$self->{paste_cmd}': $!\n";
	}

	()
}

sub paste_escaped {
	my ($self) = @_;

	my $str = `$self->{paste_cmd}`;
	if ($? == 0) {
		$str =~ s/([!#\$%&\*\(\) ='"\\\|\[\]`~,<>\?])/\\\1/g;
		$self->tt_paste($str);
	} else {
		print STDERR "error running '$self->{paste_cmd}': $!\n";
	}

	()
}

sub on_action {
    my ($self, $action) = @_;

    on_user_command($self, "clipboard:" . $action);
}

sub on_user_command {
	my ($self, $cmd) = @_;

	if ($cmd eq "clipboard:copy") {
	   $self->copy;
	} elsif ($cmd eq "clipboard:paste") {
	   $self->paste;
	} elsif ($cmd eq "clipboard:paste_escaped") {
	   $self->paste_escaped;
	}

	()
}

sub sel_grab {
	my ($self) = @_;

	$self->copy;

	()
}
```

[urxvtperl]: http://linux.die.net/man/3/urxvtperl
[clipboard]: https://github.com/muennich/urxvt-perls/blob/master/clipboard
[pasta]: https://github.com/wifiextender/urxvt-pasta
