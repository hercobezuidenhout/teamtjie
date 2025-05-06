interface FirstNameLastName {
  firstName: string;
  lastName: string;
}

export const getFirstNameLastName = (fullName: string): FirstNameLastName => {
  const names = fullName.split(' ');
  const lastIndex = names.length - 1;

  return names.length > 1
    ? {
        firstName: names[0],
        lastName: names[lastIndex] || '',
      }
    : {
        firstName: names[0],
        lastName: '',
      };
};
