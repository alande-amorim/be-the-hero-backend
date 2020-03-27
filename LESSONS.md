Lesson - Backend App
==
These are some notes taken from the second lesson of the OmnisTack 11th week.

### Initiating the project
```bash
$ mkdir backend && cd backend
$ npm init -y
$ mkdir src
$ mv index.js src
```
Setting up hot reload:
```bash
$ npm install nodemon -D
```


Add a start script on package.json:
```json
    ...
    "scripts": {
        "start": "nodemon src/index.js"
    },
    ...
```

### Express: installing the web server and setting up some routes
```bash
$ npm install express
$ touch src/routes.js
```

Add your routes to the file you just created:
```js
// src/routes.js
const express = require('express');
const routes = express.Router();

routes.get('/', (request, response) => {
    return response.send('Hello world');
});

module.exports = routes;
```

Import your routes into index.js:
```js
// src/index.js
const express = require('express');
const routes = require('./routes');
const app = express();
app.use(express.json());
app.use(routes);
app.listen(3333)
```

### Knex: setting up the database schema and connection
Knex Query Builder [Docs](http://knexjs.org/).

[Installation](http://knexjs.org/#Installation-node)
```bash
$ npm install knex
$ npx init knex # this will create a knexfile.js config file at the root dir
$ mkdir src/database
$ mkdir src/database/migrations
```

Edit [configs](http://knexjs.org/#Installation-client):
```js
  // knexfile.js
  ...
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite3'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },
  ...
```

Creating and executing [Migrations](http://knexjs.org/#Installation-migrations):
```bash
$ npx knex # shows all commands available
$ npx knex migrate:make create_ongs
$ npx knex migrate:make create_incidents
```
Add to your create_ongs migration file:
```js
// src/database/migrations/20200327000000_create_ongs.js
exports.up = function(knex) {
  return knex.schema.createTable('ongs', function(table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('ongs');
};
```
Now, add the following to your create_incidents migration file:
```js
// src/database/migrations/20200327000001_create_incidents.js
exports.up = function(knex) {
  return knex.schema.createTable('incidents', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.decimal('value').notNullable();
    table.string('ong_id').notNullable();

    table.foreign('ong_id').references('id').inTable('ongs');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('incidents');
};

```

Run all migrations:
```bash
$ npx knex migrate:latest
```

If you need to undo something:
```bash
$ npx knex migrate:rollback
```

Finaly, create the connection object:
```bash
$ touch src/database/connection.js
```
```js
// src/database/connection.js
const knex = require('knex');
const configuration = require('../../knexfile');

const connection = knex(configuration.development);
module.exports = connection;
```

Now you can import the db connection object and use it to perform database operations:
```js
// src/routes.js
const connection = require('./database/connection');
...
routes.post('/ongs', async function(request, response){
  const {name, email, whatsapp, city, uf } = response.body;
  const id = 'someRandomBytes';

  await connection('ongs').insert({
    id, name, email, whatsapp, city, uf
  });

  return response.json({ id });
});
...

```

### Tidying up
```bash
$ mkdir src/controllers
$ touch OngController.js
```

Move all the logic of the ong routes from the routes.js file to the recently created file OngController.js:
```js
// src/controllers/OngController.js

const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const ongs = await connection('ongs').select('*');

    return response.json(ongs);
  },

  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body;
    const id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert({
      id, name, email, whatsapp, city, uf
    });

    return response.json({ id });
  }
}
```

### CORS installation and setup
```bash
$ npm install cors
```

Add to index.js:
```js
// src/index.js
...
const cors = require('cors');

const app = express();
app.use(cors());
...
```
