import { v4 as uuidv4 } from 'uuid';

export const generateHashKey = (desiredLength: number = 15) => {
  const hexString = uuidv4();
  // Remove hyphens
  const hexStringUndecorated = hexString.replace(/-/g, '');

  // Convert to Base64
  const base64String = Buffer.from(hexStringUndecorated, 'hex').toString(
    'base64',
  );

  // Remove padding and non-alphanumeric characters
  const base64StringWithoutPadding = base64String
    .replace(/=+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '');

  // Ensure the final string has at least 5 additional characters
  const finalHashKey = base64StringWithoutPadding.substring(0, desiredLength);

  return finalHashKey.toLowerCase();
};

export const isImage = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|gif)$/i.test(filename);
};

