# Reddit clone

This is an app inspired by reddit which uses React for the frontend paired with an Express + PostgresSQL backend.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Git installed
- Node.js installed
- PostgresSQL installed

### Installing

```
git clone https://github.com/Wahuh/be-nc-news.git
```

Install dependencies

```
npm install
```

Create a `knexfile.js` in the root of your local respository that looks like this:

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "your_psql_username",
      password: "your_psql_password"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "your_psql_username",
      password: "your_psql_password"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

Create your test and dev databases

```
npm run setup-dbs
```

Start the dev server

```
npm run dev
```

## Running the tests

```
npm t
```

## Deployment

The server is deployed at: https://speedwagon-server.herokuapp.com/

## Built With

- Express
- PostgresSQL

## Contributing

See CONTRIBUTING.md

## Authors

- Thanh Doan

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
