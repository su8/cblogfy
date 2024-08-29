
---

![](img/file/urxvt-encrypt/encrypt.png)

Encrypt selected text within urxvt with **gpg** for the hidden recipient with given **$pubKey** (this is variable inside the script which have to be edited by hand) and upload the encrypted content to http://sprunge.us , there are other 2 websites that can be used instead sprunge.us, just uncomment the code and you'll be ready to rock. Since the recipient is hidden, anyone willing to extract metadata about the recipient will be out of luck. Only the recipient with the correct **$pubKey** can decrypt and read the content.

# Installation

Simply place the script in **/usr/lib/urxvt/perl/** for
system-wide availability or in **~/.urxvt/ext/** for user-only availability.
You can also put it in a folder of your choice, but then you have to add this
line to your **.Xdefaults/.Xresources**:

```bash
URxvt.perl-lib: /home/user/your/folder/
# extension to activate
URxvt.perl-ext-common           : encrypt

# keyboard shortcut to trigger the extension
URxvt.keysym.Control-Shift-G    : perl:encrypt:encrypt
```

# Requirements

* urxvt (rxvt-unicode) compiled with support for perl

Here is the extension code:

```perl
#!/usr/bin/env perl

# Encrypt selected text with gpg for the
# hidden recipient with given $pubKey and
# upload the encrypted content to sprunge.us

# Usage: put the following lines in your .Xdefaults/.Xresources:
# URxvt.perl-ext-common           : selection-to-clipboard,encrypt
# URxvt.keysym.Control-Shift-G    : perl:encrypt:encrypt

use strict;
use warnings;

sub on_user_command {
  my ($self, $cmd) = @_;

  if ($cmd eq "encrypt:encrypt") {
    $self->try_to_encrypt();
  }
  return;
}

sub try_to_encrypt {
  my ($self, $cmd) = @_;

  # Edit the variable $pubKey
  # according to your gpg pubkey
  my $pubKey = "91370EEDAEBDD2BD";

  my $selection = $self->selection($self->selection, 1);
  return unless defined $selection;

  my $concatArr = join("",
    qx(echo -en \"$selection\" | gpg --encrypt --hidden-recipient $pubKey --armor));

  # Upload to hastebin
  # my $web = "https://hastebin.com";
  # my $pasted = qx(curl -sd \"$concatArr\" $web/documents);
  # my @arr = split("\"", $pasted);
  # $pasted = $arr[3];
  # $self->selection($web . "/raw/" . $pasted, 1);
  # $self->selection_grab(urxvt::CurrentTime, 1);

  # Upload to dpaste
  # my $pasted = qx(echo -en \"$concatArr\" | curl -s -F 'content=<-' http://dpaste.com/api/v2/);
  # $self->selection($pasted . ".txt", 1);
  # $self->selection_grab(urxvt::CurrentTime, 1);

  # Upload to sprunge
  # my $pasted = qx(echo -en \"$concatArr\" | curl -F 'sprunge=<-' http://sprunge.us);
  # $self->selection($pasted, 1);
  # $self->selection_grab(urxvt::CurrentTime, 1);

  # Upload to clitxt.com
  # my $pasted = qx(echo -en \"$concatArr\" | curl -F 'upfile=\@-' https://clitxt.com);
  # $self->selection($pasted, 1);
  # $self->selection_grab(urxvt::CurrentTime, 1);

  # Upload to curlpaste.com
  # my $pasted = qx(curl -s --data-binary \"$concatArr\" https://curlpaste.com);
  # $pasted =~ s/(raw: |web: )//g;
  # my @arr = split(/\n+/, $pasted);
  # $self->selection($arr[0], 1);
  # $self->selection_grab(urxvt::CurrentTime, 1);

  # Upload to ix.io
  my $pasted = qx(echo -en \"$concatArr\" | curl -F 'f:1=<-' ix.io);
  $self->selection($pasted, 1);
  $self->selection_grab(urxvt::CurrentTime, 1);

  $self->show_msg("Link copied to clipboard.");

  return;
}

sub show_msg {
  my ($self, $msg) = @_;
  
  my $overlayz = $self->overlay_simple(0, 0, $msg);
  $self->{taimer} = urxvt::timer->new->after(5)->cb (
    sub {
      delete $self->{taimer};
      undef $overlayz;
    }
  );
  return;
}
```