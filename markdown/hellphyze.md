
---

Hellphyze
=====
![](img/file/data_hellphyze/hellphyze_preview.png)

Python gui telnet client. Keep in mind that I've wrote it for Thomson `TG582` and `TG585`. If your server or router is other brand or model, you should re-write the commands that are defined to the buttons or just use the "custom commands" field.

To use multiple custom commands separate them with a comma: command1,command2,command3,command4

Thanks to https://www.youtube.com/watch?v=fIOk2EcgOI8 for the given inspiration, this is the video which made me to create the program.

## Requirements

* python2/3
* gpg (for saving and loading profiles)
* python2/3-gobject
* webkitgtk
* pywebkitgtk

Filename `data_hellphyze/hellphyze_icon.png`:

![](img/file/data_hellphyze/hellphyze_icon.png)

Filename `data_hellphyze/hellphyze_bg.png`:

![](img/file/data_hellphyze/hellphyze_bg.png)

Filename `data_hellphyze/style.css`:

```css
GtkEntry {
    color: darkgrey;
}

GtkEntry:focused {
    color: black;
} 
```

Filename `data_hellphyze/hellphyze.ui`:

```html
<?xml version="1.0" encoding="UTF-8"?>
<interface>
  <!-- interface-requires gtk+ 3.10 -->
  <object class="GtkImage" id="image5">
    <property name="visible">True</property>
    <property name="can_focus">False</property>
    <property name="stock">gtk-save</property>
  </object>
  <object class="GtkImage" id="image7">
    <property name="visible">True</property>
    <property name="can_focus">False</property>
    <property name="stock">gtk-apply</property>
  </object>
  <object class="GtkImage" id="image8">
    <property name="visible">True</property>
    <property name="can_focus">False</property>
    <property name="stock">gtk-add</property>
  </object>
  <object class="GtkWindow" id="window1">
    <property name="can_focus">False</property>
    <property name="icon">hellphyze_icon.png</property>
    <child>
      <object class="GtkBox" id="box1">
        <property name="visible">True</property>
        <property name="can_focus">False</property>
        <property name="orientation">vertical</property>
        <child>
          <object class="GtkOverlay" id="overlay1">
            <property name="visible">True</property>
            <property name="can_focus">False</property>
            <child>
              <object class="GtkImage" id="image1">
                <property name="visible">True</property>
                <property name="can_focus">False</property>
                <property name="halign">start</property>
                <property name="pixbuf">hellphyze_bg.png</property>
              </object>
            </child>
            <child type="overlay">
              <object class="GtkBox" id="box2">
                <property name="visible">True</property>
                <property name="can_focus">False</property>
                <property name="orientation">vertical</property>
                <child>
                  <object class="GtkGrid" id="grid1">
                    <property name="visible">True</property>
                    <property name="can_focus">False</property>
                    <property name="margin_top">6</property>
                    <child>
                      <object class="GtkLabel" id="label1">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="margin_left">5</property>
                        <property name="label" translatable="yes">Host IP</property>
                        <attributes>
                          <attribute name="foreground" value="#bababdbdb6b6"/>
                        </attributes>
                      </object>
                      <packing>
                        <property name="left_attach">1</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkImage" id="image2">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="margin_left">2</property>
                        <property name="stock">gtk-network</property>
                      </object>
                      <packing>
                        <property name="left_attach">0</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkEntry" id="host_ip">
                        <property name="visible">True</property>
                        <property name="can_focus">True</property>
                        <property name="margin_left">19</property>
                        <property name="has_frame">False</property>
                      </object>
                      <packing>
                        <property name="left_attach">2</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkImage" id="image3">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="margin_left">8</property>
                        <property name="stock">gtk-disconnect</property>
                      </object>
                      <packing>
                        <property name="left_attach">3</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkLabel" id="label2">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="margin_left">8</property>
                        <property name="label" translatable="yes">Port</property>
                        <attributes>
                          <attribute name="foreground" value="#bababdbdb6b6"/>
                        </attributes>
                      </object>
                      <packing>
                        <property name="left_attach">4</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkEntry" id="host_port">
                        <property name="visible">True</property>
                        <property name="can_focus">True</property>
                        <property name="margin_left">5</property>
                        <property name="has_frame">False</property>
                        <property name="text" translatable="yes">23</property>
                      </object>
                      <packing>
                        <property name="left_attach">5</property>
                        <property name="top_attach">0</property>
                        <property name="width">1</property>
                        <property name="height">1</property>
                      </packing>
                    </child>
                  </object>
                  <packing>
                    <property name="expand">False</property>
                    <property name="fill">True</property>
                    <property name="position">0</property>
                  </packing>
                </child>
                <child>
                  <object class="GtkBox" id="box3">
                    <property name="visible">True</property>
                    <property name="can_focus">False</property>
                    <property name="orientation">vertical</property>
                    <child>
                      <object class="GtkGrid" id="grid3">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="margin_left">2</property>
                        <property name="margin_top">10</property>
                        <child>
                          <object class="GtkEntry" id="host_password">
                            <property name="visible">True</property>
                            <property name="can_focus">True</property>
                            <property name="margin_left">13</property>
                            <property name="visibility">False</property>
                            <property name="has_frame">False</property>
                          </object>
                          <packing>
                            <property name="left_attach">5</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkImage" id="image6">
                            <property name="visible">True</property>
                            <property name="can_focus">False</property>
                            <property name="margin_left">8</property>
                            <property name="stock">gtk-dialog-authentication</property>
                          </object>
                          <packing>
                            <property name="left_attach">3</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkImage" id="image4">
                            <property name="visible">True</property>
                            <property name="can_focus">False</property>
                            <property name="stock">gtk-orientation-portrait</property>
                          </object>
                          <packing>
                            <property name="left_attach">0</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkLabel" id="username">
                            <property name="visible">True</property>
                            <property name="can_focus">False</property>
                            <property name="margin_left">5</property>
                            <property name="label" translatable="yes">Username</property>
                            <attributes>
                              <attribute name="foreground" value="#bababdbdb6b6"/>
                            </attributes>
                          </object>
                          <packing>
                            <property name="left_attach">1</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkEntry" id="host_username">
                            <property name="visible">True</property>
                            <property name="can_focus">True</property>
                            <property name="margin_left">5</property>
                            <property name="has_frame">False</property>
                          </object>
                          <packing>
                            <property name="left_attach">2</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkCheckButton" id="show_password">
                            <property name="visible">True</property>
                            <property name="can_focus">True</property>
                            <property name="receives_default">False</property>
                            <property name="focus_on_click">False</property>
                            <property name="xalign">0</property>
                            <property name="draw_indicator">True</property>
                            <signal name="toggled" handler="on_show_password_toggled" swapped="no"/>
                          </object>
                          <packing>
                            <property name="left_attach">4</property>
                            <property name="top_attach">0</property>
                            <property name="width">1</property>
                            <property name="height">1</property>
                          </packing>
                        </child>
                      </object>
                      <packing>
                        <property name="expand">False</property>
                        <property name="fill">True</property>
                        <property name="position">0</property>
                      </packing>
                    </child>
                    <child>
                      <object class="GtkBox" id="box4">
                        <property name="visible">True</property>
                        <property name="can_focus">False</property>
                        <property name="orientation">vertical</property>
                        <child>
                          <object class="GtkGrid" id="grid4">
                            <property name="visible">True</property>
                            <property name="can_focus">False</property>
                            <property name="margin_left">6</property>
                            <property name="margin_top">7</property>
                            <child>
                              <object class="GtkButton" id="network_up">
                                <property name="label" translatable="yes">Network Up</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <signal name="clicked" handler="on_network_up_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="left_attach">0</property>
                                <property name="top_attach">0</property>
                                <property name="width">1</property>
                                <property name="height">1</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkButton" id="network_down">
                                <property name="label" translatable="yes">Network Down</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <signal name="clicked" handler="on_network_down_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="left_attach">1</property>
                                <property name="top_attach">0</property>
                                <property name="width">1</property>
                                <property name="height">1</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkButton" id="deny_2_mac">
                                <property name="label" translatable="yes">Deny MAC</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <signal name="clicked" handler="on_deny_2_mac_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="left_attach">2</property>
                                <property name="top_attach">0</property>
                                <property name="width">1</property>
                                <property name="height">1</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkButton" id="allow_2_mac">
                                <property name="label" translatable="yes">Allow MAC</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <signal name="clicked" handler="on_allow_2_mac_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="left_attach">3</property>
                                <property name="top_attach">0</property>
                                <property name="width">1</property>
                                <property name="height">1</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkButton" id="list_devices">
                                <property name="label" translatable="yes">List Devices</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <signal name="clicked" handler="on_list_devices_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="left_attach">4</property>
                                <property name="top_attach">0</property>
                                <property name="width">1</property>
                                <property name="height">1</property>
                              </packing>
                            </child>
                          </object>
                          <packing>
                            <property name="expand">False</property>
                            <property name="fill">True</property>
                            <property name="position">0</property>
                          </packing>
                        </child>
                        <child>
                          <object class="GtkBox" id="box5">
                            <property name="visible">True</property>
                            <property name="can_focus">False</property>
                            <property name="margin_top">7</property>
                            <property name="orientation">vertical</property>
                            <child>
                              <object class="GtkGrid" id="grid2">
                                <property name="visible">True</property>
                                <property name="can_focus">False</property>
                                <property name="column_spacing">64</property>
                                <child>
                                  <object class="GtkLabel" id="label4">
                                    <property name="visible">True</property>
                                    <property name="can_focus">False</property>
                                    <property name="label" translatable="yes">Custom commands</property>
                                    <attributes>
                                      <attribute name="foreground" value="#bababdbdb6b6"/>
                                    </attributes>
                                  </object>
                                  <packing>
                                    <property name="left_attach">1</property>
                                    <property name="top_attach">0</property>
                                    <property name="width">1</property>
                                    <property name="height">1</property>
                                  </packing>
                                </child>
                                <child>
                                  <object class="GtkButton" id="save_profile">
                                    <property name="label" translatable="yes">Save Profile</property>
                                    <property name="visible">True</property>
                                    <property name="can_focus">True</property>
                                    <property name="receives_default">True</property>
                                    <property name="halign">start</property>
                                    <property name="valign">start</property>
                                    <property name="image">image5</property>
                                    <property name="relief">none</property>
                                    <property name="always_show_image">True</property>
                                    <signal name="clicked" handler="on_save_profile_clicked" swapped="no"/>
                                  </object>
                                  <packing>
                                    <property name="left_attach">2</property>
                                    <property name="top_attach">0</property>
                                    <property name="width">1</property>
                                    <property name="height">1</property>
                                  </packing>
                                </child>
                                <child>
                                  <object class="GtkButton" id="load_profile">
                                    <property name="label" translatable="yes">Load Profile</property>
                                    <property name="visible">True</property>
                                    <property name="can_focus">True</property>
                                    <property name="receives_default">True</property>
                                    <property name="halign">start</property>
                                    <property name="valign">start</property>
                                    <property name="image">image8</property>
                                    <property name="relief">none</property>
                                    <property name="always_show_image">True</property>
                                    <signal name="clicked" handler="on_load_profile_clicked" swapped="no"/>
                                  </object>
                                  <packing>
                                    <property name="left_attach">0</property>
                                    <property name="top_attach">0</property>
                                    <property name="width">1</property>
                                    <property name="height">1</property>
                                  </packing>
                                </child>
                              </object>
                              <packing>
                                <property name="expand">False</property>
                                <property name="fill">True</property>
                                <property name="position">0</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkEntry" id="custom_commands">
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="margin_top">5</property>
                                <property name="has_frame">False</property>
                                <property name="primary_icon_stock">gtk-connect</property>
                              </object>
                              <packing>
                                <property name="expand">False</property>
                                <property name="fill">True</property>
                                <property name="position">1</property>
                              </packing>
                            </child>
                            <child>
                              <object class="GtkButton" id="send">
                                <property name="label" translatable="yes">Send</property>
                                <property name="visible">True</property>
                                <property name="can_focus">True</property>
                                <property name="receives_default">True</property>
                                <property name="image">image7</property>
                                <property name="always_show_image">True</property>
                                <signal name="clicked" handler="on_send_clicked" swapped="no"/>
                              </object>
                              <packing>
                                <property name="expand">False</property>
                                <property name="fill">True</property>
                                <property name="position">2</property>
                              </packing>
                            </child>
                          </object>
                          <packing>
                            <property name="expand">False</property>
                            <property name="fill">True</property>
                            <property name="position">1</property>
                          </packing>
                        </child>
                      </object>
                      <packing>
                        <property name="expand">False</property>
                        <property name="fill">True</property>
                        <property name="position">1</property>
                      </packing>
                    </child>
                  </object>
                  <packing>
                    <property name="expand">False</property>
                    <property name="fill">True</property>
                    <property name="position">1</property>
                  </packing>
                </child>
              </object>
            </child>
          </object>
          <packing>
            <property name="expand">False</property>
            <property name="fill">True</property>
            <property name="position">0</property>
          </packing>
        </child>
        <child>
          <object class="GtkScrolledWindow" id="scrolledwindow1">
            <property name="height_request">400</property>
            <property name="visible">True</property>
            <property name="can_focus">True</property>
            <child>
              <object class="GtkTextView" id="textview1">
                <property name="visible">True</property>
                <property name="can_focus">True</property>
                <property name="hscroll_policy">natural</property>
                <property name="vscroll_policy">natural</property>
                <property name="editable">False</property>
              </object>
            </child>
          </object>
          <packing>
            <property name="expand">False</property>
            <property name="fill">True</property>
            <property name="position">3</property>
          </packing>
        </child>
      </object>
    </child>
  </object>
</interface>
```

Filename `hellphyze.py`:

```python
#!/usr/bin/env python2
import os
import telnetlib
from gi.repository import Gtk, Gdk

class allow_mac(Gtk.Dialog):
    def __init__(self):
        Gtk.Dialog.__init__(self, "Allow MAC", None,
            Gtk.DialogFlags.MODAL, buttons=(Gtk.STOCK_OK, Gtk.ResponseType.OK))
        box = self.get_content_area()
        label = Gtk.Label('Allow MAC, example 11:22:33:44:55:66')
        box.add(label)
        self.entry = Gtk.Entry()
        box.add(self.entry)
        self.show_all()

class deny_mac(Gtk.Dialog):
    def __init__(self):
        Gtk.Dialog.__init__(self, "Deny MAC", None,
            Gtk.DialogFlags.MODAL, buttons=(Gtk.STOCK_OK, Gtk.ResponseType.OK))
        box = self.get_content_area()
        label = Gtk.Label('Deny MAC, example 11:22:33:44:55:66')
        box.add(label)
        self.entry = Gtk.Entry()
        box.add(self.entry)
        self.show_all()

profile_file = os.getenv("HOME") + "/.hellphyze_profile"
encrypted_profile_file = os.getenv("HOME") + "/.hellphyze_profile.gpg"
class hellphyze:

    def on_show_password_toggled(self, widget):
        if widget.get_active():
            self.host_password.set_visibility(True)
        else:
            self.host_password.set_visibility(False)

    def on_load_profile_clicked(self, widget):
        if not os.path.isfile(encrypted_profile_file):
            dialog_no_profile = Gtk.MessageDialog(None, 0, Gtk.MessageType.WARNING,
            Gtk.ButtonsType.OK, "Profile file does not exist!")
            dialog_no_profile.format_secondary_text("")
            dialog_no_profile.run()
            dialog_no_profile.destroy()
        else:
            # decrypt the encrypted profile - call gpg
            os.system('gpg "{0}"'.format(encrypted_profile_file))
            if not os.path.isfile(profile_file):
                dialog = Gtk.MessageDialog(None, 0, Gtk.MessageType.WARNING,
                    Gtk.ButtonsType.OK, "Wrong password, huh ?")
                dialog.format_secondary_text("")
                dialog.run()
                dialog.destroy()
                # now open and read it's content
            with open(profile_file) as read_ip_port_username:
                for i, line in enumerate(read_ip_port_username.readlines(), 0):
                    for char in line:
                        if char in ("\n"):
                            line = line.replace(char,'')
                    if i == 0:
                        self.host_ip.set_text(line)
                    if i == 1:
                        self.host_port.set_text(line)
                    if i == 2:
                        self.host_username.set_text(line)
                    if i == 3:
                        self.host_password.set_text(line)
            os.remove(profile_file)

    def on_save_profile_clicked(self, widget):
        if os.path.isfile(encrypted_profile_file):
            os.remove(encrypted_profile_file)
        profile = open(profile_file, "w")
        profile.write("{0}\n".format(self.host_ip.get_text()))
        profile.write("{0}\n".format(self.host_port.get_text()))
        profile.write("{0}\n".format(self.host_username.get_text()))
        profile.write("{0}\n".format(self.host_password.get_text()))
        profile.close()
        # encrypt the profile - call gpg
        os.system('gpg -o "{0}" --cipher-algo AES256 --symmetric "{1}"'.format(encrypted_profile_file, profile_file))
        os.remove(profile_file)
        if os.path.isfile(encrypted_profile_file):
            dialog_encrypted = Gtk.MessageDialog(None, 0, Gtk.MessageType.INFO,
                Gtk.ButtonsType.OK, "Profile saved & encrypted")
            dialog_encrypted.format_secondary_text("")
            dialog_encrypted.run()
            dialog_encrypted.destroy()

    # type many commands in the "custom commands" field, separated by a ,  do not add spaces !
    def on_send_clicked(self, widget):
        telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
        telnet.read_until("Username : ")
        telnet.write(self.host_username.get_text() + "\r")
        telnet.read_until("Password : ")
        telnet.write(self.host_password.get_text() + "\r")
        line = self.custom_commands.get_text()
        for char in line:
            if char in (","):
                line2 = line.replace(char, '\r')
                telnet.write("{0}\r".format(line2))
                telnet.write("exit\r")
                self.textbuffer.set_text("{0}".format(telnet.read_all()))

    def on_network_up_clicked(self, widget):
        telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
        telnet.read_until("Username : ")
        telnet.write(self.host_username.get_text() + "\r")
        telnet.read_until("Password : ")
        telnet.write(self.host_password.get_text() + "\r")
        telnet.write("ppp ifattach intf=pppInternet\r")
        telnet.write("ip ifattach intf=ipInternet\r")
        telnet.write("saveall\r")
        telnet.write("exit\r")
        self.textbuffer.set_text("{0}".format(telnet.read_all()))

    def on_network_down_clicked(self, widget):
        telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
        telnet.read_until("Username : ")
        telnet.write(self.host_username.get_text() + "\r")
        telnet.read_until("Password : ")
        telnet.write(self.host_password.get_text() + "\r")
        telnet.write("ppp ifdetach intf=pppInternet\r")
        telnet.write("ip ifdetach intf=ipInternet\r")
        telnet.write("saveall\r")
        telnet.write("exit\r")
        self.textbuffer.set_text("{0}".format(telnet.read_all()))

    def on_allow_2_mac_clicked(self, widget):
        dialog = allow_mac()
        response = dialog.run()
        entered_text = dialog.entry.get_text()
        if response == Gtk.ResponseType.OK:
            telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
            telnet.read_until("Username : ")
            telnet.write(self.host_username.get_text() + "\r")
            telnet.read_until("Password : ")
            telnet.write(self.host_password.get_text() + "\r")
            telnet.write('wireless macacl modify ssid_id=0 hwaddr="{0}" permission=allow\r'.format(entered_text))
            telnet.write("exit\r")
            self.textbuffer.set_text("{0}".format(telnet.read_all()))
        dialog.destroy()

    def on_deny_2_mac_clicked(self, widget):
        dialog = deny_mac()
        response = dialog.run()
        entered_text = dialog.entry.get_text()
        if response == Gtk.ResponseType.OK:
            telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
            telnet.read_until("Username : ")
            telnet.write(self.host_username.get_text() + "\r")
            telnet.read_until("Password : ")
            telnet.write(self.host_password.get_text() + "\r")
            telnet.write('wireless macacl modify ssid_id=0 hwaddr="{0}" permission=deny\r'.format(entered_text))
            telnet.write("saveall\r")
            telnet.write("exit\r")
            self.textbuffer.set_text("{0}".format(telnet.read_all()))
        dialog.destroy()

    def on_disable_reset_button_clicked(self, widget):
        telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
        telnet.read_until("Username : ")
        telnet.write(self.host_username.get_text() + "\r")
        telnet.read_until("Password : ")
        telnet.write(self.host_password.get_text() + "\r")
        telnet.write("system config resetbutton=disabled\r")
        telnet.write("system qual led value=alloff\r")
        telnet.write("service system modify name=CWMP-S state=disabled\r")
        telnet.write("service system modify name=CWMP-C state=disabled\r")
        telnet.write("saveall\r")
        telnet.write("exit\r")
        self.textbuffer.set_text("{0}".format(telnet.read_all()))

    def on_list_devices_clicked(self, widget):
        telnet = telnetlib.Telnet(self.host_ip.get_text(), self.host_port.get_text())
        telnet.read_until("Username : ")
        telnet.write(self.host_username.get_text() + "\r")
        telnet.read_until("Password : ")
        telnet.write(self.host_password.get_text() + "\r")
        telnet.write("hostmgr list\r")
        telnet.write("exit\r")
        self.textbuffer.set_text("{0}".format(telnet.read_all()))

    def __init__(self):
        self.builder = Gtk.Builder()
        self.builder.add_from_file('data_hellphyze/hellphyze.ui')
        self.builder.connect_signals(self)

        self.custom_commands = self.builder.get_object('custom_commands')
        self.host_ip = self.builder.get_object('host_ip')
        self.host_port = self.builder.get_object('host_port')
        self.host_username = self.builder.get_object('host_username')
        self.host_password = self.builder.get_object('host_password')
        self.textview = self.builder.get_object('textview1')
        self.textbuffer = self.textview.get_buffer()

        self.window = self.builder.get_object("window1")
        self.window.connect("delete-event", Gtk.main_quit)
        self.window.show_all()

        self.screen = Gdk.Screen.get_default()
        self.css_provider = Gtk.CssProvider()
        self.css_provider.load_from_path('data_hellphyze/style.css')
        self.priority = Gtk.STYLE_PROVIDER_PRIORITY_USER
        self.context = Gtk.StyleContext()
        self.context.add_provider_for_screen(self.screen, self.css_provider, self.priority)

if __name__ == '__main__':
    hellphyze()
    Gtk.main()
```