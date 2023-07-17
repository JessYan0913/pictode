export type TimeUnit =
  | 'millisecond'
  | 'milliseconds'
  | 'second'
  | 'seconds'
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours'
  | 'day'
  | 'days';

export function toMilliseconds(time: number, unit: TimeUnit) {
  let milliseconds;

  switch (unit) {
    case 'millisecond':
    case 'milliseconds':
      milliseconds = time;
      break;
    case 'second':
    case 'seconds':
      milliseconds = time * 1000;
      break;
    case 'minute':
    case 'minutes':
      milliseconds = time * 60 * 1000;
      break;
    case 'hour':
    case 'hours':
      milliseconds = time * 60 * 60 * 1000;
      break;
    case 'day':
    case 'days':
      milliseconds = time * 24 * 60 * 60 * 1000;
      break;
    default:
      milliseconds = NaN;
  }

  return milliseconds;
}
