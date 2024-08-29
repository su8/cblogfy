
---

Login module for your python app.

The usernames, passwords, username dict keys are stored as sha512 hash values. Only the person that has been added,logged in or has the right permission can operate the given user.

Automated lockdown is activated for 1 minute if you failed to login after 4 attempts.

After that minute of lockdown you are allowed to try again, made that to restrict brute forcing programs.

Avoid using weak passwords and or usernames that can be compromised in brute-force attack.

For example, John the Ripper cracked the hash value of 'hello' for less than a second, while it couldn't crack 'whatabia7*&ch'

The hash values aren't bulletproof but at least provide some basic protection from prying eyes.

## Requirements:
* python 2 or 3

## Installation:

    sudo python2 setup.py install

or

    sudo python3 setup.py install

## Usage:

```python
>>> import pylogin   # the module itself
>>> auth = pylogin.Auth()
>>> auth.add_user('myusername', 'password')
>>> auth.add_permission('test')
>>> auth.login('myusername', 'eqwewq')
Traceback (most recent call last):
    raise InvalidPassword(username, password)
InvalidPassword: ('myusername', 'eqwewq')
>>> auth.login('myusername', 'password')
True
>>> auth.is_logged_in('myusername')
True
>>> auth.check_permission('test', 'myusername')
Traceback (most recent call last):
    raise NotPermittedError(username)
NotPermittedError: ('myusername')
>>> auth.permit_user('test321', 'myusername')
Traceback (most recent call last):
    raise PermissionError("Permission does not exists")
PermissionError: Permission does not exists
>>> auth.permit_user('test', 'myusername')
>>> auth.check_permission('test', 'myusername')
True
>>> auth.add_user('user2', 'pass')
Traceback (most recent call last):
    raise PasswordTooShort(username)
login.PasswordTooShort: ('user2')
>>> auth.add_user('user2', 'password2')
>>> auth.add_user('myusername', 'password')
Traceback (most recent call last):
    UsernameAlreadyExists: ('myusername')
>>> auth.logout('myusername', 'password')
True
>>> # login 'myusername' and then delete 'myusername'
>>> auth.delete_user('myusername', 'password')
Traceback (most recent call last):
    raise InvalidUsername(username)

```
## Integration in your program

```python
>>> import pylogin
>>> auth = pylogin.Auth()
>>> auth.add_user('user1', 'userpassword')
>>> auth.add_permission('test program')
>>> auth.add_permission('change program')
>>> auth.permit_user('test program', 'user1')
>>> auth.permit_user('change program', 'user1')
>>> class MyApp(object):
    def __init__(self):
        self.username = None
        self.menu_map = {
            "login": self.login,
            'test': self.test,
            'change': self.change,
            'quit': self.quit
            }
    def login(self):
        logged_in = False
        while not logged_in:
            username = input('username: ')
            password = input('password: ')
            try:
                logged_in = auth.login(
                    username, password)
            except InvalidUsername:
                print('Sorry, that username does not exists')
            except InvalidPassword:
                print('Sorry, incorrect Password')
            else:
                self.username = username
    def is_permitted(self, permission):
        try:
            auth.check_permission(
                permission, self.username)
        except NotLoggedInError as e:
            print('{} is not logged in'.format(e.username))
        except NotPermittedError as e:
            print('{} cannot {}'.format(
                e.username, permission))
            return False
        else:
            return True
    def test(self):
        if self.is_permitted('test program'):
            print('Testing program now')
    def change(self):
        if self.is_permitted('change program'):
            print('Changing program now...')
    def quit(self):
        raise SystemExit()
    def menu(self):
        try:
            answer = str()
            while True:
                print("""
Please Enter a command:
\tLoging\tLogin
\ttest\tTest the program
\tchange\tChange the program
\tquit\tQuit
""")
                answer = input('enter a command: ').lower()
                try:
                    func = self.menu_map[answer]
                except KeyError:
                    print('{} is not a valid option'.format(
                        answer))
                else:
                    func()
        finally:
            print('Thank you for testing the login module')

            
>>> MyApp().menu()

```

Filename `setup.py`:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from distutils.core import setup
setup(
    name='pylogin',
    version='0.1',
    py_modules=['pylogin'],
    author='Aaron Caffrey',
    author_email='aaron_caffrey@hotmail.com',
    license='GPLv3')
```

Filename `pylogin.py`:

```python
# Created by Aaron Caffrey
# License: GPLv3
from hashlib import sha512
from random import getrandbits
try:
    from time import process_time as current_time
except ImportError:
    from time import clock as current_time

class AuthException(Exception):
    def __init__(self, arg):
        super(AuthException, self).__init__(arg)
        self.arg = arg

class AlreadyLoggedIn(AuthException):
    pass

class UsernameAlreadyExists(AuthException):
    pass

class PasswordTooShort(AuthException):
    pass

class InvalidUsername(AuthException):
    pass

class PermissionError(Exception):
    pass

class InvalidPassword(AuthException):
    pass

class NotPermittedError(AuthException):
    pass

class NotLoggedInError(AuthException):
    pass

class LockDownError(AuthException):
    pass

class User(object):
    def __init__(self, username, password):
        '''Create a new user object. The password will be encrypted before storing'''
        _encryt_usr = (username + random_number).encode('utf-8')
        self.username = sha512(_encryt_usr).hexdigest()
        self.password = self._encrypt_pw(password)
        self.is_logged_in = False
    def _encrypt_pw(self, password):
        '''Encrypt the password with the username and return the sha digest.'''
        hash_string = (self.username + password).encode('utf-8')
        return sha512(hash_string).hexdigest()
    def check_password(self, password):
        '''Return True if the password is valid for this user, false otherwise'''
        encrypted = self._encrypt_pw(password)
        return encrypted == self.password
    def __dict__(self):
        pass

random_number = str(getrandbits(100000))

class Authenticator(object):
    def __init__(self):
        '''Construct an authenticator to manage user logging in and out'''
        self._users = dict()
        self._attempts = 1
        self._cur_time = str()
    def add_user(self, username, passwordd):
        '''Hash the username to be used as dict key'''
        current_usr = User(username, random_number).password
        if current_usr in self._users:
            raise UsernameAlreadyExists(username)
        if len(passwordd) < 6:
            raise PasswordTooShort(passwordd)
        self._users[current_usr] = User(username, passwordd)
    def delete_user(self, username, passwordd):
        current_usr = User(username, random_number).password
        if not self.is_logged_in(username):
            raise NotLoggedInError(username)
        if not self._users[current_usr].check_password(passwordd):
            raise InvalidPassword(passwordd)
        del self._users[current_usr]
    def is_logged_in(self, username):
        current_usr = User(username, random_number).password
        if current_usr in self._users:
            return self._users[current_usr].is_logged_in
        return False
    def login(self, username, passwordd):
        if self._attempts < 5:
            if self.is_logged_in(username):
                self._attempts += 1
                raise AlreadyLoggedIn(username)

            current_usr = User(username, random_number).password
            user = self._users.get(current_usr)
            if not user:
                self._attempts += 1
                raise InvalidUsername(username)
            if not user.check_password(passwordd):
                self._attempts += 1
                raise InvalidPassword(passwordd)
            user.is_logged_in = True
        else:
            if not self._cur_time:
                # strftime hardly depends on the system time
                # and thus makes it vulnerable, deprecated
                self._cur_time = str(current_time()).split('.')[0]
            if str(current_time()).split('.')[0] != self._cur_time:
                self._cur_time = str()
                self._attempts = 1
                self.login(username, passwordd)
            else:
                raise LockDownError("You've been locked down for a minute")

    def logout(self, username, passwordd):
        current_usr = User(username, random_number).password
        if not self.is_logged_in(username):
            raise NotLoggedInError(username)
        if not self._users[current_usr].check_password(passwordd):
            raise InvalidPassword(passwordd)
        self._users[current_usr].is_logged_in = False
    def __dict__(self):
        pass

class Auth(Authenticator):
    def __init__(self):
        super(Auth, self).__init__()
        self._permissions = dict()
    def add_permission(self, perm_name):
        '''Create a new permission that users can be added to'''
        if not perm_name in self._permissions:
            self._permissions[perm_name] = set()
        else:
            raise PermissionError("Permission '{}' Exists".format(perm_name))
    def permit_user(self, perm_name, username):
        '''Grant the given permission to the user'''
        current_usr = User(username, random_number).password
        perm_set = self._permissions.get(perm_name)
        if not perm_name in self._permissions:
            raise PermissionError("Permission '{}' does not exists"
                .format(perm_name))
        else:
            if not current_usr in self._users:
                raise InvalidUsername(username)
            perm_set.add(current_usr)
    def check_permission(self, perm_name, username):
        current_usr = User(username, random_number).password
        if not self.is_logged_in(username):
            raise NotLoggedInError(username)
        perm_set = self._permissions.get(perm_name)
        if not perm_name in self._permissions:
            raise PermissionError("Permission '{}' does not exists"
                .format(perm_name))
        else:
            if not current_usr in perm_set:
                raise NotPermittedError(username)
            else:
                return True
    def __dict__(self):
        pass
```