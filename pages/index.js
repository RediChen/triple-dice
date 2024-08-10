import Head from 'next/head'
// import Image from 'next/image'
import { Noto_Sans_TC } from 'next/font/google'
import s from '@/styles/main.module.scss'
import StarStr from '@/components/StarStr'
import { useEffect, useState } from 'react'
// import { useTimeout } from 'usehooks-ts'
import Card from '@/components/Card'

const noto = Noto_Sans_TC({ subsets: ['latin'] })

export default function Home() {
  const THREE = [0, 0, 0]
  const THREE_F = [false, false, false]
  const [isPaused, setIsPaused] = useState(true)
  const [resultArr, setResultArr] = useState(THREE)
  const [cardShakeState, setCardShakeState] = useState(THREE_F)
  const [cardFlipState, setCardFlipState] = useState(THREE_F)

  const numList = [2, 3, 5, 7, 10, 11]

  const waitingFor = (t) => {
    new Promise((resolve, reject) => {
      setTimeout(resolve, t)
    })
  }

  const tossDice = (list) => {
    const n = numList.length
    const i = Math.floor(Math.random() * n)
    return list[i]
  }

  const resetIfNeed = () => {
    if (cardFlipState.some((v) => v)) {
      setCardFlipState(THREE_F)
    }
  }

  const handleDice = async () => {
    if (cardFlipState.some((v) => v)) {
      setCardFlipState(THREE_F)
      setTimeout(() => {
        setResultArr(resultArr.map((_) => tossDice(numList)))
      }, 2000)
    } else {
      setResultArr(resultArr.map((_) => tossDice(numList)))
    }
  }
  useEffect(() => {
    if (resultArr.every((num) => num === 0)) return

    setCardShakeState(THREE.map((b) => !b))
    const timerID = setTimeout(() => {
      setCardFlipState(THREE.map((b) => !b))
      setCardShakeState(THREE_F)
    }, 1000)

    return () => clearTimeout(timerID)
    //eslint-disable-next-line
  }, [resultArr])
  return (
    <>
      <Head>
        <title>骰子卡比</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={['vh-100', s.bg].join(' ')}>
        <div className={[s.bg_row, isPaused ? s.pause : ''].join(' ')}>
          <StarStr />
          <StarStr />
        </div>
        <div className={[s.bg_row, isPaused ? s.pause : ''].join(' ')}>
          <StarStr isToRight />
          <StarStr isToRight />
        </div>
        <div className={[s.bg_row, isPaused ? s.pause : ''].join(' ')}>
          <StarStr />
          <StarStr />
        </div>
      </div>
      <main className={[s.main, noto.className].join(' ')}>
        <button
          className="btn btn-warning"
          onClick={() => setIsPaused((s) => !s)}
        >
          暫停
        </button>
        <button className="btn btn-success" onClick={() => handleDice()}>
          骰
        </button>
      </main>
      <div className={s.panel}>
        <div className="row row-cols-1 row-cols-lg-3 gap-5 justify-content-around align-items-center">
          {THREE.map((_, i) => (
            <Card
              key={i}
              doesFlip={cardFlipState[i]}
              doesShake={cardShakeState[i]}
            >
              {resultArr[i]}
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
