const Hello = (props) => (
  <>
    <p>
      Hello {props.name}, you are {props.age} years old.
    </p>
  </>
);

const App = () => {
  const name = "Bingo";
  const age = 8;

  return (
    <>
      <p>Greetings</p>
      <Hello name="Gary" age={20 + 11} />
      <Hello name={name} age={age} />
    </>
  );
};

export default App;
