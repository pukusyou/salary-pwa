import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja'; 
import { useState } from 'react';
import DateDrawer from './DateDrawer';


function Calendar() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const toggleDrawer = (open: boolean) => () => {
    console.log(open);
    setOpen(open);
  }
  const dateClick = (info: any) => {
    console.log(info);
    setOpen(true);
    setDate(info.date);
  }
  return (
    <>
      {/* <StyleWeapper style={{height: "100%"}}> */}
        <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} locales={[jaLocale]} locale='ja' dateClick={dateClick} height={"92%"}/>
      {/* </StyleWeapper> */}
      <DateDrawer open={open} toggleDrawer={toggleDrawer} date={date}/>
    </>
  );
}
export default Calendar;

