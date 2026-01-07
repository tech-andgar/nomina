# Basic Payroll App (Nomina básico App) Colombia

 ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D.svg?style=for-the-badge&logo=Vue.js&logoColor=white)
 ![Quasar](https://img.shields.io/badge/Framework%20Quasar-1976D2.svg?style=for-the-badge&logo=Quasar&logoColor=white)

A simple front app that interact with the nomina basico built with Framework Quasar and Vue.JS V3.

## 😎 Demo

- Framework Quasar and Vue.JS V3 frontend [https://tech-andgar.github.io/nomina/](https://tech-andgar.github.io/nomina/)

## 🔥 Features

- Framework Quasar and Vue.JS V3 frontend <!-- ([⚡️ /web](web)) -->
- Frontend deployed in github pages

## 🚀 Server (Scraper)

The server is a web scraper built with **Bun** and **Puppeteer** to extract Colombian salary data.

### Features
- **Multi-Year Support**: Scrapes data and organizes it by year in `server/data/{year}.json`.
- **Automated Verification**: Includes a comprehensive test suite using `bun test`.
- **Latest Data**: Always maintains a `latest.json` for easy access.

### Usage
```bash
# Install dependencies
pnpm install
bun x puppeteer browsers install chrome

# Run the scraper
bun dev

# Run tests
bun test
```

## Installation

No need to install
<!-- Requires [Node.js](https://nodejs.org/) v12 to run.

Install the dependencies and devDependencies and start the server.

##### Frontend

```sh
$ cd web
$ npm install
$ npm start
```

##### Frontend with GraphQl

```sh
$ cd web-with-graphql
$ npm install
$ npm start
```
-->

## 👻 LICENCE

[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
