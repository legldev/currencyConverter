import axios from "axios";
import React, { useState } from "react";

const CurrencyConverter = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");

  const currencySource = (e) => {
    e.preventDefault();
    const value = e.target.value.toUpperCase();
    const letters = /^[A-Za-z]+$/;

    if (e.target.value.match(letters)) {
      setSource(value);
    } else {
      setSource("");
      return false;
    }

    if (e.target.value.length > 3) {
      const slice = value.slice(0, 3);
      setSource(slice);
    }
  };

  const currencyDestination = (e) => {
    e.preventDefault();
    const value = e.target.value.toUpperCase();
    const letters = /^[A-Za-z]+$/;

    if (e.target.value.match(letters)) {
      setDestination(value);
    } else {
      setDestination("");
      return false;
    }

    if (e.target.value.length > 3) {
      const slice = value.slice(0, 3);
      setDestination(slice);
    }
  };

  const rateDate = (e) => {
    e.preventDefault();
    const value = e.target.value.toUpperCase();
    const numbers = /^[0-9+-]+$/;

    if (e.target.value.match(numbers)) {
      setDate(value);
    } else {
      setDate("");
      return false;
    }

    if (e.target.value.length > 10) {
      const slice = value.slice(0, 10);
      setDate(slice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (source.length < 3 || destination.length < 3 || date.length < 10) {
      setResult("Please complete each field");
    } else {
      await axios
        .get(
          `https://api.exchangeratesapi.io/${date}?base=${source}&symbols=${destination}`
        )
        .then((res) => {
          setResult(res.data.rates[destination]);
        })
        .catch((error) => {
          setResult(error.response.data.error);
        });
    }
  };

  const handleReset = (e) => {
    setSource("");
    setDestination("");
    setResult("");
    setDate("");
  };

  return (
    <form class="container mt-5">
      <div class="row mt-5">
        <div class="col-md-3"></div>
        <div class="col-md-3 d-grid">
          <label for="currency-source">Source symbol</label>
          <label for="currency-destination">Destination symbol</label>
          <label for="currency-date">Date</label>
        </div>
        <div class="col-md-3">
          <input
            className="currency-source"
            placeholder="USD"
            name="currency-source"
            type="text"
            value={source}
            onChange={(e) => currencySource(e)}
          />
          <input
            className="currency-destination"
            placeholder="EUR"
            name="currency-destination"
            value={destination}
            type="text"
            onChange={currencyDestination}
          />
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            name="currency-date"
            value={date}
            className="currency-date"
            onChange={rateDate}
          />
        </div>
        <div class="col-md-3"></div>
      </div>

      <div class="row text-center m-5">
        <div class="col-md-12 p-3">
          <button
            onClick={handleSubmit}
            type="submit"
            name="find-rate"
            className="find-rate"
          >
            Find rate
          </button>
          <button
            onClick={handleReset}
            type="reset"
            name="reset-fields"
            className="reset-fields"
          >
            reset
          </button>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-12"> 
          <div class="Results">
            <div className="conversion-result">
              <p>Result: {result}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CurrencyConverter;
