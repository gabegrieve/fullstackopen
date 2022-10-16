const Header = ({ course }) => <h1>{course.name}</h1>;

const Total = ({ course }) => {
  let totalExercises = course.parts.reduce((sum, part) => {
    return (sum += part.exercises);
  }, 0);

  return (
    <>
      <strong>Total exercises: {totalExercises}</strong>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total course={course} />
    </div>
  );
};

export default Course;
