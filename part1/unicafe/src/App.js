import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => setGood(good + 1);
  const increaseNeutral = () => setNeutral(neutral + 1);
  const increaseBad = () => setBad(bad + 1);

  return (
    <>
      <Heading title="Give Feedback" />
      <Button onClick={increaseGood} text="Good" />
      <Button onClick={increaseNeutral} text="Neutral" />
      <Button onClick={increaseBad} text="Bad" />
      <Heading title="Statistics" />
      <Results good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;

const Heading = ({ title }) => <h2>{title}</h2>;

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};

const Results = ({ good, bad, neutral }) => {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>Neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>Bad</td>
            <td>{bad}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
