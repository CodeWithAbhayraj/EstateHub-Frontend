function formatCurrency(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "₹0";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default formatCurrency;