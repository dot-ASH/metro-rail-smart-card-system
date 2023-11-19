import { sha256 } from 'react-native-sha256';
import { SECRET_KEY, SHIFT } from '@env';

const shift = SHIFT;
const secretKey = SECRET_KEY;

export const sha256HashPin = async (value: string): Promise<string> => {
  try {
    const hash = await sha256(value);
    return hash;
  } catch (error) {
    console.error('Error hashing the value:', error);
    throw error;
  }
};

export const compareSHA = async (value: string, userHash: string | null) => {
  let hashedPin = await sha256HashPin(value);
  return userHash === hashedPin;
};

function toText(textNumber: number): string{
  let number = textNumber * secretKey;
  const digitMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  let textRepresentation = "";

  while (number > 0) {
    const digit = number % 10;
    textRepresentation = digitMap[digit] + textRepresentation;
    number = Math.floor(number / 10);
  }

  return textRepresentation;
}

function toNumber(text: string): number {
  let result = "";
  const digitMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const arrayLength = digitMap.length;

  for (let i = 0; i < text.length; i++) {
    for (let j = 0; j < arrayLength; j++) {
      if (digitMap[j] === text[i]) {
        result += j;
      }
    }
  }

  const finalResult = parseInt(result);
  return Math.abs(Math.floor(finalResult / secretKey));
}

export function encrypt(textNumber: number):string {
  const text = toText(textNumber);
  let result = "";

  for (let i = 0; i < text.length; i++) {
    if (text[i] === text[i].toUpperCase()) {
      result += String.fromCharCode((text.charCodeAt(i) + shift - 65) % 26 + 65);
    } else {
      result += String.fromCharCode((text.charCodeAt(i) + shift - 97) % 26 + 97);
    }
  }

  return result;
}

export function decrypt(text: string):number {
  let decypherText = "";

  for (let i = 0; i < text.length; i++) {
    if (text[i] === text[i].toUpperCase()) {
      decypherText += String.fromCharCode((text.charCodeAt(i) - shift - 65 + 26) % 26 + 65);
    } else {
      decypherText += String.fromCharCode((text.charCodeAt(i) - shift - 97 + 26) % 26 + 97);
    }
  }

  return toNumber(decypherText);
}


