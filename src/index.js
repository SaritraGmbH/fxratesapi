const fetch = require("isomorphic-fetch");
const { getYear, isAfter } = require("date-fns");
const ExchangeRatesError = require("./exchange-rates-error");
const QueryStringBuilder = require("./query-string-builder");
const currenciesList = require("./currencies");
const utils = require("./utils");

const API_BASE_URL = "https://api.fxratesapi.com";

class ExchangeRates {
  _apiBaseUrl = API_BASE_URL;
  _apiKey = null;
  _endpoint = "latest";
  _base = null;
  _symbols = null;
  _amount = null;
  _places = null;
  _format = null;
  _date = null;
  _startDate = null;
  _endDate = null;
  _accuracy = null;
  _resolution = null;

  constructor(apiKey = process.env.FX_RATES_API_KEY || "") {
    this._apiKey = apiKey;
  }

  _validateCurrency(currency) {
    if (!(currency in currenciesList)) {
      throw new ExchangeRatesError(`${currency} is not a valid currency`);
    }
  }

  _isHistoryRequest() {
    return this._endpoint === "historical" || this._endpoint === "timeseries";
  }

  _validate() {
    if (this._endpoint == "timeseries") {
      if (
        this._startDate &&
        this._endDate &&
        isAfter(this._startDate, this._endDate)
      ) {
        throw new ExchangeRatesError(
          "The 'start_date' cannot be after the 'end_date'"
        );
      }

      if (this._startDate !== null && getYear(this._startDate) < 1999) {
        throw new ExchangeRatesError("Cannot get historical rates before 1999");
      }
    }

    if (this._endpoint === "convert") {
      if (this._amount === null) {
        throw new ExchangeRatesError(
          "The 'amount' parameter is required for the convert endpoint"
        );
      }
    }

    if (this._endpoint === "historical") {
      if (this._date === null) {
        throw new ExchangeRatesError(
          "The 'date' parameter is required for the historical endpoint"
        );
      }

      if (getYear(this._date) < 1999) {
        throw new ExchangeRatesError("Cannot get historical rates before 1999");
      }
    }
  }

  _buildUrl() {
    let url = `${this._apiBaseUrl}/${this._endpoint}`;
    const qs = new QueryStringBuilder();

    if (this._endpoint == "timeseries") {
      if (this._startDate)
        qs.addParam("start_date", utils.formatDate(this._startDate));
      if (this._endDate)
        qs.addParam("end_date", utils.formatDate(this._endDate));
      if (this._accuracy) qs.addParam("accuracy", this._accuracy);
    }

    if (this._endpoint === "convert") {
      if (this._amount) qs.addParam("amount", this._amount);
    }

    if (this._endpoint === "historical") {
      if (this._date) qs.addParam("date", utils.formatDate(this._date));
    }

    if (this._endpoint === "latest") {
      if (this._resolution) qs.addParam("resolution", this._resolution);
    }

    if (this._base) qs.addParam("base", this._base);
    if (this._symbols)
      qs.addParam("currencies", this._symbols.join(","), false);
    if (this._amount) qs.addParam("amount", this._amount);
    if (this._places) qs.addParam("places", this._places);
    if (this._format) qs.addParam("format", this._format);

    if (this._apiKey) qs.addParam("api_key", this._apiKey);

    qs.addParam("p", "nodejs");

    return url + qs;
  }

  at(date) {
    this._date = utils.parseDate(date);
    this._endpoint = "historical";
    return this;
  }

  from(date) {
    this._startDate = utils.parseDate(date);
    this._endpoint = "timeseries";
    return this;
  }

  to(date) {
    this._endDate = utils.parseDate(date);
    this._endpoint = "timeseries";
    return this;
  }

  accuracy(value) {
    this._accuracy = value;
    return this;
  }

  resolution(value) {
    this._resolution = value;
    return this;
  }

  amount(value) {
    this._amount = value;
    return this;
  }

  places(value) {
    this._places = value;
    return this;
  }

  format(value) {
    this._format = value;
    return this;
  }

  base(currency) {
    if (typeof currency !== "string") {
      throw new TypeError("Base currency has to be a string");
    }

    const currencyUpper = currency.toUpperCase();
    this._validateCurrency(currencyUpper);

    this._base = currencyUpper;
    return this;
  }

  symbols(currencies) {
    const currenciesArray = Array.isArray(currencies)
      ? currencies
      : [currencies];

    for (let i = 0; i < currenciesArray.length; i += 1) {
      let currency = currenciesArray[i];

      if (typeof currency !== "string") {
        throw new TypeError("Symbol currencies have to be strings");
      }

      currency = currency.toUpperCase();
      this._validateCurrency(currency);

      currenciesArray[i] = currency;
    }

    this._symbols = currenciesArray;
    return this;
  }

  url() {
    this._validate();
    return this._buildUrl();
  }

  async fetch() {
    try {
      const response = await fetch(this._buildUrl());

      if (response.status !== 200) {
        throw new ExchangeRatesError(
          `API returned a bad response (HTTP ${response.status})`
        );
      }

      const data = await response.json();
      const keys = Object.keys(data.rates);
      return keys.length === 1 ? data.rates[keys[0]] : data.rates;
    } catch (err) {
      console.log(err);
      throw new ExchangeRatesError(
        `Couldn't fetch the exchange rate, ${err.message}`
      );
    }
  }

  async avg(decimalPlaces = null) {
    if (
      decimalPlaces !== null &&
      (!Number.isInteger(decimalPlaces) || decimalPlaces < 0)
    ) {
      throw new ExchangeRatesError(
        "The decimal places parameter has to be a non-negative integer"
      );
    }

    const rates = await this.fetch();

    if (!this._isHistoryRequest()) return rates;

    const mergedObj = {};
    Object.values(rates).forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        mergedObj[key] = mergedObj[key] || [];
        mergedObj[key].push(obj[key]);
      });
    });

    const avgRates = {};
    const keys = Object.keys(mergedObj);
    keys.forEach((key) => {
      const avgRate =
        mergedObj[key].reduce((p, c) => p + c, 0) / mergedObj[key].length;
      avgRates[key] =
        decimalPlaces === null ? avgRate : +avgRate.toFixed(decimalPlaces);
    });

    return keys.length === 1 ? avgRates[keys[0]] : avgRates;
  }
}

module.exports = ExchangeRates;
