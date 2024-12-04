import { cardFront } from '../../config/icons'
import './style.css'

const Card = ({
  uniqueId,
  shape,
  onCardClick,
  flipped,
}: {
  key: string
  uniqueId: string
  shapeId: string
  shape: string
  onCardClick: () => void
  flipped: boolean
}) => {
  return (
    <div
      className={`memory-card ${flipped && 'flipped'}`}
      key={uniqueId}
      onClick={onCardClick}
    >
      <div className="card-content">
        <div className="card-front">
          <img
            src={cardFront}
            className="card-front"
            alt="Card Front"
            draggable={false}
          />
        </div>
        <div className="card-back">
          <img src={shape} className="number icon" alt="Number icon" />
        </div>
      </div>
    </div>
  )
}

export default Card
