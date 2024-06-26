export const handleType = (type) => {
  switch (type) {
    case "d":
      return "Dog";
    case "c":
      return "Cat";
    case "n":
      return "NAC";
    default:
      return "Unknown";
  }
};

export const handleDate = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
};

export const handleDateWithHour = (date) => {
  if (!date) return null;
  const newDate = new Date(date);
  // if minutes are 00, we remove them
  if (Number(newDate.getHours()) < 10) {
    if (newDate.getMinutes() === 0)
      return `${newDate.toLocaleDateString()} à ${newDate
        .toLocaleTimeString()
        .slice(1, 2)}h`;

    return `${newDate.toLocaleDateString()} à ${newDate
      .toLocaleTimeString()
      .slice(1, 5)}h`;
  }

  if (newDate.getMinutes() === 0)
    return `${newDate.toLocaleDateString()} à ${newDate
      .toLocaleTimeString()
      .slice(0, 2)}h`;

  return `${newDate.toLocaleDateString()} à ${newDate
    .toLocaleTimeString()
    .slice(0, 5)}h`;
};
