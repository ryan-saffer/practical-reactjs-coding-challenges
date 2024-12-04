import { useEffect, useState } from 'react'
import './App.css'
import Card from './components/Card/Card'
import GameInfo from './components/GameInfo/GameInfo'
import GameModal from './components/GameModal/GameModal'
import Header from './components/Header/Header'
import shapes, { Shape } from './data'
import { generateCards } from './utils/generate-cards'

function App() {
  const showModal = false

  const [cards, setCards] = useState(generateCards(shapes))
  const [currentFlippedCards, setCurrentFlippedCards] = useState<Shape[]>([])
  const [numberOfFlips, setNumberOfFlips] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<null | number>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setTimeout(() => setTimeRemaining((prev) => (prev ? prev - 1 : prev)), 1000)
  }, [timeRemaining])

  function flipCard(uniqueId: string) {
    setNumberOfFlips((prev) => prev + 1)
    if (timeRemaining === null) {
      setTimeRemaining(60)
    }
    setCards((prev) =>
      prev.map((card) => (card.uniqueId === uniqueId ? { ...card, flipped: true } : card))
    )
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
          setCards((prevCards) => {
            return prevCards.map((card) => {
              if (
                card.uniqueId === currentFlippedCards[0].uniqueId ||
                card.uniqueId === uniqueId
              ) {
                return { ...card, flipped: false }
              } else {
                return card
              }
            })
          })
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
        timer={timeRemaining?.toString() ?? '-'}
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
        <GameModal moves={10} score={40} win={true} handleResetGame={() => {}} />
      )}
    </div>
  )
}

export default App
