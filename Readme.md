[![Code Climate](https://codeclimate.com/repos/52efc96d6956806bff005595/badges/64ddbf53a4cb2f8a70f2/gpa.png)](https://codeclimate.com/repos/52efc96d6956806bff005595/feed)

# AppTracker callback server

Node.js server using [Hapi framework](http://www.hapijs.com) to get callbacks from our mobile apps (iOS, Android & BlackBerry).

## Attributes sent

AppTracker sends 4 (possibly 5) attributes in POST which we are saving to MySQL database:
* device_code
* event_name / optionally event_list
* screen_name
* tmp_secret_key
* app_secret_key


## Config

Config is done via the environment as per the [12factor](http://12factor.net/logs) application philosophy. Currently there is one static config file, until some other things that used to happen in config are worked out.

So in a [paas](http://en.wikipedia.org/wiki/Platform_as_a_service) environment such as hosted one [heroku](http://www.heroku.com) or a roll your own [deis](http://deis.io/) you have configuration options placed into the server's env.

With heroku as this project demonstrates, this is handled by:

```
heroku config:set SOME_ENV_VAR=somevalue
```

Now that would get annoying real quick if it wasn't for [foreman + heroku-config](https://devcenter.heroku.com/articles/config-vars#using-foreman-and-heroku-config) Go ahead and read the whole article, I'll wait......

Ok, so hopefully you read that, and installed the plugin to your heroku toolbelt (and read the documentation...did you???? I will wait....). You'll notice right now this repo has files in the .gitignore

```
.env
.localenv
```

So now when you start your dev work on this project, you can do ```heroku config:pull```
And then magically your .env file will be populated. copy that to ````.localenv ``` and edit the copy to suit your needs.

## Installation

Install ```hapi``` and the other dependencies (as listed in ```package.json```) from ```npm``` with command ```npm i```

The callbacks will be available with POST request on URL ```/callback```

Be sure you have installed [foreman](https://github.com/ddollar/foreman) and that you have nodemon installed ```which nodemon``` if that doesn't return a legit result, go ahead and run ```npm i nodemon --global``` that will install nodemon.

Now, with that done launch the application (```foreman run nodemon . -e .localenv```) and run cURL with POST data:

```curl -X POST http://localhost:8000/callback -d "email=test@example.com&timestamp=1390078739&event=open&smtp-id=32131231&category=all"```

or to test event_list:

```curl -X POST http://localhost:4023/callback -d "email=test@example.com&timestamp=1390078739&event_list=%5B%7B%22screen_name%22%3A%22Get%20settings%22%2C%22event_name%22%3A%22show.screen.splash.screen%22%2C%22id%22%3A36%2C%22hotel_id%22%3A-1%2C%22city_id%22%3A-1%2C%22timestamp%22%3A1425010784%7D%5D&smtp-id=32131231&category=all"```


## Run it on a server

Well this is the strange part: please read the upcoming [heroku and you](http://confluence.hotelquickly.com/display/LC/Heroku+and+You) document on confluence. About getting started and deploying to multiple environments.

## The MIT License (MIT)

Copyright (c) 2014 Hotel Quickly Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
