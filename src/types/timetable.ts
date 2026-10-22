export interface TimetableSlot {
  period: number;
  time: string;
  subjects: string[];
}

export interface TimetableDay {
  day: string;
  slots: TimetableSlot[];
}
