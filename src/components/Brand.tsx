import { appConfig } from '../config/app'

const mascotUrl = `${import.meta.env.BASE_URL}bobby-mascot.png`

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark brand-mascot" aria-hidden="true">
        <img src={mascotUrl} alt="" />
      </span>
      <span>{appConfig.name}</span>
    </div>
  )
}
