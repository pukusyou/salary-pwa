import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja'; 
import { useState } from 'react';
import DateDrawer from './DateDrawer';


function Calendar() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    {},
  ]);
  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  }
  const dateClick = (info: any) => {
    setDate(info.date);
    console.log(info.date);
    setOpen(true);
  }
  const addEvents = (start: Date, end: Date, title: string, description: string, bgcolor: string) => {
    setEvents([...events, {start: start, end: end, allDay: true, title: title, description: description, color: bgcolor}]);
  }
  return (
    <>
      <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} locales={[jaLocale]} locale='ja' dateClick={dateClick} height={"92%"} events={events}/>
      <DateDrawer open={open} toggleDrawer={toggleDrawer} date={date} addEvents={addEvents}/>
    </>
  );
}
export default Calendar;

