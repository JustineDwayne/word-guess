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
  const [currentLevel, setCurrentLevel] = useState(1);
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
      setCurrentLevel(prev => prev + 1);
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
        setCurrentLevel(1);
      }, 100); // 100ms is enough
    }
  }, [heart]);

  console.log(word);
  return (
    <section className="min-h-screen flex flex-col bg-zinc-300 p-4 sm:px-6 lg:px-12 py-6">

      {/* Header: Wrapped in same max-width container */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-screen-sm flex justify-evenly items-center gap-4 sm:gap-6 mb-12 text-base sm:text-lg md:text-xl">
          <h1>Level: {currentLevel}</h1>
          <div className="flex gap-1">
            {Array.from({ length: heart }).map((_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
          <div>
            <h1>💰: {coin}</h1>
          </div>
        </div>
      </div>

      {/* Centered Content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col items-start w-full max-w-screen-sm space-y-6 p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Guess the Word - {word.length} letter word.
          </h1>

          {word && (
            <div className="w-full">
              <Tiles
                key={word}
                length={word.length}
                onInputChange={(currentGuess) => setGuess(currentGuess)}
                className="w-full flex flex-row gap-1"
              />
            </div>
          )}

          {/* Meta Info */}
          <p className="text-base sm:text-lg md:text-xl italic text-gray-700 lowercase">
            {partsOfSpeech}
          </p>


          {/* Definition */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800">
            {firstDefinition}
          </p>

          <Button label="Submit" onClick={() => checkSubmit(guess, word)} />
        </div>
      </div>

    </section>


  )
}
