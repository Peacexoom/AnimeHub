function Validation(values) {
  let error = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=[a-zA-Z\d@#$%^&+=!]{8,}$)/
  ;
  if (values.name === "") {
    error.name = "Name cannot be empty";
  } else {
    error.name = "";
  }
  if (values.email === "") {
    error.email = "Email cannot be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email Didn't match";
  } else {
    error.email = "";
  }
  if (values.password === "") {
    error.password = "Password cannot be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Must contain at least one capital letter, small letter, one digit and a symbol";
  } else {
    error.password = "";
  }
  return error;
}
export default Validation;
