import moment from 'moment';

const toDay = (date: string | moment.Moment) => moment(date).format('YYYY-MM-DD');

export const isSameDay = (firstDateString: string | moment.Moment, secondDateString: string | moment.Moment) => toDay(firstDateString) === toDay(secondDateString);
