import axios from "axios";
import { useEffect, useState } from "react";

const Countries = ({ countries, showCountry }) => {
  if (countries.length >= 10) {
    return (
      <>
        <p>Too many matches, specify another filter.</p>
      </>
    );
  } else if (countries.length === 1) {
    return (
      <>
        <h1>{countries[0].name}</h1>
        <p>Capital: {countries[0].capital}</p>
        <p>Area: {countries[0].area}</p>
        <h2>Languages</h2>
        <ul>
          {countries[0].languages.map((language) => {
            return <li key={language.iso639_1}>{language.name}</li>;
          })}
        </ul>
        <img
          src={countries[0].flags.png}
          alt={"Flag of " + countries[0].name}
        />
      </>
    );
  } else {
    return (
      <ul>
        {countries.map((country) => {
          return (
            <li key={country.alpha2Code}>
              <span>{country.name}</span>
              <button onClick={() => showCountry(country)}>Show</button>
            </li>
          );
        })}
      </ul>
    );
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchQueryChange = (event) => {
    let value = event.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSearch = (value) => {
    let searchResults = countries.filter((country) =>
      country.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(searchResults);
  };

  const showCountry = (country) => {
    setSearchResults([country]);
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  return (
    <>
      <span>Find countries</span>
      <input value={searchQuery} onChange={handleSearchQueryChange} />
      <Countries countries={searchResults} showCountry={showCountry} />
    </>
  );
};

export default App;
