import { useEffect, useState } from 'react'
import './App.css'
import Card from './components/Card/Card'
import GameInfo from './components/GameInfo/GameInfo'
import GameModal from './components/GameModal/GameModal'
import Header from './components/Header/Header'
import shapes, { Shape } from './data'
import { generateCards } from './utils/generate-cards'

function App() {
  const [cards, setCards] = useState(generateCards(shapes))
  const [currentFlippedCards, setCurrentFlippedCards] = useState<Shape[]>([])
  const [numberOfFlips, setNumberOfFlips] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<null | number>(null)
  const [score, setScore] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (timeRemaining === 0) {
      setShowModal(true)
      return
    }
    setTimeout(() => setTimeRemaining((prev) => (prev ? prev - 1 : prev)), 1000)
  }, [timeRemaining])

  function flipCard(uniqueId: string) {
    setNumberOfFlips((prev) => prev + 1)
    if (timeRemaining === null) {
      setTimeRemaining(60)
    }
    setCards((prev) => {
      const nextState = prev.map((card) =>
        card.uniqueId === uniqueId ? { ...card, flipped: true } : card
      )

      // check for a win
      if (nextState.find((it) => !it.flipped) === undefined) {
        setShowModal(true)
      }

      return nextState
    })
  }

  function handleCardClick(uniqueId: string) {
    const clickedCard = cards.find((it) => it.uniqueId === uniqueId)!
    // if card is already flipped, do nothing
    if (clickedCard.flipped) {
      return
    }

    // if no cards flipped in current round, flip it and return
    if (currentFlippedCards.length === 0) {
      setCurrentFlippedCards([clickedCard])
      flipCard(uniqueId)
      return
    }
    if (currentFlippedCards.length === 1) {
      // a card is already flipped

      // check if the cards match
      if (clickedCard.shapeId === currentFlippedCards[0].shapeId) {
        // cards match.
        setScore((prev) => prev + 10)
        setCurrentFlippedCards([])
        flipCard(uniqueId)
      } else {
        // cards don't match. reveal the card, but then unflip them both in a moment
        setScore((prev) => prev - 5)
        setTimeout(() => {
          setCurrentFlippedCards([])
          setCards((prevCards) =>
            prevCards.map((card) => {
              if (
                card.uniqueId === currentFlippedCards[0].uniqueId ||
                card.uniqueId === uniqueId
              ) {
                return { ...card, flipped: false }
              } else {
                return card
              }
            })
          )
        }, 1000)
        flipCard(uniqueId)
      }
    }
  }

  return (
    <div>
      <Header />
      <GameInfo
        moves={numberOfFlips}
        score={score}
        timer={timeRemaining?.toString() ?? '60'}
      />
      <div className="cards-container">
        {cards.map(({ shapeId, uniqueId, shape, flipped }) => (
          <Card
            key={uniqueId}
            uniqueId={uniqueId}
            shapeId={shapeId}
            shape={shape}
            flipped={flipped}
            onCardClick={() => handleCardClick(uniqueId)}
          />
        ))}
      </div>
      {showModal && (
        <GameModal
          moves={numberOfFlips}
          score={score}
          win={cards.find((it) => it.flipped === false) === undefined ? true : false}
          handleResetGame={() => {
            setCards(generateCards(shapes))
            setShowModal(false)
            setScore(0)
            setNumberOfFlips(0)
            setTimeRemaining(null)
          }}
        />
      )}
    </div>
  )
}

export default App
