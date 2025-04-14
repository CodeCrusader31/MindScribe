export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    return {
      isValid: password.length >= 6,
      message: password.length >= 6 ? "" : "Password must be at least 6 characters long"
    };
  };
  
  export const validateUsername = (username) => {
    return {
      isValid: username.length >= 3 && username.length <= 30,
      message: username.length < 3 
        ? "Username must be at least 3 characters long"
        : username.length > 30 
          ? "Username cannot exceed 30 characters"
          : ""
    };
  };