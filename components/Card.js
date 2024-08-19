import React from 'react'
import s from './card.module.scss'
import Image from 'next/image'

export default function Card({
  doesFlip = false,
  doesShake = false,
  children,
}) {
  const c1 = doesFlip ? s.flip : ''
  const c2 = doesShake
    ? 'animate__animated animate__headShake'
    : 'animate__animated'
  //animate__headShake OR animate__shakeX
  return (
    <div className={[s.card, c1, c2, 'mx-auto'].join(' ')}>
      <div className={s.membrane}>
        <div className={s.front}>
          <div className={s.frame}>
            <Image
              src="kirby-round.png"
              width={0}
              height={0}
              priority={true}
              alt="數字卡牌背面圖案"
            />
          </div>
        </div>
        <div className={s.back}>{children}</div>
      </div>
    </div>
  )
}
