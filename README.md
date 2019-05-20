# Mockus
Http endpoint mocking and configuring solution, with easy and simple to use web interface, which updates immediatly on save, with no need to restart!

![Mockus](https://i.imgur.com/5z2uWzw.jpg)

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
### Development
```
$ git clone https://github.com/harel-digital/mockus/
$ cd mockus
```
Client:
```
$ cd mockus-client
$ npm i
$ npm start
```

Server:
```
$ cd mockus-server
$ npm i
$ npm run tsc
$ npm start
```
On your browser, access: http://localhost:3000/

---
### Deployment
```
$ sh scripts/build_release.sh
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
