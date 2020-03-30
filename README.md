<h1 align="center">
  <img src=".github/logo.png" alt="Be The Hero API" width="200px"><br>
  Be The Hero - API
</h1>

## Contents
* [Semana OmniStack 11.0](#semana-omnistack-11.0)
* [The Project](#the-project)
* [This repo](#this-repo)
  * [Techs](#techs)
  * [Requirements](#requirements)
  * [Download & Installation](#download--installation)
  * [Running](#running)
  * [Exposed API endpoints](#exposed-api-endpoints)
* [Web App](https://github.com/alande-amorim/be-the-hero-web)
* [Mobile App](https://github.com/alande-amorim/be-the-hero-mobile)

---
## Semana OmniStack 11.0
<a href="https://rocketseat.com.br/"><img align="center" alt="RocketSeat" src=".github/rocketseat.svg" width="120px" /></a>

Semana OmniStack 11.0 is the 11th edition of the one week long time limited web course hosted by RocketSeat that took place from March 23, 2020 to March 29, 2020.
The goal of these series of lessons is to present a solid and complete stack based on Javascript (Node.js, ReactJS and React Native) and to build a cool little project.

## The Project
The proposed project for the Semana Omnistack 11.0 is a web app to help NGOs (non governmental organizations) finding people willing fund their social projects.
After signing up, the NGOs will be able to register social projects they are currently seeking help to fund.
Those projects will be available for the general audience on the mobile app.
A backend piece will serve both apps.

---
## This repo

This repo holds the source code for the backend application that serves the restfull API for both web and mobile apps.

### Techs
- Node.js
- Express
- Sqlite
- KnexJS

### Requirements
  - Node v12+
  - Npm 6+

### Download & Installation

Clone this repo, install and migrate the database.

```bash
$ git clone https://github.com/alande-amorim/be-the-hero-backend.git
$ cd be-the-hero-backend
$ npm install
$ npx knex migrate:latest
```

### Running
You can now run the app:
```bash
$ npm start
```
This will start the web server on http://localhost:3333.<br>

If for any reason you wish to change the port this app listens to, you can do that by editing the src/index.js file:
```js
// src/index.js
  ...
  app.listen(8080); // or whatever you wish
  ...
```
There's no need to run the app again.

## Exposed API Endpoints

| URL            | Method | Auth | Description |
|----------------|:------:|:----:|-------------|
| /sessions      | POST   | ![Nope](.github/false.png)  | Retrieves NGO data matching `ong_id` provided on the request body |
| /me            | GET    | ![Yup](.github/true.png)  | Gets the current logged in NGO |
| /ongs          | GET    | ![Nope](.github/false.png)  | Gets a list of all NGOs |
| /ongs          | POST   | ![Nope](.github/false.png)  | Signs up a new NGO |
| /incidents     | GET    | ![Nope](.github/false.png)  | Retrieves a list of all incidents |
| /incidents     | POST   | ![Yup](.github/true.png)  | Adds a new incident to the logged in NGO |
| /incidents/:id | DELETE | ![Yup](.github/true.png)  | Deletes the incident identified by `:id` |


### POST /sessions
Returns the NGO data if the provided `ong_id` matches an existing one on the database.

#### Parameters
|         Name     | Required |  Type   | Description                                                                                                                                                           |
|-----------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ong_id`          | required | string  | The product for which to perform the action.

#### Example
REQUEST
```json
URL: http://localhost:3333/sessions
Method: POST
Headers: -
Body: {
  "ong_id": "22b41f77"
}
```

RESPONSE
```json
Status 200 OK
Body:  {
  "id": "22b41f77",
  "name": "Example NGO",
  "email": "contact@examplengo.org",
  "whatsapp": "81 3200-0000",
  "city": "City",
  "uf": "PE"
}
```

### GET /me
Returns the data for the current logged in NGO. Reads the ong_id from the **Authorization** header.

#### Headers
|         Name     | Required |  Type   | Description    |
|------------------|:--------:|:-------:| -------------- |
|`Authorization`   | required | string  | The NGO id.    |

#### Example
REQUEST
```json
URL: http://localhost:3333/me
Method: GET
Headers: Authorization: 22b41f77
Body: -
```

RESPONSE
```json
Status 200 OK
Body:  {
  "id": "22b41f77",
  "name": "APAD2",
  "email": "contato@apag.org.br",
  "whatsapp": "81 3200-0000",
  "city": "Recife",
  "uf": "PE",
  "incidents": [
    {
      "id": 1,
      "title": "Incident 1",
      "description": "Details",
      "value": 120,
      "ong_id": "22b41f77"
    },
    {
      "id": 2,
      "title": "John Smith needs a wheel chair",
      "description": "Mr John Smith is an elderly man that suffered an accident ...",
      "value": 120,
      "ong_id": "22b41f77"
    }
  ]
}
```

### GET /ongs
Retrieves a list with all registered NGOs.

#### Example
REQUEST
```json
URL: http://localhost:3333/ongs
Method: GET
Headers: -
Body: -
```

RESPONSE
```json
Status 200 OK
Body:  [
  {
    "id": "c17ae95c",
    "name": "Example NGO",
    "email": "contact@exampleong.org",
    "whatsapp": "81 3200-0000",
    "city": "Recife",
    "uf": "PE"
  },
  {
    "id": "3d421867",
    "name": "Example NGO 2",
    "email": "contact@exampleong2.org",
    "whatsapp": "81 3200-0000",
    "city": "Recife",
    "uf": "PE"
  }
]
```

### POST /ongs
Creates a new NGO and returns it's ID. This ID can be used as the `Authorization` header to identify the NGO.

#### Parameters
| Name | Required |  Type   | Description    |
|------|:--------:|:-------:| -------------- |
| Body | required | string  | JSON string containing the NGO data.   |


#### Fields
| Name     | Required |  Type   | Length | Description                             |
|----------|:--------:|:-------:|:------:|-----------------------------------------|
| name     | required | string  |   255  | The NGO's name.                           |
| email    | required | string  |   255  | The NGO's email address.                  |
| whatsapp | required | string  |   255  | The NGO's WhatsApp number (phone number). |
| city     | required | string  |   255  | The NGO's city.                           |
| uf       | required | string  |     2  | The abbreviated form of the NGO's state (stands for unidade federativa in portuguese). |

#### Example
REQUEST
```json
URL: http://localhost:3333/ongs
Method: POST
Headers: -
Body: {
	"name": "Example NGO 2",
	"email": "contact@exampleong2.org",
	"whatsapp": "81 3200-0000",
	"city": "Recife",
	"uf": "PE"
}
```

RESPONSE
```json
Status 200 OK
Body: {
  "id": "3d421867"
}
```

### GET /incidents
Lists incidents registered in the application. This endpoint paginates the incidents with 5 items per page. You can especify the page by providing a `page` URL query parameter.

#### Query Parameters
| Name  | Default | Type    | Description    |
|-------|:-------:|:-------:| -------------- |
|`page` | 1       | integer  | The number of the page. If left blank, defaults to 1.    |

#### Example
REQUEST
```json
URL: http://localhost:3333/incidents?page=2
Method: GET
Headers: -
Body: -
```

RESPONSE
```json
Status 200 OK
Body: [
    {
        "id": 1,
        "title": "Incident 1",
        "description": "Details",
        "value": 120,
        "ong_id": "22b41f77",
        "name": "APAD2",
        "email": "contato@apag.org.br",
        "whatsapp": "81 3200-0000",
        "city": "Recife",
        "uf": "PE"
    },
    ...
    {
        "id": 2,
        "title": "John Smith needs a wheel chair",
        "description": "Mr John Smith is an elderly man that suffered an accident ...",
        "value": 120,
        "ong_id": "22b41f77",
        "name": "APAD2",
        "email": "contato@apag.org.br",
        "whatsapp": "81 3200-0000",
        "city": "Recife",
        "uf": "PE"
    }
]
```

### POST /incidents
Creates a new incident adding it to the current logged in NGO.

#### Headers
| Name          | Required |  Type   | Description |
|---------------|:--------:|:-------:|-------------|
| Authorization | required | string  | The NGO id. |

#### Parameters
| Name | Required |  Type   | Description    |
|------|:--------:|:-------:| -------------- |
| Body | required | string  | JSON string containing the incident data. |


#### Fields
| Name        | Required |  Type   | Length | Description                             |
|-------------|:--------:|:-------:|:------:|-----------------------------------------|
| title       | required | string  |   255  | The incident's title.                    |
| description | required | string  |   255  | The incident's description.                  |
| value       | required | float   |    | The desired amount of money the NGO desires to fund for this incident |


#### Example
REQUEST
```json
URL: http://localhost:3333/incidents
Method: POST
Headers: Authorization: 22b41f77
Body: {
	"title": "John Smith needs a wheel chair",
	"description": "Mr John Smith is an elderly man that suffered an accident ...",
	"value": 120
}
```

RESPONSE
```json
Status 200 OK
Body: {
  "id": 14,
}
```

### DELETE /incidents/:id
Deletes the incident identified by `:id`.
Checks whether the incident's `ong_id` matches the `id` of the logged in NGO or not. If it does, the incident is removed. If not, an error is shown.

#### Headers
| Name          | Required |  Type   | Description |
|---------------|:--------:|:-------:|-------------|
| Authorization | required | string  | The NGO id. |

#### URL Parameters
| Name | Required |  Type   | Description    |
|------|:--------:|:-------:| -------------- |
| id   | required | integer | The id for the incident to be deleted |

#### Example
REQUEST
```json
URL: http://localhost:3333/incidents/14
Method: DELETE
Headers: Authorization: 22b41f77
Body: -
```

RESPONSE
```json
Status 204 No Content
Body: -
```
