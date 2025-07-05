export async function getWords(word) {
    word = 'hello'
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!res.ok){
        throw new Error('Failed to fetch words');
    }

    const data = await res.json();
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0];

    return{
        word: entry.word,
        phonetic: entry.phonetic ?? '',
        phoneticsAudio: entry.phonetics?.audio ?? '',
        origin: entry.origin ?? '',
        partsOfSpeech: meaning?.partsOfSpeech ?? '',
        firstDefinition: definition?.definition ?? '',
        firstExample: definition?.example ?? ''
    };
}