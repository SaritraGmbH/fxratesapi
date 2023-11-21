require("isomorphic-fetch");
//const fetchMock = require('fetch-mock');
const { expect } = require("chai");
const fs = require("fs");

// to use the library, import it like this:
// run npm link in the root of the project
// run npm link exchange-rates-api in the project you want to use it in ( ie cd to test and the run the command )

const fxRatesAPI = require("fxratesapi");
const fx = () => new fxRatesAPI("apikey");

describe("Fetch the latest exchange rates", function () {
  describe("#latest()", function () {
    it("Should request /latest", async function () {
      let response = await fx().latest().fetch();
      expect(!!response).to.be.true;
    });

    it("Should eventually return an object", async function () {
      expect(await fx().latest().fetch()).to.be.an("object");
    });

    it("Should eventually return an object where all of its keys seem like currencies", async function () {
      Object.keys(await fx().latest().fetch()).every((currency) =>
        expect(currency).to.match(/^[A-Z]{2,3}$/)
      );
    });

    it("Should eventually return an object where all of its values are numbers", async function () {
      Object.values(await fx().latest().fetch()).every((rate) =>
        expect(rate).to.be.a("number")
      );
    });
  });
});
