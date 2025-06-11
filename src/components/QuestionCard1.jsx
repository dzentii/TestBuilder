const QuestionCard1 = ({ options, title }) => {
  // console.log(options);
  return (
    <div>
      <h3>{title}</h3>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <p
            // type="text"
            // value={option.text}
            // onChange={(e) => {
            //   const updated = options.map((o) =>
            //     o.id === option.id ? { ...o, text: e.target.value } : o
            //   );
            //   // setOptions(updated);
            // }}
            className="w-full bg-white rounded-full py-2 px-4 pr-10 border-none outline-none"
          >option.text</p>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard1;
