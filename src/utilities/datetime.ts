import moment from "moment";

export default class DatetimeUtil {
  static default = (): string => moment().format();

  static withFormat = (format: string): string => moment().format(format);

  static log = (): string => moment().format("DD MMM YYYY HH:mm:ss");

  static validate = (data: string, format: string): boolean =>
    moment(data, format, true).isValid();

  static getDelayDuration = (count: number): number => {
    if (count <= 2) return count;
    return (count - 2) * 5;
  };

  static formatCountdown = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes < 1 ? `${seconds}s` : `${minutes}m ${seconds}s`;
  };
}
