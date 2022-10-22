import { useEffect, useState } from "react";
import personsService from "./services/persons";

const Filter = ({ searchQuery, onChange }) => {
  return (
    <div>
      Filter by name: <input value={searchQuery} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addName,
}) => {
  return (
    <form>
      <PersonInput label="name" value={newName} onChange={handleNameChange} />
      <PersonInput
        label="number"
        value={newNumber}
        onChange={handleNumberChange}
      />
      <button type="submit" onClick={addName}>
        add
      </button>
    </form>
  );
};

const PersonInput = ({ label, value, onChange }) => {
  return (
    <div>
      {label} <input value={value} onChange={onChange} />
    </div>
  );
};

const Persons = ({ persons }) => {
  return (
    <>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const baseUrl = "http://localhost:3001";

  useEffect(() => {
    personsService.getAll().then((intialPersons) => {
      setPersons(intialPersons);
      setSearchResults(intialPersons);
    });
  }, []);

  console.log(persons);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (value) => {
    let searchResults = persons.filter((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(searchResults);
  };

  const handleQueryChange = (event) => {
    let value = event.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const addName = (event) => {
    event.preventDefault();
    const phonebookRecordObject = {
      name: newName,
      number: newNumber,
    };
    let isDuplicate = persons.filter((person) => person.name === newName);
    if (isDuplicate.length > 0) {
      alert(`${newName} already exists.`);
    } else {
      personsService.create(phonebookRecordObject).then((newPerson) => {
        let newPersons = persons.concat(newPerson);
        setPersons(newPersons);
        setSearchResults(newPersons);
        setSearchQuery("");
      });
    }
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} onChange={handleQueryChange} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={searchResults} />
    </div>
  );
};

export default App;
