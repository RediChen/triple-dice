import Head from 'next/head'
// import Image from 'next/image'
import { Noto_Sans_TC, Yuji_Mai } from 'next/font/google'
import s from '@/styles/main.module.scss'
import StarStr from '@/components/StarStr'
import { useEffect, useState } from 'react'
// import { useTimeout } from 'usehooks-ts'
import Card from '@/components/Card'

const noto = Noto_Sans_TC({ subsets: ['latin'] })
const yuji = Yuji_Mai({ subsets: ['latin'], weight: '400' })

/**
 * 卡片的數量上限
 */
const NUM_SLOT = 8
const initCard = Array(NUM_SLOT).fill(0)
const initSlot = Array(NUM_SLOT).fill(false)

export default function Home() {
  /** 卡片的啟動數量 */
  const [numCard, setNumCard] = useState(3)
  const initStateArr = initSlot.map((_, j) => j < numCard)
  const [cardState, setCardState] = useState(initStateArr)

  // 背景的播放狀態
  const [isPaused, setIsPaused] = useState(false)
  // 骰得的結果數列
  const [resultArr, setResultArr] = useState(initCard)
  // 卡片的動態狀態：搖搖
  const [cardShakeState, setCardShakeState] = useState(initSlot)
  // 卡片的動態狀態：翻面
  const [cardFlipState, setCardFlipState] = useState(initSlot)
  // special message
  // 0 - 減過頭的情形
  // 1 - 加過頭的情形
  const initMsgState = [false, false]
  const [msgState, setMsgState] = useState(initMsgState)

  const numList = [2, 3, 5, 7, 10, 11]

  useEffect(() => {
    const newArr = initSlot.map((_, j) => j < numCard)
    setCardState(newArr)
  }, [numCard])

  useEffect(() => {
    if (resultArr.every((num) => num === 0)) return

    setCardShakeState(initCard.map((b) => !b))
    const timerID = setTimeout(() => {
      setCardFlipState(initCard.map((b) => !b))
      setCardShakeState(initSlot)
    }, 1000)

    return () => clearTimeout(timerID)
    //eslint-disable-next-line
  }, [resultArr])

  useEffect(() => {
    if (msgState.every((num) => num === false)) return

    const timerID = setTimeout(() => {
      setMsgState(initMsgState)
    }, 2000)

    return () => clearTimeout(timerID)
    //eslint-disable-next-line
  }, [msgState])

  // const waitingFor = (t) => {
  //   new Promise((resolve, reject) => {
  //     setTimeout(resolve, t)
  //   })
  // }

  const tossDice = (list) => {
    const n = numList.length
    const i = Math.floor(Math.random() * n)
    return list[i]
  }

  // const resetIfNeed = () => {
  //   if (cardFlipState.some((v) => v)) {
  //     setCardFlipState(initCard_F)
  //   }
  // }

  const handleDice = async () => {
    if (cardFlipState.some((v) => v)) {
      setCardFlipState(initSlot)
      setTimeout(() => {
        setResultArr(resultArr.map((_) => tossDice(numList)))
      }, 2000)
    } else {
      setResultArr(resultArr.map((_) => tossDice(numList)))
    }
  }

  const handleCardNumber = (delta) => {
    if (delta < 0) {
      numCard === 1
        ? setMsgState(msgState.map((_, i) => i === 0))
        : setNumCard(numCard - 1)
    } else {
      numCard === NUM_SLOT
        ? setMsgState(msgState.map((_, i) => i === 1))
        : setNumCard(numCard + 1)
    }
  }

  return (
    <>
      <Head>
        <title>骰子卡比</title>
        <meta name="viewport" content="viewport-fit=cover, initial-scale=1" />
      </Head>
      {/*===========================//* 背景 */}
      <div className={s.bg}>
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
      {/*===========================//* 介面 */}
      <main className={[s.main, noto.className].join(' ')}>
        <button
          className={['btn btn-outline-warning', s.pauseBtn].join(' ')}
          onClick={() => setIsPaused((s) => !s)}
        >
          暫停動畫
        </button>
        <button
          className={['btn btn-warning', s.pauseBtn].join(' ')}
          onClick={() => handleCardNumber(-1)}
        >
          減
        </button>
        <button
          className={['btn btn-warning', s.pauseBtn].join(' ')}
          onClick={() => handleCardNumber(1)}
        >
          加
        </button>
        <button
          className={['btn btn-success', s.diceBtn].join(' ')}
          onClick={() => handleDice()}
        >
          骰
        </button>
        <div>這個要作常駐選單按鈕</div>
      </main>
      {/*===========================//* 卡片 */}
      <div className={s.panel}>
        <div className="row row-cols-1 row-cols-lg-3 gap-5 justify-content-around align-items-center">
          {cardState.map(
            (isActive, i) =>
              isActive && (
                <Card
                  key={i}
                  doesFlip={cardFlipState[i]}
                  doesShake={cardShakeState[i]}
                >
                  {resultArr[i]}
                </Card>
              )
          )}
        </div>
      </div>
      {/*===========================//* 訊息 */}
      {msgState[0] && (
        <article className={s.message}>
          <p className={['text-danger', yuji.className].join(' ')}>
            誰把老師惹毛了！
          </p>
        </article>
      )}
      {msgState[1] && (
        <article className={s.message}>
          <p className={['text-danger', yuji.className].join(' ')}>
            做人不要太貪心！
          </p>
        </article>
      )}
    </>
  )
}
