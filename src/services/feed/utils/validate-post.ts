import { promises as fs } from 'fs';

async function getNegativeWords(): Promise<string[]> {
  const NEGATIVE_WORD_REGEX = /\r?\n/;
  const WORDS_FILE = "/src/services/feed/utils/badwords.txt";
  const UTF8 = "utf8";
  try {
    const data = await fs.readFile(process.cwd() + WORDS_FILE, UTF8);
    const words = data.split(NEGATIVE_WORD_REGEX).map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
    return words;
  } catch (err) {
    return [];
  }
}

export async function detectNegativeLanguage(text: string): Promise<boolean> {
  const negativeWords = await getNegativeWords();
  const textLower = text.toLowerCase();
  
  for (const word of negativeWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {

      return true;
    }
  }
  return false;
}
