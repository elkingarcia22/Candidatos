export interface Vacancy {
  id: string;
  title: string;
}

// Vacantes disponibles para el flujo "Agregar a vacante" (sin fuente global de vacantes en la app)
export const AVAILABLE_VACANCIES: Vacancy[] = [
  { id: 'vac-1', title: 'Product Designer Senior' },
  { id: 'vac-2', title: 'Frontend Engineer' },
  { id: 'vac-3', title: 'Backend Developer Node.js' },
  { id: 'vac-4', title: 'UX Researcher' },
  { id: 'vac-5', title: 'UI Designer' },
  { id: 'vac-6', title: 'Product Designer Junior' },
  { id: 'vac-7', title: 'Motion Designer' },
  { id: 'vac-8', title: 'Web Developer' },
  { id: 'vac-9', title: 'Service Designer' },
  { id: 'vac-10', title: 'Lead UX/UI Designer' },
];
