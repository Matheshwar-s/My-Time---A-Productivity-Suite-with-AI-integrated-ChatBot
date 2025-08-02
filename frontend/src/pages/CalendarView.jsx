import { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const statusStyles = {
  TODO: { backgroundColor: '#6b7280', color: '#fff' },
  IN_PROGRESS: { backgroundColor: '#f59e0b', color: '#fff' },
  DONE: { backgroundColor: '#10b981', color: '#fff' },
};

export default function CalendarView({ tasks }) {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const events = tasks.map(task => ({
    title: `${task.title} [${task.status}]`,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    status: task.status,
  }));

  const eventStyleGetter = (event) => {
    const style = {
      ...statusStyles[event.status],
      padding: '4px 8px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
      transform: 'scale(1)',
      transition: 'transform 0.2s ease',
    };

    return {
      style,
      className: 'hover:scale-105 transition-transform',
    };
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="mt-10 px-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-indigo-300">📅 Calendar View</h2>

      {/* View Switcher */}
      <div className="flex gap-3 mb-4">
        {["month", "week", "day", "agenda"].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded text-sm font-medium transition 
              ${view === v
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-pink-900 rounded-xl shadow-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          date={date}
          onView={setView}
          onNavigate={handleNavigate}
          views={['month', 'week', 'day', 'agenda']}
          eventPropGetter={eventStyleGetter}
          style={{ height: 500 }}
          className="text-black rounded-lg"
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-sm font-medium text-white">
        <LegendItem color={statusStyles.TODO.backgroundColor} label="TODO" />
        <LegendItem color={statusStyles.IN_PROGRESS.backgroundColor} label="IN_PROGRESS" />
        <LegendItem color={statusStyles.DONE.backgroundColor} label="DONE" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-4 h-4 rounded"
        style={{ backgroundColor: color }}
      ></span>
      <span>{label}</span>
    </div>
  );
}
