'use client';
import React from 'react'
import { useState, useEffect, useRouter } from 'react';
import Tiles from '@/components/Tiles';
import Button from '@/components/Button';
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
  const [heart, setHeart] = useState(5);
  const [guess, setGuess] = useState('');
  const [coin, setCoin] = useState(0);

  const getRandomWord = async () => {
    try {
      const res = await fetch(`https://random-word-api.vercel.app/api?words=1`);
      const [randomWord] = await res.json();

      const dictRes = await fetch(`/api/define?word=${randomWord}`);

      if (dictRes.status === 404) {
        console.warn('Retrying with another random word...');
        getRandomWord();
        return;
      }

      const dictData = await dictRes.json();

      if (dictData.error) throw new Error(dictData.error);

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

  useEffect(() => {
    getRandomWord();
  }, []);


  //submit button function
  const checkSubmit = (currentGuess, word) => {

    if (currentGuess.toLowerCase() !== word.toLowerCase()) {
      setHeart(prev => Math.max(prev - 1, 0));
    }

    if (currentGuess.toLowerCase() == word.toLowerCase()) {
      alert('You win! The word was ' + word + '. Try again!');
      setCoin(prev => prev + 1);
      getRandomWord();
      setGuess('');
    }
  }

  //enter function
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        checkSubmit(guess, word);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess, word]);
  
  //Game over function
  useEffect(() => {
    if (heart < 1) {
      // ⏳ Let React update DOM before showing alert
      setTimeout(() => {
        alert('You lose, the word was ' + word + '. Try again!');
        getRandomWord();
        setHeart(prev => prev + 5);
        setGuess('');
      }, 100); // 100ms is enough
    }
  }, [heart]);

  return (
    <div className='flex flex-col'>
      <div className="flex gap-1">
        {Array.from({ length: heart }).map((_, i) => (
          <span key={i}>❤️</span>
        ))}
      </div>
      <div>{coin > 1 ? `Coins: ${coin}` : `Coin: ${coin}`}</div>
      <h1>{word.length} letter word</h1>
      {word && (
        <Tiles
          key={word}
          length={word.length}
          onInputChange={(currentGuess) => setGuess(currentGuess)}
        />
      )}
      <h1 className='hidden'>Word:{word}</h1>
      <h1>phonetic:{phonetic}</h1>
      <h1>partOfSpeech:{partsOfSpeech}</h1>
      <h1>fd:{firstDefinition}</h1>
      <Button label="Submit" onClick={() => checkSubmit(guess, word)} />
    </div>
  )
}
