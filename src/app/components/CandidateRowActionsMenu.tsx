import React from 'react';
import { createPortal } from 'react-dom';
import {
  MoreVertical,
  Eye,
  Edit3,
  Briefcase,
  ChevronRight,
  Phone,
  Mail,
  FilePlus,
  Download,
  Printer,
  Trash2,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { AVAILABLE_VACANCIES } from '../data/vacanciesData';

interface CandidateRowActionsMenuProps {
  candidateId: string;
  onViewDetail: (candidateId: string) => void;
}

const SECONDARY_ACTIONS = [
  { icon: Phone, label: 'Llamar' },
  { icon: Mail, label: 'Enviar email' },
  { icon: FilePlus, label: 'Agregar documento' },
];

const CV_ACTIONS = [
  { icon: Eye, label: 'Ver CV' },
  { icon: Download, label: 'Descargar CV' },
  { icon: Printer, label: 'Imprimir CV' },
];

const VACANCY_FLYOUT_WIDTH = 288; // matches w-72
const VACANCY_FLYOUT_GAP = 8;

export function CandidateRowActionsMenu({ candidateId, onViewDetail }: CandidateRowActionsMenuProps) {
  const [isVacancyFlyoutOpen, setIsVacancyFlyoutOpen] = React.useState(false);
  const [flyoutPosition, setFlyoutPosition] = React.useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedVacancyIds, setSelectedVacancyIds] = React.useState<string[]>([]);
  const flyoutRef = React.useRef<HTMLDivElement>(null);

  const filteredVacancies = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return AVAILABLE_VACANCIES;
    return AVAILABLE_VACANCIES.filter((v) => v.title.toLowerCase().includes(query));
  }, [searchQuery]);

  const closeVacancyFlyout = () => {
    setIsVacancyFlyoutOpen(false);
    setSearchQuery('');
    setSelectedVacancyIds([]);
  };

  const handleAdd = () => {
    const chosen = AVAILABLE_VACANCIES.filter((v) => selectedVacancyIds.includes(v.id));
    const label = chosen.length === 1 ? chosen[0].title : `${chosen.length} vacantes`;
    toast.success(`✓ Candidato agregado a: ${label}`);
    closeVacancyFlyout();
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) closeVacancyFlyout();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-2xl shadow-2xl border-gray-100 bg-white/95 backdrop-blur-sm"
        onInteractOutside={(e) => {
          if (flyoutRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(candidateId);
          }}
          className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-blue-50 focus:bg-blue-50 transition-colors group"
        >
          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-focus:text-blue-600" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">Ver detalle</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const left = Math.max(
              VACANCY_FLYOUT_GAP,
              rect.left - VACANCY_FLYOUT_WIDTH - VACANCY_FLYOUT_GAP
            );
            setFlyoutPosition({ top: rect.top, left });
            setIsVacancyFlyoutOpen((prev) => !prev);
          }}
          className="flex items-center justify-between gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-blue-50 focus:bg-blue-50 data-[state=open]:bg-blue-50 transition-colors group"
        >
          <span className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-focus:text-blue-600" />
            <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">Agregar a vacante</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400" />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-blue-50 focus:bg-blue-50 transition-colors group">
          <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-focus:text-blue-600" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">Editar candidato</span>
        </DropdownMenuItem>

        <div className="my-1 h-px bg-gray-100" />

        {SECONDARY_ACTIONS.map((item, idx) => (
          <DropdownMenuItem key={idx} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50">
            <item.icon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </DropdownMenuItem>
        ))}

        <div className="my-1 h-px bg-gray-100" />

        {CV_ACTIONS.map((item, idx) => (
          <DropdownMenuItem key={idx} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50">
            <item.icon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </DropdownMenuItem>
        ))}

        <div className="my-1 h-px bg-gray-100" />

        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-red-50 focus:bg-red-50 transition-colors group">
          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-focus:text-red-600" />
          <span className="text-xs font-semibold text-gray-600 group-hover:text-red-600 group-focus:text-red-600">Eliminar candidato</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {isVacancyFlyoutOpen &&
        createPortal(
          <div
            ref={flyoutRef}
            style={{ position: 'fixed', top: flyoutPosition.top, left: flyoutPosition.left }}
            className="w-72 p-2 rounded-2xl shadow-2xl border border-gray-100 bg-white z-[100] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="px-1 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vacante..."
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto px-1 space-y-0.5">
              {filteredVacancies.length === 0 ? (
                <div className="px-2.5 py-4 text-center text-xs text-gray-400">No se encontraron vacantes</div>
              ) : (
                filteredVacancies.map((vacancy) => {
                  const checked = selectedVacancyIds.includes(vacancy.id);
                  return (
                    <label
                      key={vacancy.id}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          setSelectedVacancyIds((prev) =>
                            isChecked ? [...prev, vacancy.id] : prev.filter((id) => id !== vacancy.id)
                          );
                        }}
                      />
                      <span>{vacancy.title}</span>
                    </label>
                  );
                })
              )}
            </div>

            <div className="px-1 pt-2 mt-1 border-t border-gray-100">
              <Button
                size="sm"
                disabled={selectedVacancyIds.length === 0}
                onClick={handleAdd}
                className="w-full disabled:opacity-40"
              >
                Agregar{selectedVacancyIds.length > 0 ? ` (${selectedVacancyIds.length})` : ''}
              </Button>
            </div>
          </div>,
          document.body
        )}
    </DropdownMenu>
  );
}
