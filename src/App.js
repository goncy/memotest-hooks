import React, { useState, useEffect } from 'react';

import icons from './icons.json';

import './App.css';

const CARDS_PER_LEVEL = 2;

function shuffle(ammount) {
  const stack = icons.slice(0, ammount).reduce(
    (stack, icon) => ({
      ...stack,
      [`a/${icon}`]: { icon, type: 'a', shown: false },
      [`b/${icon}`]: { icon, type: 'b', shown: false },
    }),
    {}
  );

  return Object.entries(stack)
    .sort(() => Math.random() - 0.5)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

function App() {
  const [level, setLevel] = useState(1);
  const [stack, setStack] = useState({});
  const [active, setActive] = useState([]);
  const [remaining, setRemaining] = useState(CARDS_PER_LEVEL * level);

  function handleFlip(flipped) {
    const [first] = active;

    if (!first) return setActive([flipped]);

    if (first.icon !== flipped.icon) {
      setActive([first, flipped]);

      return setTimeout(() => setActive([]), 1000);
    }

    setActive([]);

    if (remaining === 1) return setLevel(level => level + 1);

    setRemaining(remaining => remaining - 1);
    setStack(cards => ({
      ...cards,
      [`a/${flipped.icon}`]: { icon: flipped.icon, type: 'a', shown: true },
      [`b/${flipped.icon}`]: { icon: flipped.icon, type: 'b', shown: true },
    }));
  }

  useEffect(() => {
    setRemaining(CARDS_PER_LEVEL * level);
    setStack(shuffle(CARDS_PER_LEVEL * level));
  }, [level]);

  return (
    <main id="board">
      {Object.values(stack).map(card => {
        const isActive = active.some(
          _card => _card.icon === card.icon && _card.type === card.type
        );
        const isShown = isActive || card.shown;
        const isBlocked = active.length === 2;

        return (
          <div
            key={`${card.type}/${card.icon}`}
            className={`flip ${
              isActive && isBlocked
                ? 'danger'
                : isActive
                ? 'primary'
                : card.shown
                ? 'success'
                : ''
            }`}
            onClick={() => !isShown && !isBlocked && handleFlip(card)}
          >
            <div className={`card ${isShown ? 'hidden' : 'shown'}`}>
              <i className="fas fa-question" />
            </div>
            <div className={`card ${isShown ? 'shown' : 'hidden'}`}>
              <i className={`fab fa-${card.icon}`} />
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default App;
