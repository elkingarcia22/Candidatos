import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ban,
  ArrowRight,
  MessageSquare,
  ListTodo,
  Mail,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  Printer,
  Phone,
  Video,
  RotateCcw,
  Layers,
  SkipForward,
  Shield,
  Copy,
  ChevronRight,
  FileText,
  Edit,
  AlertCircle,
  Briefcase,
  Search,
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip } from './ui/tooltip';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { AVAILABLE_VACANCIES } from '../data/vacanciesData';

interface FloatingActionBarProps {
  mode: 'vacancy' | 'general';
  onReject: () => void;
  onNextStage: () => void;
  onComment: () => void;
  onAddTodo: () => void;
  onMessage: () => void;
  candidatePhone?: string;
  onAddDocument?: () => void;
  onEditProfile?: () => void;
  isValentina?: boolean;
}

export function FloatingActionBar({
  mode,
  onReject,
  onNextStage,
  onComment,
  onAddTodo,
  onMessage,
  candidatePhone,
  onAddDocument,
  onEditProfile,
  isValentina = false
}: FloatingActionBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = React.useState(false);
  const [submenuType, setSubmenuType] = React.useState<'stage' | 'vacancy' | null>(null);
  const [submenuPosition, setSubmenuPosition] = React.useState({ top: 0, left: 0, fromBar: false });
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [vacancySearchQuery, setVacancySearchQuery] = React.useState('');
  const [selectedVacancyIds, setSelectedVacancyIds] = React.useState<string[]>([]);

  const filteredVacancies = React.useMemo(() => {
    const query = vacancySearchQuery.trim().toLowerCase();
    if (!query) return AVAILABLE_VACANCIES;
    return AVAILABLE_VACANCIES.filter(v => v.title.toLowerCase().includes(query));
  }, [vacancySearchQuery]);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const submenuRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startMinimizeTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsMinimized(true);
    }, 2500); // Wait 2.5 seconds before minimizing
  }, []);

  const clearMinimizeTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  React.useEffect(() => {
    setIsMinimized(false);
    startMinimizeTimer();
    return () => clearMinimizeTimer();
  }, [mode, startMinimizeTimer, clearMinimizeTimer]);

  React.useEffect(() => {
    if (isDropdownOpen || isSubmenuOpen) {
      clearMinimizeTimer();
    } else {
      if (!isMinimized) {
        startMinimizeTimer();
      }
    }
  }, [isDropdownOpen, isSubmenuOpen, startMinimizeTimer, clearMinimizeTimer, isMinimized]);

  const handleMouseEnter = () => {
    clearMinimizeTimer();
    setIsMinimized(false);
  };

  const handleMouseLeave = () => {
    if (!isDropdownOpen && !isSubmenuOpen) {
      startMinimizeTimer();
    }
  };

  // Definición de acciones base
  const vacancyActions = [
    { key: 'reject', label: 'Descartar', icon: Ban, onClick: () => {
        if (isValentina) {
          toast.error('No ha sido posible actualizar el estado del proceso debido a un inconveniente en el sistema. Estamos trabajando para solucionarlo.');
          return;
        }
        onReject();
    }, variant: 'reject' as const },
    { key: 'next', label: 'Siguiente', icon: ArrowRight, onClick: () => {
        if (isValentina) {
          toast.error('No ha sido posible actualizar el estado del proceso debido a un inconveniente en el sistema. Estamos trabajando para solucionarlo.');
          return;
        }
        onNextStage();
    }, variant: 'primary' as const },
    { key: 'skip', label: 'Omitir etapa', icon: SkipForward, onClick: () => {
        if (isValentina) {
          toast.error('No ha sido posible actualizar el estado del proceso debido a un inconveniente en el sistema. Estamos trabajando para solucionarlo.');
          return;
        }
        toast.success('Omitiendo etapa actual...');
    }},
    { key: 'move_sep', label: 'Mover a etapa', icon: Layers, isSpecial: true, submenuType: 'stage' as const },
    { key: 'interview', label: 'Agregar entrevista', icon: Video, onClick: () => {
        if (isValentina) {
          toast.error('Por el momento no podemos programar la entrevista. Inténtalo de nuevo más tarde.');
          return;
        }
        toast.success('Abriendo formulario para agregar entrevista...');
    }},
    { key: 'shield', label: 'Verificación Antecedentes', icon: Shield, onClick: () => {
        if (isValentina) {
          toast.error('Estamos presentando inconvenientes para solicitar la verificación de antecedentes. Por favor, inténtalo más tarde.');
          return;
        }
        toast.success('Solicitando verificación de antecedentes...');
    }},
    { key: 'copyAppId', label: 'Copiar Application ID', icon: FileText, onClick: () => {
        const appId = 'APP-2024-001234';
        navigator.clipboard.writeText(appId).then(() => toast.success('Application ID copiado'));
    }},
  ];

  const generalActions = [
    { key: 'viewCV', label: 'Ver CV', icon: Eye, onClick: () => {
        if (isValentina) {
          toast.error('Estamos presentando inconvenientes para visualizar el documento. Por favor, inténtalo más tarde.');
          return;
        }
        toast.success('Abriendo visor de CV...');
    }},
    { key: 'addToVacancy', label: 'Agregar a vacante', icon: Briefcase, isSpecial: true, submenuType: 'vacancy' as const },
    { key: 'email', label: 'Email', icon: Mail, onClick: () => {
        if (isValentina) {
          toast.error('Por el momento no podemos abrir el cliente de correo. Inténtalo más tarde.');
          return;
        }
        onMessage();
    }},
    { key: 'editProfile', label: 'Editar perfil', icon: Edit, onClick: onEditProfile },
    { key: 'call', label: 'Llamar', icon: Phone, onClick: () => {
        if (isValentina) {
          toast.error('No es posible iniciar la llamada en este momento. Inténtalo de nuevo en unos minutos.');
          return;
        }
        candidatePhone ? window.location.href = `tel:${candidatePhone}` : toast.error('Teléfono no disponible');
    }},
    { key: 'addDoc', label: 'Agregar documento', icon: FileText, onClick: () => {
        if (onAddDocument) onAddDocument();
    }},
    { key: 'downloadCV', label: 'Descargar CV', icon: Download, onClick: () => {
        if (isValentina) {
          toast.error('Por el momento no podemos descargar el archivo, inténtalo más tarde.');
          return;
        }
        toast.success('Descargando CV...');
    }},
    { key: 'print', label: 'Imprimir perfil', icon: Printer, onClick: () => {
        if (isValentina) {
          toast.error('No ha sido posible generar la versión de impresión del perfil. Por favor, inténtalo más tarde.');
          return;
        }
        window.print();
    }},
  ];

  // Determinar qué se muestra en la barra (los primeros 4 items disponibles)
  let visibleActions: any[] = [];
  let extraActions: any[] = [];

  if (mode === 'vacancy') {
    visibleActions = vacancyActions.slice(0, 4);
    extraActions = [...vacancyActions.slice(4), ...generalActions];
  } else {
    visibleActions = generalActions.slice(0, 4);
    extraActions = generalActions.slice(4);
  }

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(submenuRef.current && submenuRef.current.contains(event.target as Node))
      ) {
        setIsDropdownOpen(false);
        setIsSubmenuOpen(false);
      }
    };

    if (isDropdownOpen || isSubmenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isSubmenuOpen]);

  // Función para manejar el toggle del submenú con posicionamiento inteligente
  const handleSubmenuToggle = (e: React.MouseEvent, fromBar: boolean, type: 'stage' | 'vacancy') => {
    e.stopPropagation();
    const trigger = e.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();

    const willOpen = !(isSubmenuOpen && submenuType === type);
    const menuHeight = type === 'vacancy' ? 380 : 330; // Aproximadamente el alto de cada submenú

    // Si viene de la barra (abajo), posicionar arriba
    // Si viene del menú (dropdown), posicionar a la derecha
    if (fromBar) {
      setSubmenuPosition({
        top: rect.top - menuHeight,
        left: rect.left,
        fromBar: true
      });
    } else {
      setSubmenuPosition({
        top: rect.top,
        left: rect.right + 4,
        fromBar: false
      });
    }

    setSubmenuType(type);
    setIsSubmenuOpen(willOpen);
    setIsDropdownOpen(false);

    if (willOpen && type === 'vacancy') {
      setVacancySearchQuery('');
      setSelectedVacancyIds([]);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "pointer-events-auto absolute transition-all duration-500 ease-in-out z-50 flex justify-center",
        "left-1/2 bottom-6 -translate-x-1/2"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        layout
        initial={false}
        animate={{
          width: isMinimized ? 80 : 'auto',
          height: isMinimized ? 4 : 60, // Fixed height for more stable transition
          backgroundColor: isMinimized ? 'rgba(31, 41, 55, 1)' : 'rgba(17, 24, 39, 0.98)',
          borderRadius: isMinimized ? 100 : 20,
          padding: isMinimized ? 0 : '10px',
          boxShadow: isMinimized 
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 20px 40px -10px rgba(0,0,0,0.5)',
          y: isMinimized ? 0 : -4,
        }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
          default: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          }
        }}
        className={cn(
          "shadow-2xl backdrop-blur-xl border transition-colors duration-300",
          !isMinimized 
            ? "border-gray-700/50 bg-gray-900 inline-flex overflow-visible" 
            : "border-gray-600/30 cursor-pointer hover:bg-gray-700 overflow-hidden"
        )}
      >
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
              className="px-2 flex items-center h-full"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                {visibleActions.map((action) => {
                  if (action.isSpecial) {
                    return (
                      <div key={action.key} className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleSubmenuToggle(e, true, action.submenuType)}
                          className={cn(
                            "h-auto flex-col gap-0.5 px-1 py-1.5 w-[80px] flex-shrink-0 text-gray-300 hover:text-white hover:bg-gray-800 transition-all",
                            isSubmenuOpen && submenuPosition.fromBar && submenuType === action.submenuType && "bg-gray-800 text-white"
                          )}
                        >
                          <action.icon className="w-4 h-4" />
                          <span className="text-[9px] text-center">{action.label}</span>
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <Button
                      key={action.key}
                      variant={action.variant === 'reject' ? 'outline' : action.variant === 'primary' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={action.onClick}
                      className={cn(
                        "h-auto flex-col gap-0.5 px-1 py-1.5 w-[80px] flex-shrink-0 transition-colors",
                        action.variant === 'reject' ? "text-red-400 hover:text-red-300 hover:bg-red-950 border-red-800 bg-transparent" :
                        action.variant === 'primary' ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent" :
                        "text-gray-300 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-[9px] text-center">{action.label}</span>
                    </Button>
                  );
                })}

                {/* More Actions Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const willOpen = !isDropdownOpen;
                      setIsDropdownOpen(willOpen);
                      if (willOpen) setIsSubmenuOpen(false);
                    }}
                    className="h-auto flex-col gap-0.5 px-1 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 w-[80px] flex-shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="text-[9px] text-center">Más</span>
                  </Button>

                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 bottom-full mb-2 bg-gray-900 border border-gray-700 shadow-2xl rounded-lg backdrop-blur-sm bg-opacity-95 w-64 max-h-[70vh] overflow-y-auto z-50"
                    >
                      {extraActions.map((action) => {
                        if (action.isSpecial) {
                          return (
                            <div
                              key={action.key}
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={(e) => handleSubmenuToggle(e, false, action.submenuType)}
                            >
                              <div className="flex items-center">
                                <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                <span>{action.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={action.key}
                            className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                            onClick={() => {
                              if (action.onClick) action.onClick();
                              setIsDropdownOpen(false);
                            }}
                          >
                            <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span>{action.label}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Portal para los submenús (Renderizado fuera para evitar recortes) */}
      {isSubmenuOpen && createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bg-gray-900 border border-gray-700 shadow-2xl rounded-lg backdrop-blur-sm bg-opacity-95 w-72 max-h-[70vh] overflow-y-auto z-[100] py-2"
          ref={submenuRef}
          style={{
            top: `${submenuPosition.top}px`,
            left: `${submenuPosition.left}px`
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {submenuType === 'stage' && (
            <>
              <div className="flex items-center justify-between px-3 py-1.5 mb-1 border-b border-gray-800">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mover a etapa</div>
                <button onClick={() => setIsSubmenuOpen(false)} className="text-gray-500 hover:text-white">
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
              {['Screening con Talent', 'Evaluación CV', 'Serena AI', 'Psicométrico', 'Caso Product Sense', 'Entrevista Hiring', 'Antecedentes', 'Seleccionado'].map((stage) => (
                <div
                  key={stage}
                  className="flex items-center px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-blue-600 cursor-pointer transition-colors mx-1 rounded-md mb-0.5"
                  onClick={() => {
                    if (isValentina) {
                      toast.error('Hubo un problema al procesar la acción de reclutamiento. Estamos trabajando para solucionarlo.');
                      setIsDropdownOpen(false);
                      setIsSubmenuOpen(false);
                      return;
                    }
                    toast.success(`✓ Candidato movido a: ${stage}`);
                    setIsDropdownOpen(false);
                    setIsSubmenuOpen(false);
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5" />
                  <span>{stage}</span>
                </div>
              ))}
            </>
          )}

          {submenuType === 'vacancy' && (
            <>
              <div className="px-3 py-1.5 mb-2 border-b border-gray-800">
                <div className="text-xs text-gray-500 font-bold tracking-wider">Agregar a vacante</div>
              </div>

              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  <Input
                    autoFocus
                    value={vacancySearchQuery}
                    onChange={(e) => setVacancySearchQuery(e.target.value)}
                    placeholder="Buscar vacante..."
                    className="h-8 pl-8 text-xs bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

              <div className="max-h-[220px] overflow-y-auto px-1 space-y-0.5">
                {filteredVacancies.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">No se encontraron vacantes</div>
                ) : (
                  filteredVacancies.map((vacancy) => {
                    const checked = selectedVacancyIds.includes(vacancy.id);
                    return (
                      <label
                        key={vacancy.id}
                        className="flex items-center gap-2.5 px-2.5 py-2 mx-1 rounded-md text-xs text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            setSelectedVacancyIds(prev =>
                              isChecked ? [...prev, vacancy.id] : prev.filter(id => id !== vacancy.id)
                            );
                          }}
                        />
                        <span>{vacancy.title}</span>
                      </label>
                    );
                  })
                )}
              </div>

              <div className="px-3 pt-2 mt-1 border-t border-gray-800">
                <Button
                  size="sm"
                  disabled={selectedVacancyIds.length === 0}
                  onClick={() => {
                    if (isValentina) {
                      toast.error('No ha sido posible agregar al candidato a la vacante. Estamos trabajando para solucionarlo.');
                      setIsDropdownOpen(false);
                      setIsSubmenuOpen(false);
                      return;
                    }
                    const chosen = AVAILABLE_VACANCIES.filter(v => selectedVacancyIds.includes(v.id));
                    const label = chosen.length === 1 ? chosen[0].title : `${chosen.length} vacantes`;
                    toast.success(`✓ Candidato agregado a: ${label}`);
                    setIsDropdownOpen(false);
                    setIsSubmenuOpen(false);
                    setSelectedVacancyIds([]);
                    setVacancySearchQuery('');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
                >
                  Agregar{selectedVacancyIds.length > 0 ? ` (${selectedVacancyIds.length})` : ''}
                </Button>
              </div>
            </>
          )}
        </motion.div>,
        document.body
      )}
    </div>
  );
}