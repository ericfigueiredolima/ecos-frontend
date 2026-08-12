import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export function ProjectsCalendarPage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Busca os projetos no seu backend
        fetch('http://localhost:3000/api/projects')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Transforma os dados do backend para o formato que a agenda espera
                    const formattedEvents = data.data.map(p => ({
                        title: p.title,
                        start: new Date(p.start_date),
                        end: p.end_date ? new Date(p.end_date) : new Date(p.start_date),
                        allDay: true,
                        resource: p
                    }));
                    setEvents(formattedEvents);
                }
            });
    }, []);

    return (
        <div className="h-[80vh] p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Agenda de Projetos</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
            />
        </div>
    );
}