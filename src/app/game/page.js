'use client';
import React from 'react'
import { useState, useEffect, useRouter } from 'react';

export default function page() {
  //hooks for getWords lib
  const [word, setWord] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [phoneticsAudio, setPhoneticsAudio] = useState('');
  const [origin, setOrigin] = useState('');
  const [partsOfSpeech, setPartsOfSpeech] = useState('');
  const [firstDefinition, setFirstDefinition] = useState('');
  const [firstExample, setFirstExample] = useState('');
  //hooks for game
  const [heart, setHeart] = useState(3);
  const [wrong, setWrong] = useState(0);
  const [guess, setGuess] = useState([]);
  const [coin, setCoin] = useState(0);

  useEffect(() => {
    const getRandomWord = async () => {
      try {

        // Get a truly random word from the API
        const res = await fetch(`https://random-word-api.vercel.app/api?words=1`);
        const [randomWord] = await res.json(); // API returns an array

        // Use your own API to get word details from Free Dictionary
        const dictRes = await fetch(`/api/define?word=${randomWord}`);

        if (dictRes.status === 404) {
          // 🔁 retry fetching another random word here
          console.warn('Retrying with another random word...');
          getRandomWord();
          return;
        }
        const dictData = await dictRes.json();

        if (dictData.error) throw new Error(dictData.error);

        // Set all states with dictionary info
        setWord(randomWord);
        setPhonetic(dictData.phonetic);
        setPhoneticsAudio(dictData.phoneticsAudio);
        setOrigin(dictData.origin);
        setPartsOfSpeech(dictData.partsOfSpeech);
        setFirstDefinition(dictData.firstDefinition);
        setFirstExample(dictData.firstExample);

      } catch (error) {
        console.error('Error fetching word:', error.message);
      }
    };

    getRandomWord();

  }, []);


  return (
    <div className='flex flex-col'>
      <h1>Word:{word}</h1>
      <h1>phonetic:{phonetic}</h1>
      <h1>partOfSpeech:{partsOfSpeech}</h1>
      <h1>fd:{firstDefinition}</h1>
    </div>
  )
}
