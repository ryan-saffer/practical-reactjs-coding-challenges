import { Shape } from '../data'

export function generateCards(shapes: Shape[]) {
  // duplicate the cards
  const duplicates: Shape[] = []
  shapes.forEach((shape) => {
    duplicates.push(shape)
    const duplicate = { ...shape }
    duplicate.uniqueId += '-dup'
    duplicates.push(duplicate)
  })

  // shuffle the cards
  return shuffle(duplicates)
}

function shuffle(shapes: Shape[]) {
  let currentIndex = shapes.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[shapes[currentIndex], shapes[randomIndex]] = [
      shapes[randomIndex],
      shapes[currentIndex],
    ]
  }

  return shapes
}
