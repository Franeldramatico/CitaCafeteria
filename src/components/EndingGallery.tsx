import React, { useState } from 'react';
import { ENDINGS } from '../data/story';
import { Ending } from '../types';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Moon, 
  Wind, 
  CloudDrizzle, 
  HelpCircle, 
  X, 
  Lock, 
  Award,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EndingGalleryProps {
  unlockedEndings: string[];
  onClose: () => void;
  playClickSound: () => void;
}

const ENDING_ICONS: Record<string, React.ReactNode> = {
  ending_love_true: <Heart className="w-8 h-8 text-rose-400" />,
  ending_perfect_date: <MapPin className="w-8 h-8 text-amber-400" />,
  ending_number_exchange: <Phone className="w-8 h-8 text-emerald-400" />,
  ending_friends_potential: <Sparkles className="w-8 h-8 text-sky-400" />,
  ending_unforgettable: <BookOpen className="w-8 h-8 text-fuchsia-400" />,
  ending_too_shy: <Clock className="w-8 h-8 text-violet-400" />,
  ending_missed_opportunity: <Wind className="w-8 h-8 text-slate-400" />,
  ending_misunderstanding: <CloudDrizzle className="w-8 h-8 text-blue-400" />,
  ending_sweet_goodbye: <Moon className="w-8 h-8 text-orange-400" />,
  ending_uncertain_destiny: <HelpCircle className="w-8 h-8 text-yellow-400" />
};

export default function EndingGallery({ unlockedEndings, onClose, playClickSound }: EndingGalleryProps) {
  const [selectedEnding, setSelectedEnding] = useState<Ending | null>(null);

  const totalPossible = ENDINGS.length;
  const unlockedCount = unlockedEndings.length;
  const percentUnlocked = Math.round((unlockedCount / totalPossible) * 100);

  return (
    <div id="ending-gallery-root" className="fixed inset-0 z-50 bg-[#0c0806]/98 backdrop-blur-md overflow-y-auto flex flex-col items-center py-10 px-4 md:px-8">
      {/* Banner / Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 pb-4 border-b border-[#3d2a1d]">
        <div>
          <h2 className="text-3xl font-serif text-amber-100 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 animate-pulse" />
            Galería de Destinos rústicos
          </h2>
          <p className="text-sm text-amber-200/60 mt-1">
            Has descubierto {unlockedCount} de {totalPossible} finales posibles ({percentUnlocked}%)
          </p>
        </div>
        <button 
          id="btn-close-gallery"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="p-2 rounded-full bg-[#20150e] hover:bg-[#3d2a1d] border border-[#523928] text-amber-100 hover:text-amber-300 transition duration-300 cursor-pointer"
          title="Cerrar galería"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-5xl bg-[#20150e] rounded-full h-3 mb-10 overflow-hidden border border-[#3d2a1d]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentUnlocked}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full"
        />
      </div>

      {/* Endings Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ENDINGS.map((ending, index) => {
          const isUnlocked = unlockedEndings.includes(ending.id);
          return (
            <motion.div
              key={ending.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => {
                playClickSound();
                if (isUnlocked) {
                  setSelectedEnding(ending);
                }
              }}
              className={`relative p-5 rounded-xl border text-left cursor-pointer transition duration-300 flex flex-col justify-between h-48 select-none ${
                isUnlocked 
                  ? 'bg-gradient-to-b from-[#2a1b12] to-[#1c120c] border-[#8a5a36] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-[1.03]' 
                  : 'bg-[#17110e]/60 border-[#2d211a]/80 cursor-not-allowed opacity-70'
              }`}
            >
              {isUnlocked ? (
                <>
                  <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-amber-500/20">
                    Nº {index + 1}
                  </div>
                  <div>
                    <div className="mb-3">{ENDING_ICONS[ending.id]}</div>
                    <h3 className="font-serif font-semibold text-base text-amber-100 line-clamp-1">
                      {ending.title}
                    </h3>
                    <p className="text-xs text-amber-200/50 line-clamp-2 mt-1">
                      {ending.subtitle}
                    </p>
                  </div>
                  <span className="text-xs text-amber-400/80 font-medium hover:underline mt-2 inline-flex items-center gap-1">
                    Ver recuerdo →
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Lock className="w-8 h-8 text-amber-900/55 mb-2" />
                  <span className="text-xs font-mono text-[#523928]">Bloqueado</span>
                  <p className="text-[10px] text-[#8a5c3e] mt-1 line-clamp-3 leading-tight px-1">
                    {ending.statsRequirementMessage}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Individual Ending Drawer Modeler Modal */}
      <AnimatePresence>
        {selectedEnding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="bg-[#1f140e] border-2 border-[#8b5a2b] max-w-xl w-full rounded-2xl p-6 md:p-8 relative shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Decorative vintage borders */}
              <div className="absolute inset-0 border border-amber-500/5 pointer-events-none m-1 rounded-xl" />

              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    {ENDING_ICONS[selectedEnding.id]}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-serif text-amber-100">{selectedEnding.title}</h4>
                    <p className="text-sm text-amber-400 font-serif italic">{selectedEnding.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    playClickSound();
                    setSelectedEnding(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-amber-500/10 text-amber-200/50 hover:text-amber-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Decorative separator */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-4" />

              {/* Ending detail body */}
              <div className="space-y-4">
                <blockquote className="border-l-2 border-amber-500/60 pl-4 py-1 italic text-amber-200/90 font-serif text-base leading-relaxed bg-[#2d1b11]/30 rounded-r">
                  {selectedEnding.poeticText}
                </blockquote>
                
                <p className="text-sm md:text-base text-amber-100/80 leading-relaxed text-justify">
                  {selectedEnding.description}
                </p>

                <div className="p-3 bg-[#150d09] rounded-lg border border-[#3a2517] text-xs text-amber-300/80 font-mono mt-4">
                  <strong className="text-amber-400">Requisito de Desbloqueo:</strong> {selectedEnding.statsRequirementMessage}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedEnding(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 border border-amber-500/30 hover:shadow-lg transition cursor-pointer font-medium text-sm"
                >
                  Continuar contemplando
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
