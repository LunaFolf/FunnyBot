export type Config = {
  AllowMultiPhraseDetection: boolean,
  BotDeclareBoot: boolean
}

export enum ReminderState {
  UNSENT,
  SENDING,
  SENT
}

export type BelleReminder = {
  reminderHour: number,
  channelID: string,
  state: ReminderState
}