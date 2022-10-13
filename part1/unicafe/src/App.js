import { calculateNewValue } from "@testing-library/user-event/dist/utils";
import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => {
    setGood(good + 1);
  };
  const increaseNeutral = () => {
    setNeutral(neutral + 1);
  };
  const increaseBad = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <Heading title="Give Feedback" />
      <Button onClick={increaseGood} text="Good" />
      <Button onClick={increaseNeutral} text="Neutral" />
      <Button onClick={increaseBad} text="Bad" />

      <Heading title="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
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

const StatisticLine = ({ label, value }) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, bad, neutral }) => {
  const total = good + bad + neutral;
  const average = () => (good - bad) / total;
  const positive = () => (good / total) * 100;
  const positivePercentage = `${positive()}%`;

  if (total >= 1) {
    return (
      <>
        <table>
          <tbody>
            <StatisticLine label="Good" value={good} />
            <StatisticLine label="Neutral" value={neutral} />
            <StatisticLine label="Bad" value={bad} />
            <StatisticLine label="All" value={total} />
            <StatisticLine label="Average" value={average()} />
            <StatisticLine label="Positive" value={positivePercentage} />
          </tbody>
        </table>
      </>
    );
  } else {
    return <p>No feedback given.</p>;
  }
};
