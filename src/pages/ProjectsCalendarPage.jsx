import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
    allDay: 'Dia todo',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há projetos neste período.',
    showMore: total => `+ mais (${total})`
};

export function ProjectsCalendarPage() {
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    useEffect(() => {
        api.get('/projects')
            .then(res => {
                const projectsData = res.data.data || res.data;
                setProjects(projectsData);

                const formattedEvents = projectsData.map(p => ({
                    title: p.title,
                    start: new Date(p.start_date + 'T00:00:00'),
                    end: p.end_date ? new Date(p.end_date + 'T23:59:59') : new Date(p.start_date + 'T23:59:59'),
                    allDay: true,
                    resource: p
                }));
                setEvents(formattedEvents);
            })
            .catch(err => console.error("Erro ao carregar projetos para o calendário:", err));
    }, []);

    const onNavigate = (newDate) => {
        setDate(newDate);
    };

    const onView = (newView) => {
        setView(newView);
    };

    return (
        <div className="h-[85vh] p-4 bg-white rounded-xl shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Agenda de Projetos</h2>
                {/* Botões de alternância rápidos caso queira controlar a view */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView('month')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${view === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Mês
                    </button>
                    <button
                        onClick={() => setView('agenda')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${view === 'agenda' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Agenda
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {view === 'month' ? (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        date={date}
                        onNavigate={onNavigate}
                        view={view}
                        onView={onView}
                        views={['month']}
                        messages={messages}
                        popup
                    />
                ) : (
                    /* Visão de Agenda customizada sem coluna de hora e com os envolvidos */
                    <div className="h-full overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 font-semibold">Período / Data</th>
                                    <th className="p-3 font-semibold">Projeto</th>
                                    <th className="p-3 font-semibold">Status</th>
                                    <th className="p-3 font-semibold">Funcionários Envolvidos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.map((proj) => {
                                    const employeesNames = proj.employees && proj.employees.length > 0
                                        ? proj.employees.map(e => e.full_name).join(', ')
                                        : 'Nenhum funcionário vinculado';

                                    return (
                                        <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-gray-600 whitespace-nowrap">
                                                {moment(proj.start_date).format('DD/MM/YYYY')} 
                                                {proj.end_date ? ` até ${moment(proj.end_date).format('DD/MM/YYYY')}` : ''}
                                            </td>
                                            <td className="p-3 font-medium text-gray-900">{proj.title}</td>
                                            <td className="p-3 text-gray-600">
                                                <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                    {proj.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">{employeesNames}</td>
                                        </tr>
                                    );
                                })}
                                {projects.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-gray-500">
                                            Nenhum projeto encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}