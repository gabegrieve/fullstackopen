import { useState } from "react";

const App = () => {

  const quotes = [
    {
      anecdote: "If it hurts, do it more often.",
      votes: 0,
    },
    {
      anecdote: "Adding manpower to a late software project makes it later!",
      votes: 0,
    },
    {
      anecdote:
        "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      votes: 0,
    },
    {
      anecdote:
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      votes: 0,
    },
    {
      anecdote: "Premature optimization is the root of all evil.",
      votes: 0,
    },
    {
      anecdote:
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      votes: 0,
    },
    {
      anecdote:
        "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      votes: 0,
    },
  ];

  console.log(quotes[1].anecdote);

  const [quote, setQuote] = useState(quotes[0].anecdote);

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const selectQuote = () => {
    let selectedQuote =
      quotes[generateRandomNumber(0, quotes.length - 1)].anecdote;
    setQuote(selectedQuote);
  };

  return (
    <>
      <Quote quote={quote} />
      <Button onClick={selectQuote} label="Generate Quote" />
    </>
  );
};

export default App;

const Button = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

const Quote = ({ quote }) => {
  return <p>{quote}</p>;
};
