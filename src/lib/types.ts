export type Release = {
  id: string
  title: string
  type: string
  releaseDate: string
  streams: number
  cover: string
}

export type IncomeEntry = {
  id: string
  date: string
  source: string
  amount: number
  note: string
}

export type Reminder = {
  id: string
  text: string
  due: string
  priority: string
  done: boolean
}

export type Trip = {
  id: string
  destination: string
  purpose: string
  start: string
  end: string
  notes: string
}
