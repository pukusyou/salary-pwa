import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { useEffect, useState } from "react";
import DateDrawer from "./DateDrawer";
import eventDB from "../scripts/eventsDB";
interface DrinkNames {
  name: string;
  price: number;
  value: number;
}

interface EventList {
  start: Date;
  end: Date;
  drinks: DrinkNames[];
}

interface WorkTimes {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
}

function loadEventIndexedDB() {
  return eventDB.getAllEventsRecord().then((result: any) => {
    return result;
  });
}

async function getWorkTime() {
  var workTimes: WorkTimes[] = [];
  var workTimeData: EventList[] = await loadEventIndexedDB();
  for (var key in workTimeData) {
    const elapsed =
      new Date(workTimeData[key].end).getTime() -
      new Date(workTimeData[key].start).getTime();
    const elapsedHours = (elapsed / (1000 * 60 * 60)).toFixed(1) + "h";
    workTimes.push({
      start: workTimeData[key].start,
      end: workTimeData[key].end,
      title: elapsedHours,
      allDay: true,
    });
  }
  return workTimes;
}

function Calendar() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };
  const dateClick = (info: any) => {
    setDate(info.date);
    setOpen(true);
  };
  useEffect(() => {
    getWorkTime().then((result: any) => {
      setEvents(result);
    });
  }, [open]);
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[jaLocale]}
        locale="ja"
        dateClick={dateClick}
        height={"92%"}
        events={events}
      />
      <DateDrawer open={open} toggleDrawer={toggleDrawer} date={date} />
    </>
  );
}
export default Calendar;
