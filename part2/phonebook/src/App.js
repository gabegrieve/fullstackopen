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

const Persons = ({ persons, deletePerson }) => {
  return (
    <>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
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

  useEffect(() => {
    getAllPersons();
  }, []);

  const getAllPersons = () => {
    personsService.getAll().then((intialPersons) => {
      setPersons(intialPersons);
      setSearchResults(intialPersons);
    });
  };

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
    let existingPerson = persons.filter((person) => person.name === newName);
    if (existingPerson.length > 0) {
      if (
        window.confirm(
          `${newName} already exists, do you want to replace the old number?`
        )
      ) {
        let newPerson = {
          ...existingPerson[0],
          number: phonebookRecordObject.number,
        };
        personsService
          .update(existingPerson[0].id, newPerson)
          .then((updatedPerson) => {
            let updatedPersons = persons.map((p) =>
              p.id !== updatedPerson.id ? p : updatedPerson
            );
            setPersons(updatedPersons);
            setSearchResults(updatedPersons);
          });
      }
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

  const deletePerson = (id) => {
    if (
      window.confirm(`Do you really want to delete ${persons[id - 1].name}?`)
    ) {
      personsService.destroy(id).then(() => {
        getAllPersons();
      });
    }
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
      <Persons persons={searchResults} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
