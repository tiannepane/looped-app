export const postalCodeToNeighborhood: Record<string, string> = {
  M5V: "King West",
  M5A: "St. Lawrence / Distillery District",
  M5G: "Discovery District / UofT",
  M5T: "Kensington Market / Chinatown",
  M5B: "Garden District",
  M5C: "Financial District",
  M5R: "Harbourfront",
  M4E: "The Beaches",
  M4K: "Leslieville",
  M4M: "Riverdale",
  M4L: "East York",
  M6G: "Little Italy",
  M6J: "Trinity Bellwoods",
  M6K: "Parkdale",
  M6R: "High Park",
  M6S: "Bloor West Village",
  M6P: "Junction",
  M4P: "Davisville Village",
  M4N: "Lawrence Park",
  M4S: "Moore Park",
  M5P: "Forest Hill",
  M4Y: "Church-Wellesley Village",
  M2N: "North York Centre",
  M2M: "Willowdale",
  M1B: "Scarborough (Malvern)",
  M1C: "Scarborough (Rouge)",
  M1E: "Scarborough (Morningside)",
  M9W: "Etobicoke (Humber Summit)",
  M9C: "Etobicoke (Markland Wood)",
  M9A: "Etobicoke (Islington)",
};

export const getNeighborhood = (postalCode: string): string | null => {
  const code = postalCode.toUpperCase().replace(/\s/g, "").slice(0, 3);
  if (code.length !== 3) return null;
  return postalCodeToNeighborhood[code] || null;
};

export const getLocationDisplay = (postalCode: string): string => {
  const code = postalCode.toUpperCase().replace(/\s/g, "").slice(0, 3);
  const neighborhood = postalCodeToNeighborhood[code];
  if (neighborhood) return `${neighborhood} (${code})`;
  if (code.length === 3) return `${code} area`;
  return "";
};

export const isValidPostalPrefix = (value: string): boolean => {
  const code = value.toUpperCase().replace(/\s/g, "");
  if (code.length !== 3) return false;
  if (code[0] !== "M") return false;
  if (!/\d/.test(code[1])) return false;
  if (!/[A-Z]/.test(code[2])) return false;
  return true;
};
