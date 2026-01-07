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
- **Single Source of Truth**: Consolidates all yearly data into `assets/data/yearly_data.json` for frontend usage.
- **Automated Verification**: Includes a comprehensive test suite using `bun test`.

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

## 💼 Esquema de Presunción de Costos (Independientes)

Implementación del esquema de presunción de costos según la **Resolución 532 de 2024** de la UGPP permitiendo a los trabajadores independientes deducir un porcentaje fijo de sus ingresos brutos antes de calcular su IBC.

**Fórmula:**
`IBC = (Ingreso Bruto - Costos Presuntos) * 40%`

### Tabla de Actividades Económicas

| Actividad Económica | % Costos Deducibles |
| :--- | :--- |
| **COMERCIO** (Mayor y Menor) | 75.9% |
| **MINERÍA** (Explotación de minas) | 74.0% |
| **AGROPECUARIO** (Sector agropecuario) | 73.9% |
| **ALOJAMIENTO Y COMIDA** | 71.0% |
| **MANUFACTURA** (Industrias manufactureras) | 70.0% |
| **EDUCACIÓN** | 68.3% |
| **CONSTRUCCIÓN** | 67.9% |
| **TRANSPORTE Y ALMACENAMIENTO** | 66.5% |
| **INMOBILIARIAS** | 65.7% |
| **ARTÍSTICAS** | 65.5% |
| **DEMÁS ACTIVIDADES** | 64.7% |
| **SERVICIOS ADMINISTRATIVOS** | 64.2% |
| **OTRAS ACTIVIDADES DE SERVICIOS** | 63.8% |
| **INFORMACIÓN Y COMUNICACIÓN** | 63.2% |
| **PROFESIONALES** | 61.9% |
| **ATENCIÓN SALUD** | 59.7% |
| **FINANCIERAS** | 57.2% |
| **RENTISTAS DE CAPITAL** | 27.5% |

### Uso

El sistema selecciona automáticamente el porcentaje basado en la `actividadEconomica` del colaborador. También soporta un override manual mediante `porcentajeCostos`.

## 👻 LICENCE

[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
