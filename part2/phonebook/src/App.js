import { useState } from "react";

const App = () => {
  const phonebookRecords = [
    { name: "Arto Hellas", number: "0415987635", id: 1 },
  ];
  const [persons, setPersons] = useState(phonebookRecords);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const phonebookRecordObject = {
      name: newName,
      number: newNumber,
    };
    let isDuplicate = persons.filter((person) => person.name === newName);
    isDuplicate.length > 0
      ? alert(`${newName} already exists.`)
      : setPersons(persons.concat(phonebookRecordObject));

    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={addName}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
