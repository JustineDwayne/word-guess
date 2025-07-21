'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Tiles from '@/components/Tiles';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { FaHome } from "react-icons/fa";

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
  const [coin, setCoin] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [modal, setModal] = useState({ show: false, status: '', desc: '' });
  const [hints, setHints] = useState({});
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const homeButton = () => {
    router.push("/");
  };

  const getRandomWord = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      setCoin(prev => prev + 1);
      setCurrentLevel(prev => prev + 1);
      setGuess('');
      setModal({
        show: true,
        status: '🎉 Correct!',
        desc: 'You guessed the word:',
      });
    }

    if (currentGuess.length !== word.length) {
      alert('Please enter the full word.');
    }
  }

  //enter function
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !modal.show) {
        checkSubmit(guess, word);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess, word, modal]);

  //Game over function
  useEffect(() => {
    if (heart < 1) {
      setTimeout(() => {
        setCoin(prev => prev - 1);
        setHeart(5);
        setModal({
          show: true,
          status: '💀 You lose!',
          desc: 'The word was:',
        });
      }, 100);
    }
  }, [heart]);

  //give up function
  const giveUp = () => {

    if (coin > 0) {
      setCoin(prev => prev - 1);
    } else {
      setCoin(0);
    }
    setModal({
      show: true,
      status: '💀 You give up!',
      desc: 'The word was:',
    });

    setGuess('');
    setHints({});
    setCurrentLevel(1);
    setHeart(5);
  }

  const hint = () => {

    if (coin == 0) {
      return alert('Not enough coins.');
    }

    const unrevealedIndices = [...word]
      .map((_, index) => index)
      .filter(i => !(i in hints))

    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    const newHintLetter = word[randomIndex];

    setHints(prev => ({ ...prev, [randomIndex]: newHintLetter }));
    setCoin(prev => prev - 1);

  };


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
        <FaHome className="absolute top-4 right-4 text-2xl cursor-pointer text-zinc-500 hover:text-zinc-800" onClick={homeButton} />
      </div>

      {/* Centered Content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-1 justify-center items-center">
          {loading ? (

            <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse text-gray-700 text-xl">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading word</span>
            </div>

          ) : (
            <div className="flex flex-col items-start w-full max-w-screen-sm space-y-6 p-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Guess the Word - {word.length} letter word.
              </h1>

              <div className="w-full">
                <Tiles
                  key={word}
                  length={word.length}
                  onInputChange={(currentGuess) => setGuess(currentGuess)}
                  className="w-full flex flex-row gap-1"
                  hintMap={hints}
                />
              </div>

              <p className="text-base sm:text-lg md:text-xl italic text-gray-700 lowercase">
                {partsOfSpeech}
              </p>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-800">
                {firstDefinition}
              </p>

              <div className="flex justify-between w-full gap-4">
                <div className="flex-1">
                  <Button label="Give Up" onClick={giveUp} bgColor='bg-red-500' />
                </div>
                <div className="flex-1">
                  <Button label="Submit" onClick={() => checkSubmit(guess, word)} />
                </div>
                <div className="flex-1">
                  <Button label="Hint (-1 💰)" onClick={hint} bgColor='bg-orange-500' />
                </div>
              </div>
            </div>
          )}
        </div>

        {modal.show &&
          (
            <Modal
              status={modal.status}
              desc={modal.desc}
              word={word}
              partsOfSpeech={partsOfSpeech}
              phoneticsAudio={phoneticsAudio}
              phonetics={phonetic}
              firstDefinition={firstDefinition}
              onClose={() => {
                setModal({ show: false, status: '', desc: '' });
                getRandomWord();
                setHints({});
              }}
            />
          )
        }
      </div>

    </section>


  )
}
