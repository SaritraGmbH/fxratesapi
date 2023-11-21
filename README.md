# Exchange Rates

💰🌍 An unofficial [node.js](https://nodejs.org/) wrapper for the awesome and free [fxratesapi.com](https://fxratesapi.com/), which provides exchange rate lookups for over 175 globval currencies updated every minute.

## Table of Contents

* [Installation](#-installation)
* [Usage](#-usage)
* [Supported Currencies](#-supported-currencies)
* [Bugs & Features](#-bugs-features)
* [Documentation](#-documentation)
* [Unit Testing](#-unit-testing)
* [Dependencies](#-dependencies)
* [License](#-license)

## 📦 Installation

```
$ npm i fxratesapi
```

## ⌨️ Usage

Once you [have installed the npm package](#-installation) you can start using it immediately. [fxRatesAPI](https://fxratesapi.com/) does **not** require you to sign up, generate API keys etc.

### Latest & specific date rates

```javascript
const { exchangeRates } = require('fxratesapi');

(async () => {
    // Get the latest exchange rates
    await exchangeRates().latest().fetch();                             // {THB: 34.978, PHP: 58.159, …, HUF: 323.58}

    // Get historical rates for any day since 1999
    await exchangeRates().at('2018-03-26').fetch();                     // {THB: 38.66, PHP: 64.82, …, HUF: 312.73}

    // By default, the base currency is EUR, but it can be changed
    await exchangeRates().latest().base('USD').fetch();                 // {THB: 30.9348191386, …, HUF: 286.1767046962}

    // Request specific exchange rates
    await exchangeRates().latest().symbols(['USD', 'GBP']).fetch();     // {USD: 1.1307, GBP: 0.89155}

    // Request one specific exchange rate
    await exchangeRates().latest().symbols('USD').fetch();              // 1.1307
})();
```

### Rates history

```javascript
const { exchangeRates } = require('fxratesapi');

(async () => {
    // Get historical rates for a time period
    await exchangeRates().from('2018-01-01').to('2018-09-01').fetch();
    // outputs: { '2018-02-28': { THB: 38.613, …, HUF: 313.97 }, …, { '2018-06-07': { … } } }

    // Limit results to specific exchange rates to save bandwidth
    await exchangeRates()
        .from('2018-01-01').to('2018-09-01')
        .symbols(['ILS', 'JPY'])
        .fetch();

    // Quote the historical rates against a different currency
    await exchangeRates().from('2018-01-01').to('2018-09-01').base('USD');
})();
```

### Different ways to pass a date

```javascript
const { exchangeRates } = require('fxratesapi');

(async () => {
    // Pass an YYYY-MM-DD (ISO 8601) string
    await exchangeRates().at('2018-09-01').fetch();

    // Pass another string
    await exchangeRates().at('September 1, 2018').fetch();

    // Pass a Date object
    await exchangeRates().at(new Date(2019, 8, 1)).fetch();
})();
```

### Currencies object

```javascript
const { exchangeRates, currencies } = require('fxratesapi');

(async () => {
    await exchangeRates().latest()
        .base(currencies.USD)
        .symbols([currencies.EUR, currencies.GBP])
        .fetch();
})();
```

### Average rate for a specific time period

```javascript
const { exchangeRates } = require('fxratesapi');

(async () => {
    // Find the average exchange rate for January, 2018
    await exchangeRates()
        .from('2018-01-01').to('2018-01-31')
        .base('USD').symbols('EUR')
        .avg();     // 0.8356980613403501

    // Set the number of decimal places
    await exchangeRates()
        .from('2018-01-01').to('2018-01-31')
        .base('USD').symbols(['EUR', 'GBP'])
        .avg(2);    // { EUR: 0.84, GBP: 0.74 }
})();
```

### Convert

```javascript
const { convert } = require('fxratesapi');

(async () => {
    let amount = await convert(2000, 'USD', 'EUR', '2018-01-01');
    console.log(amount);    // 1667.6394564000002
})();
```

### API URL

```javascript
const { exchangeRates } = require('fxratesapi');

// Grab the url we're going to request
let url = exchangeRates()
    .from('2018-01-01').to('2018-09-01')
    .base('USD').symbols(['EUR', 'GBP'])
    .url;

console.log(url);
// https://api.fxratesapi.com/history?start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=EUR,GBP
```


### Error handling

```javascript
const { exchangeRates } = require('fxratesapi');

/* `ExchangeRatesError` and `TypeError` are explicitly thrown
 * sometimes, so you might want to handle them */

// async/await syntax
(async () => {
    try {
        /* This will throw an `ExchangeRateError` with the error
         * message 'Cannot get historical rates before 1999' */
        let rates = await exchangeRates().at('1990-01-01').fetch();
    } catch (error) {
        // Handle the error
    }
})();

// Promises syntax
exchangeRates().at('1990-01-01').fetch()
    .then(rates => {})
    .catch(error => {
        // Handle the error
    });
```

## 💰 Supported Currencies

The library supports any currency currently available on the European Central Bank's web service, which at the time of the latest release are as follows:

- Australian Dollar (AUD)
- Brazilian Real (BRL)
- British Pound Sterline (GBP)
- Bulgarian Lev (BGN)
- Canadian Dollar (CAD)
- Chinese Yuan Renminbi (CNY)
- Croatian Kuna (HRK)
- Czech Koruna (CZK)
- Danish Krone (DKK)
- Euro (EUR)
- Hong Kong Dollar (HKD)
- Hungarian Forint (HUF)
- Icelandic Krona (ISK)
- Indonesian Rupiah (IDR)
- Indian Rupee (INR)
- Israeli Shekel (ILS)
- Japanese Yen (JPY)
- Malaysian Ringgit (MYR)
- Mexican Peso (MXN)
- New Zealand Dollar (NZD)
- Norwegian Krone (NOK)
- Philippine Peso (PHP)
- Polish Zloty (PLN)
- Romanian Leu (RON)
- Russian Rouble (RUB)
- Singapore Dollar (SGD)
- South African Rand (ZAR)
- South Korean Won (KRW)
- Swedish Krona (SEK)
- Swiss Franc (CHF)
- Thai Baht (THB)
- Turkish Lira (TRY)
- US Dollar (USD)


**Development dependencies**

* [Chai](https://www.chaijs.com/) — a BDD / TDD assertion library for node and the browser
* [Mocha](https://mochajs.org/) — a feature-rich JavaScript test framework running on Node.js and in the browser
* [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/) — allows mocking http requests made using fetch or a library imitating its api, such as node-fetch or fetch-ponyfill

## 🗄 Dependencies

* [date-fns](https://www.npmjs.com/package/date-fns) — Modern JavaScript date utility library
* [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) — Isomorphic WHATWG Fetch API, for Node & Browserify

## 📖 License

The MIT License, check the `LICENSE` file