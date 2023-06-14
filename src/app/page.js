"use client";
import { useState, useEffect } from "react";
import shuffle from "./utilities/shuffle";
import Header from "./components/Header";
import Card from "./components/Card.jsx";

export default function Home() {
  const [cards, setCards] = useState(shuffle); // Cards array from assets
  const [pickOne, setPickOne] = useState(null); // First selection
  const [pickTwo, setPickTwo] = useState(null); // Second selection
  const [disabled, setDisabled] = useState(false); // Delay handler
  const [wins, setWins] = useState(0); // win streak

  const handleClick = (card) => {
    if (!disabled) {
      // checking if pickOne has already been set
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  const handleNewGame = () => {
    setWins(0);
    handleTurn();
    setCards(shuffle);
  };

  // used for match handling
  useEffect(() => {
    let pickTimer;

    // checks if two cards have been picked
    if (pickOne && pickTwo) {
      // check if the cards are matching
      if (pickOne.image === pickTwo.image) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image) {
              return { ...card, matched: true };
            } else {
              // there wasn't a match
              return card;
            }
          });
        });
        handleTurn();
      } else {
        // Prevent new selections until after delay
        setDisabled(true);

        // delay between selections
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    };
  }, [cards, pickOne, pickTwo, wins]);

  // if player found all matches
  useEffect(() => {
    const checkWin = cards.filter((card) => !card.matched);

    if (cards.length && checkWin.length < 1) {
      console.log("you win");
      setWins(wins + 1);
      handleTurn();
      setCards(shuffle);
    }
  }, [cards, wins]);

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      <div className="grid">
        {cards.map((card) => {
          const { image, matched } = card;

          return (
            <Card
              key={image.id}
              image={image}
              card={card}
              selected={card === pickOne || card === pickTwo || matched}
              onClick={() => handleClick(card)}
            />
          );
        })}
      </div>
    </>
  );
}
