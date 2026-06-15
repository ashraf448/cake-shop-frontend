export const validatePaymentProof = (file) => {

  if (!file) {
    return "Upload payment proof";
  }

  if (!file.type.startsWith("image/")) {
    return "Only image allowed";
  }

  return null;
};