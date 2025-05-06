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