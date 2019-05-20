# Mockus
Http endpoint mocking and configuring solution, with easy and simple to use web interface, which updates immediatly on save, with no need to restart!

![Mockus](https://i.imgur.com/ryIVgzb.jpg)

---
## The problem
When you want to run integrations tests, or just want to build your app independently without any active backend, you have few options:

- Mock out the response with a JSON file
- Create a mock service yourself
- Use Mockus!

---
## The Solution
This tool was designed to help developers and qa testers quickly create endpoints for their applications. No need to create a server, just run this project localy. You can create, edit and manage routes to your API. Every change to the API will be reflected on the server and updated straight away.

---
### Install
```
$ git clone https://github.com/harel-digital/mockus/
$ cd mockus
$ npm i
$ lerna bootstrap
```
---
### Development
Client:
```
$ cd packages/mockus-client && npm start
```
Server:
```
$ cd packages/mockus-server && npm start
```
On your browser, access: http://localhost:3000/

---
### Deployment
```
$ lerna bootstrap -- --production
$ NODE_ENV=production node packages/mockus-server/lib/index.js
```
On your browser, access: http://localhost:4000/

---
### Open Issues
- [ ] Disable duplicate routes
- [ ] Add support for persistent DB
- [ ] Support dynamic routes (/path/:var)

---
### License
Mockus is [MIT licensed.](https://github.com/harel-digital/mockus/blob/master/LICENSE)
