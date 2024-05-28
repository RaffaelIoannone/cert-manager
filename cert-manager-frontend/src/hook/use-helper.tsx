export const useHelper = () => {
  return { formatDate };
};

const formatDate = (date: Date | undefined) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return !date ? "" : new Date(date).toLocaleDateString("en-GB", options);
};
