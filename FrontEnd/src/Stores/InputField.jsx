

const InputField = (props) => {
  return (
    <div className="InputField ">
      <input
        className="input"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e)=> props.onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
