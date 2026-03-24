declare type EventType = "game" | "social" | "ad" | "dj"
declare type BPEvent = [
  EventType,
  [number, number, number]
]
declare type EventTypeDict = {
  [key in EventType]: {
    name: string,
    image?: string,
    description?: string,
    duration: import('luxon').Duration,
    location: string
  }
}