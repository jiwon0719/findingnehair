import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const useTimeConvert = (timeString: string | undefined | null) => {
  const convertTime = (timeString: string | undefined | null) => {
    if (!timeString) {
      return '알 수 없음';
    }

    try {
      const now = new Date();
      const date = parseISO(timeString);
      const diff = now.getTime() - date.getTime();

      if (diff < 0) {
        return '알 수 없음';
      }

      if (diff < 1000 * 60) {
        return '방금 전';
      }

      if (diff < 1000 * 60 * 60) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ko });
      }

      if (diff < 1000 * 60 * 60 * 24) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ko });
      }

      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Invalid time string:', timeString, error);
      return '알 수 없음';
    }
  };

  return convertTime(timeString);
};