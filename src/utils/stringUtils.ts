export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatUserFullName = (user: {
  first_name: string;
  surname: string;
  other_name?: string;
  other_surname?: string;
}): string => {
  const firstName = capitalizeFirstLetter(user.first_name);
  const otherName = user.other_name ? ` ${capitalizeFirstLetter(user.other_name)}` : '';
  const surname = capitalizeFirstLetter(user.surname);
  const otherSurname = user.other_surname ? ` ${capitalizeFirstLetter(user.other_surname)}` : '';
  return `${firstName}${otherName} ${surname}${otherSurname}`;
};

/**
 * Validates a password against the following criteria:
 * - Contains at least 1 uppercase letter
 * - Contains at least 1 lowercase letter
 * - Contains at least 1 number
 * - Contains at least 1 symbol
 * - Does not contain more than 3 consecutive numbers
 * - Does not contain forbidden words (gis, uptc, grupo)
 * 
 * @param password The password to validate
 * @returns An object with validation result and error message if any
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  }

  // Check for symbol
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un símbolo' };
  }

  // Check for more than 3 consecutive numbers
  if (/\d{4,}/.test(password)) {
    return { isValid: false, message: 'La contraseña no puede contener más de 3 números consecutivos' };
  }

  // Check for forbidden words
  const forbiddenWords = ['gis', 'uptc', 'grupo'];
  const lowerPassword = password.toLowerCase();
  for (const word of forbiddenWords) {
    if (lowerPassword.includes(word)) {
      return { isValid: false, message: `La contraseña no puede contener la palabra "${word}"` };
    }
  }

  return { isValid: true };
};