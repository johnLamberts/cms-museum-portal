export const generatePassword = (): string => {
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+{}[]';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  // Ensure at least 2 numbers and 1 special character
  let password = '';
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Generate remaining characters to meet the length of 12
  const remainingLength = 12 - password.length;
  const allChars = numbers + specialChars + letters;

  for (let i = 0; i < remainingLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to ensure randomness
  return password.split('').sort(() => Math.random() - 0.5).join('');
}


export default generatePassword;
