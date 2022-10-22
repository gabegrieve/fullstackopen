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

const Notification = ({ type, message }) => {
  const errorStyles = {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    padding: "1rem",
  };
  const successStyles = {
    color: "#059669",
    backgroundColor: "#d1fae5",
    padding: "1rem",
  };
  const notificationStyles = type === "error" ? errorStyles : successStyles;
  if (message === null) {
    return null;
  }
  return <div style={notificationStyles}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notification, setNotification] = useState([null, null]);

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
            setNotification([
              "success",
              `Updated ${newName}'s number successfully`,
            ]);
          });
      } else {
        setNotification(["error", `${newName} already exists`]);
      }
    } else {
      personsService.create(phonebookRecordObject).then((newPerson) => {
        let newPersons = persons.concat(newPerson);
        setPersons(newPersons);
        setSearchResults(newPersons);
        setSearchQuery("");
        setNotification(["success", `Added ${newPerson.name}`]);
      });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      personsService
        .destroy(id)
        .then(() => {
          getAllPersons();
          setNotification(["success", `Deleted ${person.name}`]);
        })
        .catch((error) => {
          setNotification([
            "error",
            `Information for ${person.name} has already been deleted from the server`,
          ]);
        });
    }
  };

  return (
    <div>
      <Notification type={notification[0]} message={notification[1]} />
      <h1>Phonebook</h1>
      <Filter searchQuery={searchQuery} onChange={handleQueryChange} />
      <h2>Add new</h2>
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
