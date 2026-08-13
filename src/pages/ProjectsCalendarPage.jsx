import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';
import { supabase } from '../services/supabase';

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
        async function fetchProjectsAndFilter() {
            try {
                // 1. Pega o usuário autenticado atual no Supabase
                const { data: { user } } = await supabase.auth.getUser();
                
                // 2. Busca a role e dados do usuário na tabela 'users' pelo e-mail
                let currentUser = null;
                if (user) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', user.email)
                        .single();
                    currentUser = userData;
                }

                // 3. Busca os projetos da API
                const res = await api.get('/projects');
                const allProjects = res.data.data || res.data;

                // 4. Aplica a regra: Se for 'collaborator', filtra apenas projetos onde ele está vinculado
                let filteredProjects = allProjects;
                if (currentUser && currentUser.role === 'collaborator') {
                    filteredProjects = allProjects.filter(proj => 
                        proj.users && proj.users.some(u => u.id === currentUser.id)
                    );
                }

                setProjects(filteredProjects);

                // 5. Formata os eventos para o calendário
                const formattedEvents = filteredProjects.map(p => ({
                    title: p.title,
                    start: new Date(p.start_date + 'T00:00:00'),
                    end: p.end_date ? new Date(p.end_date + 'T23:59:59') : new Date(p.start_date + 'T23:59:59'),
                    allDay: true,
                    resource: p
                }));
                setEvents(formattedEvents);

            } catch (err) {
                console.error("Erro ao carregar projetos para o calendário:", err);
            }
        }

        fetchProjectsAndFilter();
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
                                    <th className="p-3 font-semibold">Envolvidos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.map((proj) => {
                                    const employeeNames = proj.employees ? proj.employees.map(e => e.full_name) : [];
                                    const userNames = proj.users ? proj.users.map(u => u.name || u.email) : [];

                                    const allNames = [...employeeNames, ...userNames];
                                    const displayNames = allNames.length > 0
                                        ? allNames.join(', ')
                                        : 'Nenhum responsável vinculado';

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
                                            <td className="p-3 text-gray-600">{displayNames}</td>
                                        </tr>
                                    );
                                })}
                                {projects.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">
                                            Nenhum projeto encontrado para este período.
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