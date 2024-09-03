<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

This project is my representation Test Task solution I've received from Dzen Company.

## Installation

PRESEQUISITES: You need to have docker installed on your machine.

```bash
$ npm install
```

NOTE: command above is a must for running in development mode, since we are not actully building an app, we are just
mounting it to the directory.

## Running the app

```bash
# production mode(recommended)
$ docker compose up -d
# development
$ docker compose -f docker-compose.dev.yaml up -d
```

NOTE: First run of Elastic Search can take some time, so partial search and indexing can be unavailable for a while.

Swagger API documentation is available at http://localhost:3000/api

## License

Nest is [MIT licensed](LICENSE).
