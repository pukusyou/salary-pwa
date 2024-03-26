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
  const dateClick = (info: any) => {
    setDate(info.date);
    setOpen(true);
  };
  const eventClick = (info: any) => {
    setDate(info.event.start);
    setOpen(true);
  };
  useEffect(() => {
    getWorkTime().then((result: any) => {
      setEvents(result);
    });
  }, [open]);
  // jsonをapiから取得
  fetch("https://holidays-jp.github.io/api/v1/date.json")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      // classに"fc-day"が付与された要素をすべて取得
      const dayElements = document.getElementsByClassName("fc-day");
      // 取得した要素を配列に変換
      const dayArray = Array.from(dayElements);
      // 配列の要素を1つずつ処理
      dayArray.forEach((element) => {
        // "data-date"属性の値を取得
        const date = element.getAttribute("data-date");
        // 取得した日付が祝日の場合
        if (date && json[date]) {
          // 要素に"holiday"クラスを追加
          element.classList.add("fc-holiday");
        }
      });
    });
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[jaLocale]}
        locale="ja"
        dateClick={dateClick}
        eventClick={eventClick}
        height={"100%"}
        events={events}
        timeZone="Asia/Tokyo"
        headerToolbar={{
          start: "prev",
          center: "title",
          end: "next",
        }}
        dayCellContent={(arg) => {
          return arg.date.getDate();
        }}
      />
      <DateDrawer open={open} setOpen={setOpen} date={date} />
    </>
  );
}
export default Calendar;
