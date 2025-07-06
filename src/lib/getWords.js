export async function getWords(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

  if (!res.ok) throw new Error('Failed to fetch word');

  const data = await res.json();
  const entry = data[0];
  const meaning = entry.meanings?.[0];
  const definition = meaning?.definitions?.[0];

  // safer lookup for phonetics
  const phoneticText = entry.phonetic 
    ?? entry.phonetics?.find(p => p.text)?.text 
    ?? '';

  const audioUrl = entry.phonetics?.find(p => p.audio)?.audio ?? '';

  return {
    word: entry.word,
    phonetic: phoneticText,
    phoneticsAudio: audioUrl,
    origin: entry.origin ?? '',
    partsOfSpeech: entry.meanings?.map((m) => m.partOfSpeech).join(', ') ?? '',
    firstDefinition: definition?.definition ?? '',
    firstExample: definition?.example ?? ''
  };
}
