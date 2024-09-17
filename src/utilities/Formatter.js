export const formatMoney = (amount = 0) => {
  const string = amount.toString();
  let pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b)/g;
  if (string.includes(".")) {
    pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b\.)/g;
  }
  return `$${string.replace(pattern, ",")}`;
};
