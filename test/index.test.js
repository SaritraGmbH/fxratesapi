require("isomorphic-fetch");
//const fetchMock = require('fetch-mock');
const { expect } = require("chai");

// to use the library, import it like this:
// run npm link in the root of the project
// run npm link exchange-rates-api in the project you want to use it in ( ie cd to test and the run the command )

const fxRatesAPI = require("fxratesapi");
const fx = () => new fxRatesAPI();

describe("Fetch the latest exchange rates", function () {
  describe("/latest", function () {
    it("Should request /latest", async function () {
      let response = await fx().fetch();
      expect(!!response).to.be.true;
    });

    it("Should eventually return an object", async function () {
      expect(await fx().fetch()).to.be.an("object");
    });

    it("Should eventually return an object where all of its keys seem like currencies", async function () {
      Object.keys(await fx().fetch()).every((currency) =>
        expect(currency).to.match(/^[A-Z]{2,3}$/)
      );
    });

    it("Should eventually return an object where all of its values are numbers", async function () {
      Object.values(await fx().fetch()).every((rate) =>
        expect(rate).to.be.a("number")
      );
    });
  });
});

describe("Fetch the historical exchange rates", function () {
  describe("/historical", function () {
    it("Should request /historical", async function () {
      let response = await fx().at("2022-11-12").fetch();
      expect(!!response).to.be.true;
    });

    it("Should eventually return an object", async function () {
      expect(await fx().at("2022-11-12").fetch()).to.be.an("object");
    });

    it("Should eventually return an object where all of its keys seem like currencies", async function () {
      Object.keys(await fx().at("2022-11-12").fetch()).every((currency) =>
        expect(currency).to.match(/^[A-Z]{2,3}$/)
      );
    });

    it("Should eventually return an object where all of its values are numbers", async function () {
      Object.values(await fx().at("2022-11-12").fetch()).every((rate) =>
        expect(rate).to.be.a("number")
      );
    });
  });
});

describe("Check url builder", function () {
  it("Should return the correct url for the latest endpoint", async function () {
    let url = await fx().url();
    console.log(url);
    expect(url).to.equal("https://api.fxratesapi.com/latest?p=nodejs");
  });

  it("Should return the correct url for the historical endpoint", async function () {
    let url = await fx().at("2022-11-12").url();
    expect(url).to.equal("https://api.fxratesapi.com/historical?date=2022-11-12&p=nodejs");
  });


  it("Should pass the specified 'start_at' and 'end_at' parameters for ISO 8601 dates", async function () {
    let url = await fx().from("2018-06-01").to("2018-06-21").url();
    expect(url).to.equal(
      "https://api.fxratesapi.com/timeseries?start_date=2018-06-01&end_date=2018-06-21&p=nodejs"
    );
  });

  it("Should pass the specified 'start_at' and 'end_at' parameters for date objects", async function () {
    let url = await fx()
      .from(new Date(2018, 5, 1))
      .to(new Date(2018, 5, 14))
      .url();
    expect(url).to.equal(
      "https://api.fxratesapi.com/timeseries?start_date=2018-06-01&end_date=2018-06-14&p=nodejs"
    );
  });

  it("Should pass the specified 'start_at' and 'end_at' parameters for date strings", async function () {
    let url = await fx().from("June 1, 2018").to("June 18, 2018").url();
    expect(url).to.equal(
      "https://api.fxratesapi.com/timeseries?start_date=2018-06-01&end_date=2018-06-18&p=nodejs"
    );
  });
});
