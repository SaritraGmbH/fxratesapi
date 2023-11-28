# Exchange Rates

💰🌍 An unofficial [node.js](https://nodejs.org/) wrapper for the awesome and free [fxratesapi.com](https://fxratesapi.com/), which provides exchange rate lookups for over 175 global currencies updated every minute.

## Table of Contents

* [Installation](#-installation)
* [Usage](#-usage)
* [Supported Currencies](#-supported-currencies)
* [Dependencies](#-dependencies)
* [License](#-license)

## 📦 Installation

```
$ npm i fxratesapi
```

## ⌨️ Usage & Authentication

Once you [have installed the npm package](#-installation) you can start using it immediately. [fxRatesAPI](https://fxratesapi.com/) does **not** require you to sign up, generate API keys etc.

However, if you want to use the [convert](#convert) method, you need to [sign up](https://fxratesapi.com/signup) for a free account and get an API key. The API key is not required for the other methods. You are also subject to lower rate limits if you don't use an API key.


## 📡 Endpoints

### Latest & specific date rates

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = new fxRatesAPI('apikey'); // api key is not required

(async () => {
    // Get the latest exchange rates
    await fx.latest().fetch();                             // {THB: 34.978, PHP: 58.159, …, HUF: 323.58}

    // Get historical rates for any day since 1999
    await fx.at('2018-03-26').fetch();                     // {THB: 38.66, PHP: 64.82, …, HUF: 312.73}

    // By default, the base currency is EUR, but it can be changed
    await fx.latest().base('USD').fetch();                 // {THB: 30.9348191386, …, HUF: 286.1767046962}

    // Request specific exchange rates
    await fx.latest().symbols(['USD', 'GBP']).fetch();     // {USD: 1.1307, GBP: 0.89155}

    // Request one specific exchange rate
    await fx.latest().symbols('USD').fetch();              // 1.1307
})();
```

### Rates history

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

(async () => {
    // Get historical rates for a time period
    await fx().from('2018-01-01').to('2018-09-01').fetch();
    // outputs: { '2018-02-28': { THB: 38.613, …, HUF: 313.97 }, …, { '2018-06-07': { … } } }

    // Limit results to specific exchange rates to save bandwidth
    await fx()
        .from('2018-01-01').to('2018-09-01')
        .symbols(['ILS', 'JPY'])
        .fetch();

    // Quote the historical rates against a different currency
    await fx().from('2018-01-01').to('2018-09-01').base('USD');
})();
```

### Different ways to pass a date

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

(async () => {
    // Pass an YYYY-MM-DD (ISO 8601) string
    await fx().at('2018-09-01').fetch();

    // Pass another string
    await fx().at('September 1, 2018').fetch();

    // Pass a Date object
    await fx().at(new Date(2019, 8, 1)).fetch();
})();
```

### Currencies object

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = new fxRatesAPI('apikey'); // api key is not required

(async () => {
    await fx().latest()
        .base(currencies.USD)
        .symbols([currencies.EUR, currencies.GBP])
        .fetch();
})();
```

### Average rate for a specific time period

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

(async () => {
    // Find the average exchange rate for January, 2018
    await fx()
        .from('2018-01-01').to('2018-01-31')
        .base('USD').symbols('EUR')
        .avg();     // 0.8356980613403501

    // Set the number of decimal places
    await fx()
        .from('2018-01-01').to('2018-01-31')
        .base('USD').symbols(['EUR', 'GBP'])
        .avg(2);    // { EUR: 0.84, GBP: 0.74 }
})();
```

### Convert

```javascript
conconst fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

(async () => {
    let amount = await fx().convert(2000, 'USD', 'EUR', '2018-01-01');
    console.log(amount);    // 1667.6394564000002
})();
```

### API URL

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

// Grab the url we're going to request
let url = fx()
    .from('2018-01-01').to('2018-09-01')
    .base('USD').symbols(['EUR', 'GBP'])
    .url;

console.log(url);
// https://api.fxratesapi.com/historical?start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=EUR,GBP
```


### Error handling

```javascript
const fxRatesAPI  = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey"); // api key is not required

/* `ExchangeRatesError` and `TypeError` are explicitly thrown
 * sometimes, so you might want to handle them */

// async/await syntax
(async () => {
    try {
        /* This will throw an `ExchangeRateError` with the error
         * message 'Cannot get historical rates before 1999' */
        let rates = await fx().at('1990-01-01').fetch();
    } catch (error) {
        // Handle the error
    }
})();

// Promises syntax
fx().at('1990-01-01').fetch()
    .then(rates => {})
    .catch(error => {
        // Handle the error
    });
```

## 💰 Supported Currencies

This list has been last updated on 22. November 2023. For the latest list, please check the [currency list](https://fxratesapi.com/docs/currency-list) on the fxratesapi website.

The library supports all **184** currencies listed on the [fxratesapi](https://fxratesapi.com/) website. The following table lists all supported currencies, their currency codes, and their symbols:

| CODE  | NAME                                | SYMBOL |
|-------|-------------------------------------|--------|
| AFN   | Afghan Afghani                      | Af     |
| ALL   | Albanian Lek                        | ALL    |
| AMD   | Armenian Dram                       | AMD    |
| ANG   | NL Antillean Guilder                | ƒ      |
| AOA   | Angolan Kwanza                      | Kz     |
| ARS   | Argentine Peso                      | AR$    |
| AUD   | Australian Dollar                   | AU$    |
| AWG   | Aruban Florin                       | Afl.   |
| AZN   | Azerbaijani Manat                   | man.   |
| BAM   | Bosnia-Herzegovina Convertible Mark | KM     |
| BBD   | Barbadian Dollar                    | Bds$   |
| BDT   | Bangladeshi Taka                    | Tk     |
| BGN   | Bulgarian Lev                       | BGN    |
| BHD   | Bahraini Dinar                      | BD     |
| BIF   | Burundian Franc                     | FBu    |
| BMD   | Bermudan Dollar                     | BD$    |
| BND   | Brunei Dollar                       | BN$    |
| BOB   | Bolivian Boliviano                  | Bs     |
| BRL   | Brazilian Real                      | R$     |
| BSD   | Bahamian Dollar                     | B$     |
| BWP   | Botswanan Pula                      | BWP    |
| BYN   | Belarusian ruble                    | Br     |
| BYR   | Belarusian Ruble                    | BYR    |
| BZD   | Belize Dollar                       | BZ$    |
| CAD   | Canadian Dollar                     | CA$    |
| CDF   | Congolese Franc                     | CDF    |
| CHF   | Swiss Franc                         | CHF    |
| CLF   | Unidad de Fomento                   | UF     |
| CLP   | Chilean Peso                        | CL$    |
| CNY   | Chinese Yuan                        | CN¥    |
| COP   | Coombian Peso                       | CO$    |
| CRC   | Costa Rican Colón                   | ₡      |
| CUC   | Cuban Convertible Peso              | CUC$   |
| CUP   | Cuban Peso                          | $MN    |
| CVE   | Cape Verdean Escudo                 | CV$    |
| CZK   | Czech Republic Koruna               | Kč     |
| DJF   | Djiboutian Franc                    | Fdj    |
| DKK   | Danish Krone                        | Dkr    |
| DOP   | Dominican Peso                      | RD$    |
| DZD   | Algerian Dinar                      | DA     |
| ERN   | Eritrean Nakfa                      | Nfk    |
| ETB   | Ethiopian Birr                      | Br     |
| EUR   | Euro                                | €      |
| FJD   | Fijian Dollar                       | FJ$    |
| FKP   | Falkland Islands Pound              | FK£    |
| GBP   | British Pound Sterling              | £      |
| GEL   | Georgian Lari                       | GEL    |
| GGP   | Guernsey pound                      | £      |
| GHS   | Ghanaian Cedi                       | GH₵    |
| GIP   | Gibraltar Pound                     | £      |
| GMD   | Gambian Dalasi                      | D      |
| GNF   | Guinean Franc                       | FG     |
| GTQ   | Guatemalan Quetzal                  | GTQ    |
| GYD   | Guyanaese Dollar                    | G$     |
| HKD   | Hong Kong Dollar                    | HK$    |
| HNL   | Honduran Lempira                    | HNL    |
| HRK   | Croatian Kuna                       | kn     |
| HTG   | Haitian Gourde                      | G      |
| HUF   | Hungarian Forint                    | Ft     |
| IDR   | Indonesian Rupiah                   | Rp     |
| ILS   | Israeli New Sheqel                  | ₪      |
| IMP   | Manx pound                          | £      |
| IQD   | Iraqi Dinar                         | IQD    |
| IRR   | Iranian Rial                        | IRR    |
| ISK   | Icelandic Króna                     | Ikr    |
| JEP   | Jersey pound                        | £      |
| JMD   | Jamaican Dollar                     | J$     |
| JOD   | Jordanian Dinar                     | JD     |
| JPY   | Japanese Yen                        | ¥      |
| KES   | Kenyan Shilling                     | Ksh    |
| KGS   | Kyrgystani Som                      | KGS    |
| KHR   | Cambodian Riel                      | KHR    |
| KMF   | Comorian Franc                      | CF     |
| KPW   | North Korean Won                    | ₩      |
| KRW   | South Korean Won                    | ₩      |
| KWD   | Kuwaiti Dinar                       | KD     |
| KYD   | Cayman Islands Dollar               | CI$    |
| KZT   | Kazakhstani Tenge                   | KZT    |
| LAK   | Laotian Kip                         | ₭N     |
| LBP   | Lebanese Pound                      | LB£    |
| LKR   | Sri Lankan Rupee                    | SLRs   |
| LRD   | Liberian Dollar                     | LD$    |
| LSL   | Lesotho Loti                        | L      |
| LTL   | Lithuanian Litas                    | Lt     |
| LVL   | Latvian Lats                        | Ls     |
| MAD   | Moroccan Dirham                     | MAD    |
| MDL   | Moldovan Leu                        | MDL    |
| XAG   | Silver Ounce                        | XAG    |
| XAU   | Gold Ounce                          | XAU    |
| XCD   | East Caribbean Dollar               | EC$    |
| XDR   | Special drawing rights              | SDR    |
| XOF   | CFA Franc BCEAO                     | CFA    |
| XPF   | CFP Franc                           | CFP    |
| YER   | Yemeni Rial                         | YR     |
| ZAR   | South African Rand                  | R      |
| ZMK   | Zambian Kwacha                      | ZK     |
| ZMW   | Zambian Kwacha                      | ZK     |
| ZWL   | Zimbabwean dollar                   | ZWL    |
| XPT   | Platinum Ounce                      | XPT    |
| XPD   | Palladium Ounce                     | XPD    |
| BTC   | Bitcoin                             | ₿      |
| ETH   | Ethereum                            | Ξ      |
| BNB   | Binance                             | BNB    |
| XRP   | Ripple                              | XRP    |
| SOL   | Solana                              | SOL    |
| DOT   | Polkadot                            | DOT    |
| AVAX  | Avalanche                           | AVAX   |
| MATIC | Matic Token                         | MATIC  |
| LTC   | Litecoin                            | Ł      |
| ADA   | Cardano                             | ADA    |
| USDT  | Tether                              | USDT   |
| USDC  | USD Coin                            | USDC   |
| DAI   | Dai                                 | DAI    |
| BUSD  | Binance USD                         | BUSD   |
| ARB   | Arbitrum                            | ARB    |
| OP    | Optimism                            | OP     |
| AED   | United Arab Emirates Dirham         | AED    |
| BTN   | Bhutanese Ngultrum                  | Nu.    |
| MKD   | Macedonian Denar                    | MKD    |
| MMK   | Myanma Kyat                         | MMK    |
| MNT   | Mongolian Tugrik                    | ₮      |
| MOP   | Macanese Pataca                     | MOP$   |
| MRO   | Mauritanian ouguiya                 | UM     |
| MUR   | Mauritian Rupee                     | MURs   |
| MVR   | Maldivian Rufiyaa                   | MRf    |
| MWK   | Malawian Kwacha                     | MK     |
| MXN   | Mexican Peso                        | MX$    |
| MZN   | Mozambican Metical                  | MTn    |
| NAD   | Namibian Dollar                     | N$     |
| NGN   | Nigerian Naira                      | ₦      |
| NIO   | Nicaraguan Córdoba                  | C$     |
| NOK   | Norwegian Krone                     | Nkr    |
| NPR   | Nepalese Rupee                      | NPRs   |
| NZD   | New Zealand Dollar                  | NZ$    |
| OMR   | Omani Rial                          | OMR    |
| PAB   | Panamanian Balboa                   | B/.    |
| PEN   | Peruvian Nuevo Sol                  | S/.    |
| PGK   | Papua New Guinean Kina              | K      |
| PHP   | Philippine Peso                     | ₱      |
| PKR   | Pakistani Rupee                     | PKRs   |
| PLN   | Polish Zloty                        | zł     |
| PYG   | Paraguayan Guarani                  | ₲      |
| QAR   | Qatari Rial                         | QR     |
| RON   | Romanian Leu                        | RON    |
| RSD   | Serbian Dinar                       | din.   |
| RUB   | Russian Ruble                       | RUB    |
| RWF   | Rwandan Franc                       | RWF    |
| SAR   | Saudi Riyal                         | SR     |
| SCR   | Seychellois Rupee                   | SRe    |
| SDG   | Sudanese Pound                      | SDG    |
| SEK   | Swedish Krona                       | Skr    |
| SGD   | Singapore Dollar                    | S$     |
| SHP   | Saint Helena Pound                  | £      |
| SLL   | Sierra Leonean Leone                | Le     |
| SOS   | Somali Shilling                     | Ssh    |
| SRD   | Surinamese Dollar                   | $      |
| STD   | São Tomé and Príncipe dobra         | Db     |
| SVC   | Salvadoran Colón                    | ₡      |
| SYP   | Syrian Pound                        | SY£    |
| SZL   | Swazi Lilangeni                     | L      |
| THB   | Thai Baht                           | ฿      |
| TJS   | Tajikistani Somoni                  | TJS    |
| TMT   | Turkmenistani Manat                 | T      |
| TND   | Tunisian Dinar                      | DT     |
| TOP   | Tongan Paʻanga                      | T$     |
| TRY   | Turkish Lira                        | TL     |
| TTD   | Trinidad and Tobago Dollar          | TT$    |
| TWD   | New Taiwan Dollar                   | NT$    |
| TZS   | Tanzanian Shilling                  | TSh    |
| UAH   | Ukrainian Hryvnia                   | ₴      |
| UGX   | Ugandan Shilling                    | USh    |
| USD   | US Dollar                           | $      |
| UYU   | Uruguayan Peso                      | $U     |
| VEF   | Venezuelan Bolívar                  | Bs.F.  |
| VND   | Vietnamese Dong                     | ₫      |
| VUV   | Vanuatu Vatu                        | VUV    |
| WST   | Samoan Tala                         | WS$    |
| XAF   | CFA Franc BEAC                      | FCFA   |
| EGP   | Egyptian Pound                      | EGP    |
| INR   | Indian Rupee                        | Rs     |
| LYD   | Libyan Dinar                        | LD     |
| MGA   | Malagasy Ariary                     | MGA    |
| MYR   | Malaysian Ringgit                   | RM     |
| SBD   | Solomon Islands Dollar              | SI$    |
| UZS   | Uzbekistan Som                      | UZS    |

## 🗄 Dependencies

* [date-fns](https://www.npmjs.com/package/date-fns) — Modern JavaScript date utility library
* [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) — Isomorphic WHATWG Fetch API, for Node & Browserify

**Development dependencies**

* [Chai](https://www.chaijs.com/) — a BDD / TDD assertion library for node and the browser
* [Mocha](https://mochajs.org/) — a feature-rich JavaScript test framework running on Node.js and in the browser

## 📖 License

The MIT License, check the `LICENSE` file