import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  return (
    <div className="card w-100">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Calendario de comidas</h5>
      </div>
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          height="auto"
        />

        {selectedDate && (
          <div className="mt-4">
            <div className="card">
              <div className="card-body">
                <h6>Contenido para {selectedDate}</h6>
                <p>Aquí puedes mostrar el planning específico de ese día.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;