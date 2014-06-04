# AppTracker callback server

Node.js server using [Hapi framework](http://www.hapijs.com) to get callbacks from our mobile apps (iOS, Android & BlackBerry).

## Attributes sent

AppTracker sends 4 attributes in POST which we are saving to MySQL database:
* device_code
* event_name
* screen_name
* tmp_secret_key
* app_secret_key

## Instalation

Install ```hapi``` and the other dependencies (as listed in ```package.json```) from ```npm``` with command

```shell
npm install
```

The callbacks will be available with POST request on URL ```/callback```

Launch the application (```node .```) and run cURL with POST data:
```
curl -X POST http://localhost:8000/callback -d "email=test@example.com&timestamp=1390078739&event=open&smtp-id=32131231&category=all"
```

## Healthy check

Since we are running this server on Amazon EC2 under a load balancer, it requires a healthy check to be set up. Our healthy check will connect to database and select last inserted row to see if the database connection can be established.

For this healthy check to work, you need to:

1. check table name in ```config.js``` - it should match the table name you are using to save the callbacks
2. set up healthy check in Amazon AWS load balancer. It is be available with GET request on URL ```/healthy-check```

![Healthy Check setup](./docs/img/aws-healthy-check-setup.png)

## Config

Don't forget to create ```config.js``` file before you launch the application. You have two options:

1. copy ```config.template.js``` to ```config.js``` and update parameters
2. create a symlink to another directory with other config files, i.e. ```ln -s /srv/SecretConfig/production/config/config.AppTracker.js ./config.js```

## Run it on a server

We recommend running it on a server with ```forever``` which is a great tool making sure it will run continuously, literaly, forever :-) See more info [about forever](https://github.com/nodejitsu/forever) in the documentation.

This is what we use to run it on our server:
```shell
forever start --minUptime 1000 --spinSleepTime 5000 /srv/nodejs/AppTracker/index.js
```

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
