export const AllFields = () => {
  return "All fields are required";
};

export const UsernameLength = () => {
  return "The username must be at least 3 characters long";
};

export const PasswordLength = () => {
  return "The password must be at least 6 characters long";
};

export const NameLength = () => {
  return "The name can't be empty";
};

export const CategoryLength = () => {
  return "The category can't be empty";
};

export const CategoryLengthMax = () => {
  return "Category can't be longer than 25 symbols.";
};

export const CommentLength = () => {
  return "The comment can't be empty";
};

export const CommentLengthMax = () => {
  return "Comment can't be longer than 100 symbols.";
};

export const PasswordMatch = () => {
  return "Passwords do not match";
};

export const handleError = () => {
  window.location.replace("/");
  return null;
};
