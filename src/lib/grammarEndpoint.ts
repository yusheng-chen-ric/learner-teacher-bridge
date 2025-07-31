export interface Underline {
  phrase: string;
  explanation: string;
}

export interface SentenceAnnotation {
  id: string;
  text: string;
  underlines: Underline[];
}

export interface GrammarDemoData {
  sentences: SentenceAnnotation[];
}

// Fetch and parse the grammar demo JSON from the public folder
export const fetchGrammarDemo = async (): Promise<GrammarDemoData> => {
  const res = await fetch('/grammar-demo.json');
  if (!res.ok) {
    throw new Error('Failed to load grammar demo data');
  }
  return res.json() as Promise<GrammarDemoData>;
};
