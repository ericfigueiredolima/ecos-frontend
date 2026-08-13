import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';
import { supabase } from '../services/supabase';
import { BaseModal } from '../components/BaseModal';

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

// Função para definir uma cor dinâmica com base no ID do projeto
const getEventStyle = (event) => {
    const colors = [
        { bg: '#2563eb', border: '#1d4ed8' }, // Azul
        { bg: '#059669', border: '#047857' }, // Verde
        { bg: '#d97706', border: '#b45309' }, // Laranja/Amarelo
        { bg: '#7c3aed', border: '#6d28d9' }, // Roxo
        { bg: '#db2777', border: '#be185d' }, // Rosa
    ];

    let colorIndex = 0;
    if (event.resource && event.resource.id) {
        const charCodeSum = String(event.resource.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        colorIndex = charCodeSum % colors.length;
    }

    const selectedColor = colors[colorIndex];

    return {
        style: {
            backgroundColor: selectedColor.bg,
            borderColor: selectedColor.border,
            borderRadius: '6px',
            color: '#fff',
            border: '0px',
            display: 'block'
        }
    };
};

export function ProjectsCalendarPage() {
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    // Estados para controle do modal de detalhes
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        async function fetchProjectsAndFilter() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                let currentUser = null;
                if (user) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', user.email)
                        .single();
                    currentUser = userData;
                }

                const res = await api.get('/projects');
                const allProjects = res.data.data || res.data;

                let filteredProjects = allProjects;
                if (currentUser && currentUser.role === 'collaborator') {
                    filteredProjects = allProjects.filter(proj =>
                        proj.users && proj.users.some(u => u.id === currentUser.id)
                    );
                }

                setProjects(filteredProjects);

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

    // Disparado ao clicar em um evento no calendário em formato de mês
    const handleSelectEvent = (event) => {
        setSelectedProject(event.resource);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="h-[85vh] p-4 bg-white rounded-xl shadow-md flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">Agenda de Projetos</h2>
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
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={getEventStyle} // <--- Cores dinâmicas aplicadas
                        popup
                    />
                ) : (
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
                                        <tr
                                            key={proj.id}
                                            onClick={() => { setSelectedProject(proj); setIsDetailModalOpen(true); }}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
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

            {/* Modal Detalhes do Projeto */}
            <BaseModal
                isOpen={isDetailModalOpen}
                title={selectedProject?.title || 'Detalhes do Projeto'}
            >
                {selectedProject && (
                    <div className="space-y-4 text-sm text-gray-700">
                        <div>
                            <span className="block font-semibold text-gray-900 mb-1">Descrição:</span>
                            <p className="bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                                {selectedProject.description || 'Nenhuma descrição informada.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="block font-semibold text-gray-900 mb-1">Status:</span>
                                <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                    {selectedProject.status || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-900 mb-1">Período:</span>
                                <p className="text-gray-600">
                                    {moment(selectedProject.start_date).format('DD/MM/YYYY')}
                                    {selectedProject.end_date ? ` até ${moment(selectedProject.end_date).format('DD/MM/YYYY')}` : ''}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="block font-semibold text-gray-900 mb-1">Funcionários Vinculados:</span>
                            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 max-h-28 overflow-y-auto space-y-1">
                                {selectedProject.employees && selectedProject.employees.length > 0 ? (
                                    selectedProject.employees.map(emp => (
                                        <div key={emp.id} className="text-xs text-gray-600 flex justify-between">
                                            <span className="font-medium text-gray-800">{emp.full_name}</span>
                                            <span className="text-gray-400">{emp.position}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Nenhum funcionário vinculado.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="block font-semibold text-gray-900 mb-1">Usuários Vinculados:</span>
                            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 max-h-28 overflow-y-auto space-y-1">
                                {selectedProject.users && selectedProject.users.length > 0 ? (
                                    selectedProject.users.map(usr => (
                                        <div key={usr.id} className="text-xs text-gray-600 flex justify-between">
                                            <span className="font-medium text-gray-800">{usr.name || usr.email}</span>
                                            <span className="text-gray-400">({usr.role})</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Nenhum usuário vinculado.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDetailModalOpen(false)}
                                className="btn-secondary"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </BaseModal>
        </div>
    );
}