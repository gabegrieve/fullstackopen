import { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);
  const increaseCounter = () => setCounter(counter + 1);
  const decreaseCounter = () => setCounter(counter - 1);
  const resetCounter = () => setCounter(0);

  return (
    <>
      <Display counter={counter} />
      <Button onClick={increaseCounter} text="Increase Counter" />
      <Button onClick={resetCounter} text="Reset Counter" />
      <Button onClick={decreaseCounter} text="Decrease Counter" />
    </>
  );
};

export default App;

const Display = ({ counter }) => <div>The counter is set to {counter}</div>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
