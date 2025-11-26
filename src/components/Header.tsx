// const frases = [
//   'El mar al mejor precio',
//   'Si quiere una cena elegante llévese un bogavante.',
//   'Si quiere una cena de gala llévese una cigala.',
//   'Si quiere una cena muy fina llévese una lubina',
//   'Su pescadería divina a la vuelta de la esquina',
//   '¡¡¡Hoy gran inauguración quisquillas en promoción!!!',
//   'Como oferta de apertura unos precios de locura.',
//   'Su catering al mejor precio.',
//   'Sorprenda usted a su pareja con gambas en Nochevieja.',
//   'Si quiere una misa del gallo llévese un rodaballo.',
//   'Navajas de la ría para su madre y para su tía.',
//   '¡Que alegría! ¡Que ilusión! Las quisquillas en promoción.',
//   '¡La alegría de la ría!',
//   'Alégrese el día con mariscos de la ría (14,00€/kg).'
// ]

// function getRandomFrase() {
//   const index = Math.floor(Math.random() * frases.length)
//   return frases[index]
// }

export default function Header() {
  //const frase = getRandomFrase()
  return (
    <header className='mx-auto w-full bg-gray-800 px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-6xl font-bold text-gray-100 sm:text-7xl lg:text-8xl'>
          Recio&apos;s Seafood
        </h1>
        <p className='mt-4 text-sm leading-8 text-gray-400 sm:mt-6 sm:text-base lg:text-lg'>
          Wholesaler. I do not clean fish.
        </p>
      </div>
    </header>
  )
}