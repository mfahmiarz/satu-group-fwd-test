import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "EEE, dd MMMM HH.mm", { locale: id });
};
