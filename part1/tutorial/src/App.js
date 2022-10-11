import { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);
  const increaseCounter = () => setCounter(counter + 1);
  const decreaseCounter = () => setCounter(counter - 1);
  const resetCounter = () => setCounter(0);

  const [clicks, setClicks] = useState({
    right: 0,
    left: 0,
  });

  const leftClick = () => {
    setAll(allClicks.concat("L"));
    setClicks({
      ...clicks,
      left: (clicks.left += 1),
    });
  };

  const rightClick = () => {
    setAll(allClicks.concat("R"));
    setClicks({
      ...clicks,
      right: (clicks.right += 1),
    });
  };

  const [allClicks, setAll] = useState([]);

  return (
    <>
      <Display counter={counter} />
      <Button onClick={increaseCounter} text="Increase Counter" />
      <Button onClick={resetCounter} text="Reset Counter" />
      <Button onClick={decreaseCounter} text="Decrease Counter" />
      <hr />
      <Button onClick={leftClick} text="Left Click" />
      <Button onClick={rightClick} text="Right Click" />
      <ClickDisplay clicks={clicks} />
      <History allClicks={allClicks} />
    </>
  );
};

export default App;

const Display = ({ counter }) => <div>The counter is set to {counter}</div>;

const ClickDisplay = ({ clicks }) => (
  <div>
    <p>Right clicks: {clicks.right}</p>
    <p>Left clicks: {clicks.left}</p>
  </div>
);

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return <p>The application works by clicking the buttons</p>;
  } else {
    return <p>Click history: {allClicks.join(" ")}</p>;
  }
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
