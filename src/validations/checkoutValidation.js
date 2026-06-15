export const validatePhone = (phone) => {
  return /^01[0125][0-9]{8}$/.test(phone);
};

export const validateCheckout = (data) => {

  if (
    !data.name ||
    !data.phone ||
    !data.address ||
    !data.paymentMethod
  ) {
    return "Please fill all fields";
  }

  if (!validatePhone(data.phone)) {
    return "Invalid phone number";
  }

  return null;
};