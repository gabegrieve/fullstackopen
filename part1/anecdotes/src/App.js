import { useState } from "react";

const App = () => {
  const anecdotes = [
    {
      quote: "If it hurts, do it more often.",
      totalVotes: 0,
    },
    {
      quote: "Adding manpower to a late software project makes it later!",
      totalVotes: 0,
    },
    {
      quote:
        "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      totalVotes: 0,
    },
    {
      quote:
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      totalVotes: 0,
    },
    {
      quote: "Premature optimization is the root of all evil.",
      totalVotes: 0,
    },
    {
      quote:
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      totalVotes: 0,
    },
    {
      quote:
        "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      totalVotes: 0,
    },
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotes);

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateQuote = () => {
    const i = generateRandomNumber(0, anecdotes.length - 1);
    setSelected(i);
  };

  const addVote = () => {
    const newVotes = [...votes];
    newVotes[selected].totalVotes += 1;
    setVotes(newVotes);
  };

  const topQuote = () => {
    let topQuote = votes[0];
    for (var i = 0; i < votes.length; i++) {
      if (topQuote.totalVotes < votes[i].totalVotes) {
        topQuote = votes[i];
      }
    }
    return topQuote;
  };

  return (
    <>
      <Heading text="Anecdote of the Day" />
      <div>{anecdotes[selected].quote}</div>
      <div>This anecdote has {votes[selected].totalVotes} votes.</div>
      <Button onClick={generateQuote} label="Generate Quote" />
      <Button onClick={addVote} label="Vote" />
      <Heading text="Anecdote with the most votes" />
      <TopQuote quote={topQuote().quote} votes={topQuote().totalVotes} />
    </>
  );
};

export default App;

const Heading = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

const TopQuote = ({ quote, votes }) => {
  return (
    <>
      <p>{quote}</p>
      <p>It has {votes} votes.</p>
    </>
  );
};
