export const formatDateRange = (dates) => {
  if (!dates) {
    return;
  }
  const formatted = dates.map(
    d => new Date(d).toLocaleDateString()
  );
  if (formatted[0] == formatted[1]) {
    return formatted[0]
  } else {
    return formatted.join(" - ");
  }
};