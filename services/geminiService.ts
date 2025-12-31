
const QUOTES: string[] = [
  "万象更新，初心不改。",
  "心有光芒，行必坦途。",
  "积微成著，步步为赢。",
  "向阳而生，步履不停。",
  "星河灿烂，人间值得。",
  "以梦为马，不负韶华。",
  "行而不辍，未来可期。",
  "拥抱变化，创造不凡。",
  "目光如炬，志向如虹。",
  "为热爱，赴山海。"
];

export const getNewYearQuote = async (): Promise<string> => {
  try {
    const idx = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[idx];
  } catch {
    return "2026：一个充满无限可能与卓越成就的年份。";
  }
};
