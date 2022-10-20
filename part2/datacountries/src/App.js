import axios from "axios";
import { useEffect, useState } from "react";

const Weather = ({ weather, country }) => {
  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {weather.main.temp} &deg;C</p>
      <img
        src={
          "http://openweathermap.org/img/wn/" +
          weather.weather[0].icon +
          "@2x.png"
        }
        alt={weather.weather[0].description + " icon"}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </>
  );
};

const Countries = ({ searchResults, showCountry, weather, country }) => {
  if (searchResults.length >= 10) {
    return (
      <>
        <p>Too many matches, specify another filter.</p>
      </>
    );
  } else if (searchResults.length === 1) {
    return (
      <>
        <h1>{country.name}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {country.languages.map((language) => {
            return <li key={language.iso639_1}>{language.name}</li>;
          })}
        </ul>
        <img src={country.flags.png} alt={"Flag of " + country.name} />
        <Weather weather={weather} country={country} />
      </>
    );
  } else {
    return (
      <ul>
        {searchResults.map((country) => {
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
  /* This is an ugly workaround because I don't know how to await
  "weather" to have value before rendering the Weather component */
  const initialWeather = {
    main: {
      temp: 0,
    },
    weather: [{ icon: "", description: "" }],
    wind: { speed: 0 },
  };
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [weather, setWeather] = useState(initialWeather);

  const handleSearchQueryChange = (event) => {
    let value = event.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSearch = (value) => {
    let searchResults = countries.filter((country) =>
      country.name.toLowerCase().includes(value.toLowerCase())
    );
    if (searchResults.length === 1) {
      showCountry(searchResults[0]);
    }
    setSearchResults(searchResults);
  };

  const showCountry = (country) => {
    setCountry(country);
    setSearchResults([country]);
    fetchWeather(country);
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const fetchWeather = (country) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
        console.log(response.data);
      });
  };

  return (
    <>
      <span>Find countries</span>
      <input value={searchQuery} onChange={handleSearchQueryChange} />
      <Countries
        searchResults={searchResults}
        showCountry={showCountry}
        weather={weather}
        country={country}
      />
    </>
  );
};

export default App;
