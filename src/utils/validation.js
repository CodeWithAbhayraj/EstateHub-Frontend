export const isRequired = (value) => {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );
};

// ==========================================
// EMAIL
// ==========================================

export const isValidEmail = (email) => {
  if (!isRequired(email)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

// ==========================================
// MOBILE
// ==========================================

export const isValidMobile = (mobile) => {
  if (!isRequired(mobile)) {
    return false;
  }

  return /^[6-9]\d{9}$/.test(
    String(mobile).trim()
  );
};

// ==========================================
// PASSWORD
// ==========================================

export const isValidPassword = (
  password,
  minLength = 6
) => {
  if (!isRequired(password)) {
    return false;
  }

  return password.length >= minLength;
};

// ==========================================
// POSITIVE NUMBER
// ==========================================

export const isPositiveNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  const number = Number(value);

  return (
    !Number.isNaN(number) &&
    number > 0
  );
};

// ==========================================
// NON-NEGATIVE NUMBER
// ==========================================

export const isNonNegativeNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  const number = Number(value);

  return (
    !Number.isNaN(number) &&
    number >= 0
  );
};