export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly';

export interface CronConfig {
  repeatType: RepeatType;
  date?: Date;
  time?: string;
  weekday?: number;
  dayOfMonth?: number;
}

export function generateCronExpression(config: CronConfig): string {
  const { repeatType, date, time, weekday, dayOfMonth } = config;
  
  const [hour, minute] = time ? time.split(':').map(Number) : [0, 0];
  const second = 0;

  switch (repeatType) {
    case 'once':
      if (!date) throw new Error('Date is required for once task');
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const week = date.getDay();
      return `${second} ${minute} ${hour} ${day} ${month} ${week}`;
    
    case 'daily':
      return `${second} ${minute} ${hour} * * *`;
    
    case 'weekly':
      if (weekday === undefined) throw new Error('Weekday is required for weekly task');
      return `${second} ${minute} ${hour} * * ${weekday}`;
    
    case 'monthly':
      if (dayOfMonth === undefined) throw new Error('Day of month is required for monthly task');
      return `${second} ${minute} ${hour} ${dayOfMonth} * *`;
    
    default:
      throw new Error(`Unsupported repeat type: ${repeatType}`);
  }
}

export function parseCronExpression(cron: string): CronConfig | null {
  try {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 6) {
      return null;
    }

    const [ minute, hour, day, month, weekday] = parts;

    const minuteNum = parseInt(minute, 10);
    const hourNum = parseInt(hour, 10);
    const timeStr = `${String(hourNum).padStart(2, '0')}:${String(minuteNum).padStart(2, '0')}`;

    const isOnce = day !== '*' && month !== '*' && weekday !== '*';
    const isDaily = day === '*' && month === '*' && weekday === '*';
    const isWeekly = day === '*' && month === '*' && weekday !== '*';
    const isMonthly = day !== '*' && month === '*' && weekday === '*';

    if (isOnce) {
      return {
        repeatType: 'once',
        date: new Date(new Date().getFullYear(), parseInt(month, 10) - 1, parseInt(day, 10)),
        time: timeStr,
      };
    }

    if (isDaily) {
      return {
        repeatType: 'daily',
        time: timeStr,
      };
    }

    if (isWeekly) {
      return {
        repeatType: 'weekly',
        time: timeStr,
        weekday: parseInt(weekday, 10),
      };
    }

    if (isMonthly) {
      return {
        repeatType: 'monthly',
        time: timeStr,
        dayOfMonth: parseInt(day, 10),
      };
    }

    return null;
  } catch {
    return null;
  }
}
