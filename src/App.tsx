import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  Award, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  Heart, 
  User, 
  HelpCircle, 
  Moon, 
  Compass, 
  Sliders, 
  ChevronRight, 
  Users,
  Sparkles,
  Bookmark,
  Activity,
  Maximize2
} from 'lucide-react';
import { INITIAL_STATS, PROLOGUE_PAGES, STORY_SCENES, getMatchingEnding } from './data/story';
import { GameStats, SavedGame, Ending } from './types';
import { cafeAudio } from './utils/audio';
import EndingGallery from './components/EndingGallery';

import cafeBg from './assets/images/cafe_afternoon_1781209846913.jpg';
import boyMysteriousSprite from './assets/images/boy_mysterious_1781209863214.png';
import boySmilingSprite from './assets/images/boy_smiling_1781209874771.jpg';

interface DialogueLog {
  speaker: string;
  text: string;
  timestamp: string;
}

export default function App() {
  // Game state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPrologue, setIsPrologue] = useState<boolean>(true);
  const [prologueIndex, setPrologueIndex] = useState<number>(0);
  const [currentSceneId, setCurrentSceneId] = useState<string>('sitting_down');
  const [stats, setStats] = useState<GameStats>({ ...INITIAL_STATS });
  const [history, setHistory] = useState<string[]>([]);
  const [dialogueLogs, setDialogueLogs] = useState<DialogueLog[]>([]);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [aranzaName, setAranzaName] = useState<string>('Aranza');
  const [nameEditingMode, setNameEditingMode] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  
  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  // Resolution states
  const [isTransitioningToEnding, setIsTransitioningToEnding] = useState<boolean>(false);
  const [activeEnding, setActiveEnding] = useState<Ending | null>(null);

  // Typewriter effect state
  const [currentText, setCurrentText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimerRef = useRef<any>(null);
  const fullTextToType = isPrologue 
    ? PROLOGUE_PAGES[prologueIndex]?.text 
    : STORY_SCENES[currentSceneId]?.text;

  // Sound selection wrap
  const playClick = () => {
    if (!isMuted) cafeAudio.playChoiceChime();
  };

  const playTick = () => {
    if (!isMuted) cafeAudio.playTypeTick();
  };

  const playEndingSound = () => {
    if (!isMuted) cafeAudio.playEndingChime();
  };

  // Load persistence on initial mount
  useEffect(() => {
    // Endings history
    const savedEndings = localStorage.getItem('aranza_cafe_romance_unlocked_endings');
    if (savedEndings) {
      try {
        setUnlockedEndings(JSON.parse(savedEndings));
      } catch (e) {
        console.error("Error charging unlocked endings", e);
      }
    }

    // Name custom
    const savedName = localStorage.getItem('aranza_name');
    if (savedName) {
      setAranzaName(savedName);
    }

    // Check pre-existing autosave
    const savedGame = localStorage.getItem('aranza_cafe_romance_autosave');
    if (savedGame) {
      try {
        const parsed: SavedGame = JSON.parse(savedGame);
        // We do have an autosave, but we let them choose "Continuar" from home screen
      } catch (e) {
        console.error("Autosave load err", e);
      }
    }
  }, []);

  // Sync volume to audio engine
  useEffect(() => {
    if (isMuted) {
      cafeAudio.setVolume(0);
    } else {
      cafeAudio.setVolume(volume);
    }
  }, [volume, isMuted]);

  // Audio start trigger on physical click
  const toggleAmbient = () => {
    if (cafeAudio.isPlaying()) {
      cafeAudio.stopAmbient();
      setIsMuted(true);
    } else {
      cafeAudio.startAmbient();
      setIsMuted(false);
    }
  };

  // Auto-Save whenever important state changes
  const saveState = (
    cScene: string,
    cStats: GameStats,
    cPrologue: boolean,
    cPrologueIndex: number,
    cPlaying: boolean
  ) => {
    const saveObj: SavedGame = {
      currentSceneId: cScene,
      stats: cStats,
      history: history,
      choicesHistory: [],
      unlockedEndings: unlockedEndings,
      aranzaName: aranzaName,
      isPlaying: cPlaying,
      isPrologue: cPrologue,
      prologueIndex: cPrologueIndex
    };
    localStorage.setItem('aranza_cafe_romance_autosave', JSON.stringify(saveObj));
  };

  // Run Typewriter script
  useEffect(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (!fullTextToType) return;

    setCurrentText('');
    setIsTyping(true);
    let charIndex = 0;

    typingTimerRef.current = setInterval(() => {
      // replace {Aranza} tag if present
      const formattedText = fullTextToType.replace(/{Aranza}/g, aranzaName);
      
      if (charIndex < formattedText.length) {
        setCurrentText(formattedText.substring(0, charIndex + 1));
        charIndex++;
        // Play soft typewriter sound sometimes to keep it pleasant but not overwhelming
        if (charIndex % 2 === 0) {
          playTick();
        }
      } else {
        setIsTyping(false);
        clearInterval(typingTimerRef.current);
      }
    }, 24); // elegant speedy typewriter

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [fullTextToType, aranzaName]);

  // Instantly finish writing current scene text
  const skipTypewriter = () => {
    if (!fullTextToType) return;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    const formattedText = fullTextToType.replace(/{Aranza}/g, aranzaName);
    setCurrentText(formattedText);
    setIsTyping(false);
    playClick();
  };

  // Trigger dialogue log archive
  const logDialogue = (speaker: string, text: string) => {
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setDialogueLogs(prev => [...prev, { speaker, text: text.replace(/{Aranza}/g, aranzaName), timestamp: time }]);
  };

  // Start new game
  const handleStartNewGame = () => {
    playClick();
    // Warm initialize synth if not active
    cafeAudio.startAmbient();
    setIsMuted(false);

    setIsPlaying(true);
    setIsPrologue(true);
    setPrologueIndex(0);
    setCurrentSceneId('sitting_down');
    setStats({ ...INITIAL_STATS });
    setHistory([]);
    setDialogueLogs([]);
    setIsTransitioningToEnding(false);
    setActiveEnding(null);

    logDialogue("Narrador", "Llegas a la pintoresca cafetería buscando refugio...");
    saveState('sitting_down', INITIAL_STATS, true, 0, true);
  };

  // Load existing Autosaved game
  const handleLoadGame = () => {
    const saved = localStorage.getItem('aranza_cafe_romance_autosave');
    if (!saved) return;
    playClick();
    cafeAudio.startAmbient();
    setIsMuted(false);

    try {
      const parsed: SavedGame = JSON.parse(saved);
      setIsPlaying(parsed.isPlaying);
      setIsPrologue(parsed.isPrologue);
      setPrologueIndex(parsed.prologueIndex);
      setCurrentSceneId(parsed.currentSceneId);
      setStats(parsed.stats);
      setHistory(parsed.history || []);
      setAranzaName(parsed.aranzaName || 'Aranza');

      logDialogue("Sistema", "Partida reanudada automáticamente.");
    } catch (e) {
      console.error("Failed load autosave", e);
    }
  };

  // Check if save exists
  const hasAutosave = localStorage.getItem('aranza_cafe_romance_autosave') !== null;

  // Handle click to advance Prologue
  const handlePrologueNext = () => {
    if (isTyping) {
      skipTypewriter();
      return;
    }
    
    playClick();
    const currentPage = PROLOGUE_PAGES[prologueIndex];
    logDialogue("Narrador", currentPage.text);

    if (prologueIndex < PROLOGUE_PAGES.length - 1) {
      const nextIdx = prologueIndex + 1;
      setPrologueIndex(nextIdx);
      saveState('sitting_down', stats, true, nextIdx, true);
    } else {
      // Prologue done! Move to first scene
      setIsPrologue(false);
      setCurrentSceneId('sitting_down');
      saveState('sitting_down', stats, false, 0, true);
    }
  };

  // Handle choice selection in story
  const handleChoiceSelected = (choice: any) => {
    if (isTyping) {
      skipTypewriter();
      return;
    }

    playClick();
    
    // Log previous dialogue and choice
    const scene = STORY_SCENES[currentSceneId];
    logDialogue(scene.dialogueSpeaker || "Narrador", currentText);
    logDialogue(aranzaName, choice.text);
    logDialogue("Resultado", choice.consequenceText);

    // Apply stats modifiers
    const newStats = { ...stats };
    Object.keys(choice.statsModifiers).forEach((key) => {
      const statKey = key as keyof GameStats;
      newStats[statKey] = Math.min(20, Math.max(0, newStats[statKey] + (choice.statsModifiers[statKey] || 0)));
    });

    setStats(newStats);
    setHistory(prev => [...prev, choice.id]);

    // Handle next scene trigger
    if (choice.nextSceneId === 'evaluate_ending') {
      triggerEndingEvaluation(newStats);
    } else {
      setCurrentSceneId(choice.nextSceneId);
      saveState(choice.nextSceneId, newStats, false, 0, true);
    }
  };

  // Calculate & show ending with gorgeous transition
  const triggerEndingEvaluation = (finalStats: GameStats) => {
    setIsTransitioningToEnding(true);
    playClick();

    setTimeout(() => {
      const matched = getMatchingEnding(finalStats);
      setActiveEnding(matched);
      setIsTransitioningToEnding(false);
      playEndingSound();

      // Save unlocked ending to global gallery persistence
      const newUnlocked = [...unlockedEndings];
      if (!newUnlocked.includes(matched.id)) {
        newUnlocked.push(matched.id);
        setUnlockedEndings(newUnlocked);
        localStorage.setItem('aranza_cafe_romance_unlocked_endings', JSON.stringify(newUnlocked));
      }

      // Clear current active session save
      localStorage.removeItem('aranza_cafe_romance_autosave');
    }, 2800); // long, satisfying dramatic transitions
  };

  // Reset completely everything
  const handleFullReset = () => {
    playClick();
    localStorage.removeItem('aranza_cafe_romance_unlocked_endings');
    localStorage.removeItem('aranza_cafe_romance_autosave');
    setUnlockedEndings([]);
    setIsPlaying(false);
    setIsPrologue(true);
    setStats({ ...INITIAL_STATS });
    setShowResetConfirm(false);
    logDialogue("Sistema", "Se han borrado todos los finales y progresos anteriores.");
  };

  // Save customized user name
  const saveCustomName = () => {
    playClick();
    if (!aranzaName.trim()) {
      setAranzaName('Aranza');
    }
    localStorage.setItem('aranza_name', aranzaName.trim() || 'Aranza');
    setNameEditingMode(false);
  };

  // Visual filters depending on lighting states
  const getLightingOverlayClass = () => {
    const light = isPrologue ? 'golden' : STORY_SCENES[currentSceneId]?.lighting;
    switch (light) {
      case 'golden': return 'lighting-golden border-amber-900/30';
      case 'sunset': return 'lighting-sunset border-amber-800/20';
      case 'dust': return 'lighting-dust border-violet-900/35';
      case 'night_warm': return 'lighting-night_warm border-amber-950/50';
      default: return 'lighting-golden';
    }
  };

  // Visual filter colors for texts
  const getLightingFilterStyle = () => {
    const light = isPrologue ? 'golden' : STORY_SCENES[currentSceneId]?.lighting;
    switch (light) {
      case 'golden': return 'from-amber-500/10 via-amber-600/5 to-transparent';
      case 'sunset': return 'from-orange-600/10 via-red-500/5 to-transparent';
      case 'dust': return 'from-violet-950/20 via-slate-900/10 to-transparent';
      case 'night_warm': return 'from-[#170e0a]/80 via-[#120b08]/40 to-transparent';
      default: return 'from-amber-500/10 to-transparent';
    }
  };

  return (
    <div id="main-container" className="min-h-screen bg-[#070504] text-amber-50 font-sans relative flex flex-col justify-between overflow-hidden">
      
      {/* Dynamic dust particle effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        {/* Animated dust spots */}
        <div className="absolute w-2 h-2 bg-amber-400 rounded-full blur-[1px] top-1/4 left-1/3 animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full blur-[2px] top-1/2 left-2/3 animate-ping" style={{ animationDuration: '14s' }} />
        <div className="absolute w-1 h-1 bg-amber-200 rounded-full top-2/3 left-1/4 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      {/* TOP HEADER CONTROLS */}
      <header id="app-header" className="w-full py-4 px-6 border-b border-[#2a1a11] bg-[#0c0806]/80 backdrop-blur-md flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-800 to-[#1c120c] flex items-center justify-center border border-amber-600/30">
            <Heart className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-serif font-bold tracking-wide text-amber-100 flex items-center gap-2">
              Aranza <span className="text-xs font-sans font-normal opacity-50 px-2 py-0.5 rounded-full bg-[#20150e] border border-amber-800/30">Café Romance</span>
            </h1>
            <p className="text-[10px] text-amber-200/50 font-mono hidden md:block">Atardecer en Le Petit Refuge</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {/* Volume toggle */}
          <button
            id="volume-control-btn"
            onClick={toggleAmbient}
            className="p-2 rounded-lg bg-[#1a110a] hover:bg-[#2e1d11] border border-[#442c1b] text-amber-200 transition relative group"
            title="Activar/Desactivar música y ambiente"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="absolute right-0 top-full mt-2 w-max bg-black text-[10px] text-amber-100 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 z-50">
              {isMuted ? "Quitar Silencio" : "Silenciar Música"}
            </span>
          </button>

          {/* Quick logs button */}
          {isPlaying && (
            <button
              id="logs-toggle-btn"
              onClick={() => { playClick(); setShowLogs(!showLogs); }}
              className="px-3 py-2 rounded-lg bg-[#1a110a] hover:bg-[#2e1d11] border border-[#442c1b] text-xs text-amber-200 font-medium transition cursor-pointer"
            >
              Historial
            </button>
          )}

          {/* Stats Button */}
          {isPlaying && !isPrologue && (
            <button
              id="stats-toggle-btn"
              onClick={() => { playClick(); setShowStats(!showStats); }}
              className="px-3 py-2 rounded-lg bg-[#2e1c10] hover:bg-amber-900 border border-[#8a5c32]/50 text-xs text-amber-100 font-medium transition flex items-center gap-1 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Sintonía
            </button>
          )}

          {/* Ending gallery button */}
          <button
            id="gallery-toggle-btn"
            onClick={() => { playClick(); setShowGallery(true); }}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 text-xs font-semibold hover:shadow-[0_0_10px_rgba(217,119,6,0.3)] transition flex items-center gap-1 border border-amber-600/40 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            Galería ({unlockedEndings.length}/10)
          </button>
        </div>
      </header>

      {/* CORE DISPLAY STAGE */}
      <main id="game-stage" className="flex-grow flex items-center justify-center p-4 md:p-8 relative z-20">

        {/* 1. START / MAIN HOME SCREEN */}
        {!isPlaying && !activeEnding && (
          <motion.div 
            id="home-screen"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-[#140c08]/90 border-2 border-[#523928] rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.9)] flex flex-col md:flex-row min-h-[500px]"
          >
            {/* Visual Intro Side with dynamic image */}
            <div className="md:w-1/2 relative bg-black flex items-center justify-center group overflow-hidden border-b md:border-b-0 md:border-r border-[#3a2517]">
              <img 
                src={cafeBg} 
                alt="Cafetería Le Petit Refuge" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-transparent to-black/40" />

              {/* Decorative coffee quote card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 border border-amber-500/10 backdrop-blur-sm">
                <p className="font-serif italic text-amber-200/90 text-sm mb-1 leading-relaxed">
                  "El destino es un café que se sirve caliente, con un poco de azúcar y un suspiro de misterio."
                </p>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">— Notas de Refuge</span>
              </div>
            </div>

            {/* Content Controls Side */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-[#150d09] relative">
              
              {/* Header section */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} /> 
                  Simulador de Citas Novela Visual
                </div>

                <h2 className="text-3.5xl md:text-4xl font-serif text-amber-100 leading-tight">
                  Una Tarde en <br />
                  <span className="text-amber-400 font-serif italic text-4xl">Le Petit Refuge</span>
                </h2>

                <p className="text-sm text-amber-200/70 mt-4 leading-relaxed">
                  La tranquilidad de la tarde te guiará. Confirma tu nombre y adéntrate en un laberinto de elecciones, miradas cruzadas y un chico misterioso que cambiará tu destino.
                </p>

                {/* Profile settings block */}
                <div className="mt-8 p-4 bg-[#23150e] rounded-xl border border-amber-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <User className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs text-amber-200/50 block">Nombre de Protagonista</span>
                        {nameEditingMode ? (
                          <input 
                            id="aranza-name-input"
                            type="text" 
                            value={aranzaName}
                            maxLength={15}
                            onChange={(e) => setAranzaName(e.target.value)}
                            onBlur={saveCustomName}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveCustomName(); }}
                            className="text-sm font-semibold text-amber-100 bg-[#351f14] border border-amber-600/40 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400 mt-0.5"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-semibold text-amber-100">{aranzaName} <span className="text-[10px] text-amber-400/60 font-mono">(Click para cambiar)</span></span>
                        )}
                      </div>
                    </div>
                    {!nameEditingMode && (
                      <button 
                        id="edit-name-btn"
                        onClick={() => setNameEditingMode(true)}
                        className="text-xs text-amber-400/90 font-mono hover:underline cursor-pointer"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 mt-8">
                <button
                  id="btn-play-new-game"
                  onClick={handleStartNewGame}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#140c08] font-bold text-center transition shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-[#140c08]" />
                  Iniciar Romance
                </button>

                {hasAutosave && (
                  <button
                    id="btn-continue-game"
                    onClick={handleLoadGame}
                    className="w-full py-3 rounded-xl bg-[#20150f] hover:bg-[#312017] text-amber-100 border border-[#8a5c3c]/50 font-semibold transition text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    Continuar partida guardada
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    id="btn-credits-show"
                    onClick={() => { playClick(); setShowCredits(true); }}
                    className="flex-1 py-2.5 rounded-lg bg-[#140c08] hover:bg-[#20150f] border border-[#2e1e14] text-xs text-amber-200/80 transition text-center cursor-pointer"
                  >
                    Créditos
                  </button>
                  <button
                    id="btn-reset-show"
                    onClick={() => { playClick(); setShowResetConfirm(true); }}
                    className="px-3 py-2.5 rounded-lg bg-[#24110b]/40 hover:bg-[#33130a] border border-red-950/40 text-xs text-red-300/80 hover:text-red-300 transition text-center cursor-pointer"
                    title="Borrar todos los datos"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* 2. PROLOGUE & CORE INTERACTIVE STORY GRAPHIC */}
        {isPlaying && !activeEnding && (
          <motion.div 
            id="story-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl rounded-3xl overflow-hidden bg-[#120a06]/95 border-2 border-[#412b1c] shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col min-h-[580px] justify-between relative mt-2"
          >
            {/* Visual Atmosphere Canvas Section */}
            <div className="relative w-full h-[320px] md:h-[380px] bg-black overflow-hidden flex items-end justify-center">
              
              {/* Parallax sliding background for the cafe */}
              <img 
                src={cafeBg} 
                alt="Café" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-70 transition duration-1000 scale-102"
              />

              {/* Ambient lighting overlays representing time */}
              <div className={`absolute inset-0 transition-all duration-1000 ${getLightingOverlayClass()}`} />
              <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t ${getLightingFilterStyle()} to-transparent`} />

              {/* Dynamic light rays / particles flare illustration */}
              <div className="absolute top-0 right-1/4 w-32 h-full opacity-20 bg-gradient-to-b from-amber-200/50 via-amber-400/10 to-transparent transform rotate-12 origin-top blur-xl" />
              <div className="absolute top-0 left-1/3 w-20 h-full opacity-15 bg-gradient-to-b from-amber-300/40 via-amber-400/10 to-transparent transform -rotate-6 origin-top blur-lg" />

              {/* Character Sprites (AnimatePresence for expressions) */}
              <div className="absolute bottom-0 inset-x-0 flex justify-center items-end h-[85%] max-w-lg mx-auto overflow-hidden pointer-events-none z-20">
                <AnimatePresence mode="wait">
                  {isPrologue ? (
                    // In early parts, boy is a mysterious dark anime silhouette
                    prologueIndex < 3 ? (
                      <motion.div
                        key="silhouette"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 0.85, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                        className="w-56 h-[90%] bg-gradient-to-t from-black via-slate-900/90 to-transparent relative rounded-t-full flex items-center justify-center border-t border-amber-900/10"
                      >
                        <div className="text-amber-100/30 text-xs italic font-serif mt-20 text-center px-4">Una silueta misteriosa lee cerca de ti...</div>
                      </motion.div>
                    ) : (
                      // He raises eyes
                      <motion.img 
                        key="boy_mysterious"
                        src={boyMysteriousSprite} 
                        alt="Silueta del muchacho" 
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 0.95, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="h-full object-contain object-bottom filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] border-b-2 border-amber-900/20"
                      />
                    )
                  ) : (
                    // Core game shows his changing moods
                    STORY_SCENES[currentSceneId]?.characterExpression === 'smiling' ? (
                      <motion.img 
                        key="boy_smile"
                        src={boySmilingSprite} 
                        alt="Muchacho sonriendo" 
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 0.98, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.5 }}
                        className="h-full object-contain object-bottom filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.85)]"
                      />
                    ) : (
                      <motion.img 
                        key="boy_mysterious_core"
                        src={boyMysteriousSprite} 
                        alt="Muchacho pensativo" 
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 0.98, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.5 }}
                        className="h-full object-contain object-bottom filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.85)]"
                      />
                    )
                  )}
                </AnimatePresence>
              </div>

              {/* Speaker Tag / Name Tag Overlay */}
              <div id="speaker-tag-box" className="absolute bottom-2 left-4 md:left-8 z-30 flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#20150e] to-[#120a06] border border-amber-800/40 text-xs text-amber-200 font-semibold tracking-wider font-serif shadow-lg">
                  {isPrologue 
                    ? "Observación" 
                    : (STORY_SCENES[currentSceneId]?.dialogueSpeaker || "Narración")
                  }
                </span>
                
                {/* Visual Novel Progress Beads */}
                {!isPrologue && (
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/20 px-2.5 py-1 rounded font-mono shadow-md">
                    Capítulo {Object.keys(STORY_SCENES).indexOf(currentSceneId) + 1} / {Object.keys(STORY_SCENES).length}
                  </span>
                )}
              </div>

            </div>

            {/* Narrative Dialogue Window Section */}
            <div className="bg-gradient-to-b from-[#1b110b] to-[#0c0806] p-6 md:p-8 flex-grow flex flex-col justify-between border-t border-[#3a2517] relative">
              
              {/* Typewrited Novel Text Block */}
              <div 
                id="dialogue-block"
                className="cursor-pointer min-h-[96px] md:min-h-[110px]"
                onClick={skipTypewriter}
                title="Haga click para pasar instantáneamente"
              >
                <p className="text-amber-100/90 font-serif text-base md:text-lg leading-relaxed text-left">
                  {currentText}
                  {isTyping && <span className="inline-block w-2.5 h-4 bg-amber-400 ml-1 animate-pulse" />}
                </p>
              </div>

              {/* ACTION CHOICE PANE FOOTER */}
              <div className="mt-6 pt-4 border-t border-[#2e1d13]">
                {isPrologue ? (
                  /* Prologue click to advance */
                  <div className="flex justify-end">
                    <button
                      id="prologue-advance-btn"
                      onClick={handlePrologueNext}
                      className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold text-sm transition duration-200 flex items-center gap-2 shadow-lg hover:shadow-amber-950/50 cursor-pointer"
                    >
                      {prologueIndex < PROLOGUE_PAGES.length - 1 ? (
                        <>Continuar sintiendo <ArrowRight className="w-4 h-4" /></>
                      ) : (
                        <>Sentarme cerca y ver qué pasa... <ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Story Branching choices (Exactly 3) */
                  <div id="choices-grid" className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {STORY_SCENES[currentSceneId]?.choices.map((choice, index) => (
                      <button
                        key={choice.id}
                        id={`btn-choice-${index}`}
                        disabled={isTyping}
                        onClick={() => handleChoiceSelected(choice)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                          isTyping 
                            ? 'bg-[#150e0a]/40 border-amber-950/30 text-amber-200/40 cursor-not-allowed'
                            : 'bg-[#1f140d]/70 border-[#5e3f28] hover:border-amber-500/60 hover:bg-gradient-to-b hover:from-[#2e1f15] hover:to-[#170e0a] hover:shadow-[0_0_12px_rgba(212,175,55,0.15)] hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <span className="font-mono text-xs text-amber-400 font-semibold py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded h-fit">
                            Opción {index + 1}
                          </span>
                        </div>
                        <p className={`mt-3 text-sm leading-relaxed font-serif ${isTyping ? 'text-amber-200/30' : 'text-amber-100 group-hover:text-amber-300 transition'}`}>
                          {choice.text}
                        </p>
                        {/* Little marker arrow inside the selector */}
                        <div className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 font-mono text-right mt-3 transition duration-300">
                          Decidir →
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* 3. TRANSITION OVERLAY SCREEN (EVALUATION BEFORE ENDINGS) */}
        {isTransitioningToEnding && (
          <motion.div 
            id="loading-ending-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl bg-[#0e0906]/98 border border-[#523928] rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative"
          >
            {/* Spinning heart/hourglass decoration */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl animate-ping" />
              <div className="w-16 h-16 rounded-full border-2 border-t-amber-400 border-amber-900/20 animate-spin flex items-center justify-center">
                <Heart className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-serif text-amber-100 animate-pulse">Tejiendo el Hilo del Destino...</h3>
            <p className="text-sm text-amber-200/60 mt-3 max-w-md mx-auto leading-relaxed">
              Aranza, tus decisiones en 'Le Petit Refuge', tus palabras, gestos y evasivas están esculpiendo el desenlace definitivo con el chico misterioso.
            </p>

            {/* Interactive choices feedback items animation */}
            <div className="mt-8 space-y-1.5 text-xs text-[#8a5c3e] font-mono">
              <p>Midiendo atracción cósmica... OK</p>
              <p>Evaluando nivel de sintonía... OK</p>
              <p>Generando retrato final de Aranza... OK</p>
            </div>
          </motion.div>
        )}

        {/* 4. CHOSEN ENDING RESOLUTION SCREEN */}
        {activeEnding && (
          <motion.div 
            id={`ending-resolution-${activeEnding.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-gradient-to-b from-[#140c08] to-[#070504] border-4 border-double border-amber-600/70 rounded-3xl p-6 md:p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden"
          >
            {/* Soft gold light frame */}
            <div className="absolute inset-0 border border-amber-500/10 pointer-events-none m-2 rounded-2xl" />

            <div className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-400 text-xs px-4 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest font-semibold mb-3">
              <Award className="w-4 h-4" /> Desconectando del atardecer
            </div>

            <h2 className="text-3xl md:text-5xl font-serif text-amber-100 tracking-tight mt-1">
              {activeEnding.title}
            </h2>
            <p className="text-base text-amber-400 font-serif italic mt-1.5">
              {activeEnding.subtitle}
            </p>

            {/* Elegant divider */}
            <div className="h-[2px] max-w-md bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto my-6" />

            {/* Polished polaroid wrapper containing a cozy icon layout or illustrations */}
            <div className="max-w-xl mx-auto p-6 md:p-8 bg-[#1f130b] rounded-2xl border border-amber-800/20 text-justify space-y-5 my-6 relative shadow-inner">
              <blockquote className="border-l-4 border-amber-500 pl-4 py-1 italic text-amber-100 font-serif text-lg leading-relaxed bg-[#2c1b11]/60 rounded-r">
                {activeEnding.poeticText}
              </blockquote>

              <p className="text-sm md:text-base text-amber-100/80 leading-relaxed">
                {activeEnding.description}
              </p>
            </div>

            {/* Ending Game Stats Summary Review */}
            <div className="max-w-xl mx-auto p-4 bg-black/60 rounded-xl border border-amber-900/30 text-left my-6">
              <h4 className="text-xs text-amber-400 font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Métricas de afinidad alcanzadas:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Afinidad:</span>
                  <span className="font-semibold text-rose-400">{stats.affinity} pts</span>
                </div>
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Confianza:</span>
                  <span className="font-semibold text-emerald-400">{stats.trust} pts</span>
                </div>
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Romance:</span>
                  <span className="font-semibold text-rose-300">{stats.romance} pts</span>
                </div>
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Comodidad:</span>
                  <span className="font-semibold text-amber-400">{stats.comfort} pts</span>
                </div>
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Interés:</span>
                  <span className="font-semibold text-sky-400">{stats.mutualInterest} pts</span>
                </div>
                <div className="flex justify-between items-center bg-[#150e09]/50 p-2 rounded">
                  <span className="text-amber-200/50">Curiosidad:</span>
                  <span className="font-semibold text-violet-400">{stats.curiosity} pts</span>
                </div>
              </div>
            </div>

            {/* Return controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                id="btn-return-home"
                onClick={() => { playClick(); setActiveEnding(null); setIsPlaying(false); }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-sm transition shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                Volver al Menú Principal
              </button>
              <button
                id="btn-quick-replay"
                onClick={handleStartNewGame}
                className="px-6 py-3.5 rounded-xl bg-[#20150f] hover:bg-[#312017] text-amber-100 border border-[#8a5c3c]/50 font-semibold transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Vuelve a tomar café (Reintentar)
              </button>
            </div>
          </motion.div>
        )}

      </main>

      {/* FOOTER & CREDITS BAR */}
      <footer id="app-footer" className="w-full py-4 px-6 border-t border-[#2a1a11] bg-[#0c0806]/90 text-center text-xs text-amber-200/40 relative z-30">
        <p>© 2026 Novela Romántica 'Le Petit Refuge'. Todos los sentimientos reservados.</p>
        <p className="text-[10px] opacity-65 mt-0.5">Diseño inmersivo estilo simulador vintage para Aranza.</p>
      </footer>

      {/* DIALOGUE HISTORIC LOGS TRAY */}
      <AnimatePresence>
        {showLogs && (
          <motion.div 
            id="dialogue-logs-tray"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 bg-[#140c08] border-l-2 border-[#523928] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
          >
            <div className="w-full">
              <div className="flex items-center justify-between pb-4 border-b border-[#312015] mb-4">
                <h3 className="text-lg font-serif text-amber-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Historial de Diálogos
                </h3>
                <button 
                  id="logs-close-btn"
                  onClick={() => { playClick(); setShowLogs(false); }}
                  className="p-1 px-2.5 rounded bg-[#20150e] border border-amber-800/30 text-amber-100 hover:text-amber-300 transition text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {/* Logs area */}
              <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
                {dialogueLogs.length === 0 ? (
                  <p className="text-xs text-amber-200/30 italic text-center py-10">Ningún diálogo guardado aún en esta sesión.</p>
                ) : (
                  dialogueLogs.map((log, idx) => (
                    <div key={idx} className="border-b border-amber-950/30 pb-2.5 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                          log.speaker === aranzaName ? 'text-amber-400' : log.speaker === 'Chico Misterioso' || log.speaker === 'Él' ? 'text-rose-400' : 'text-amber-200/50'
                        }`}>
                          {log.speaker}
                        </span>
                        <span className="text-[9px] text-[#5e3f28] font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-amber-100/90 leading-relaxed font-serif text-left">
                        {log.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-amber-950/40 text-[10px] text-amber-200/30 text-center">
              Desliza para ver la cronología completa de tus decisiones.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REAL-TIME STATS DRAWER (SINTONÍA DE ALMA) */}
      <AnimatePresence>
        {showStats && (
          <motion.div 
            id="stats-drawer"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            className="fixed inset-x-0 top-0 z-40 bg-[#140c08]/96 border-b-2 border-amber-700/50 p-6 shadow-2xl flex flex-col items-center"
          >
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#2e1c10] mb-5">
                <h3 className="text-lg font-serif text-amber-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400 animate-pulse" />
                  Sintonía del Alma — Afinidades de {aranzaName}
                </h3>
                <button
                  id="stats-close-btn"
                  onClick={() => { playClick(); setShowStats(false); }}
                  className="p-1 px-2.5 rounded bg-[#2a160b] border border-amber-800/30 text-xs text-amber-200 cursor-pointer"
                >
                  Ocultar
                </button>
              </div>

              {/* Progress bars of current statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Afinidad */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium">Afinidad Mutua</span>
                    <span className="text-rose-400 font-mono font-bold">{stats.affinity} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(stats.affinity / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">Qué tan unidos se sienten a nivel de valores compartidos.</span>
                </div>

                {/* Confianza */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium">Confianza Mútua</span>
                    <span className="text-emerald-400 font-bold">{stats.trust} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.trust / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">La seguridad que tiene el muchacho para confesarse contigo.</span>
                </div>

                {/* Romance */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium">Atracción Romántica</span>
                    <span className="text-pink-400 font-bold">{stats.romance} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(stats.romance / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">La tensión sensual y la química romántica que arde lentamente.</span>
                </div>

                {/* Comodidad */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium">Nivel de Comodidad</span>
                    <span className="text-amber-400 font-bold">{stats.comfort} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(stats.comfort / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">Qué tan hogareña e informal resulta la conversación.</span>
                </div>

                {/* Interés Mutuo */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium">Interés Genuino</span>
                    <span className="text-sky-400 font-bold">{stats.mutualInterest} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(stats.mutualInterest / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">La intención de verse fuera de esta pequeña cafetería.</span>
                </div>

                {/* Curiosidad */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span className="text-amber-200 font-medium font-serif">Curiosidad & Enigma</span>
                    <span className="text-violet-400 font-bold">{stats.curiosity} / 20</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d1b11] rounded-full overflow-hidden border border-amber-950">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(stats.curiosity / 20) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8a5c3e] italic block mt-0.5">El magnetismo por develar los misterios del otro.</span>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREDITS VIEW WINDOW */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            id="credits-dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              id="credits-dialog-box"
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="bg-[#1f130b] border-2 border-[#8b5a2b] max-w-md w-full rounded-2xl p-6 relative text-center"
            >
              <h3 className="text-2xl font-serif text-amber-100 mb-4">Créditos de Creación</h3>
              <div className="space-y-4 text-sm text-amber-100/80 leading-relaxed text-justify px-2">
                <p>
                  <strong className="text-amber-400">Dirección Narrativa:</strong> Escrito con profundo mimo y sentimiento para Aranza. Cada línea captura la calidez íntima del café, los silencios y las miradas trémulas bajo el crepúsculo.
                </p>
                <p>
                  <strong className="text-amber-400">Efectos de Sonido:</strong> Sintetizados dinámicamente en tiempo real mediante el motor virtual <strong className="font-mono">Web Audio Engine</strong> de Le Petit Refuge (sin descargas ni CORS).
                </p>
                <p>
                  <strong className="text-amber-400">Ilustraciones Nobles:</strong> Generadas con modelos generativos para reflejar siluetas, cafebrerías acogedoras y emociones puras.
                </p>
              </div>

              <button
                id="btn-credits-close"
                onClick={() => { playClick(); setShowCredits(false); }}
                className="mt-6 w-full py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 border border-amber-600/30 font-medium transition cursor-pointer"
              >
                Volver a soñar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPLETE ERASE DATA DIALOG CONTAINER */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            id="reset-confirm-overlay"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#1c120c] border border-red-500/30 max-w-sm w-full rounded-xl p-6 text-center">
              <h4 className="text-lg font-serif text-red-200">¿Reinicio Absoluto?</h4>
              <p className="text-xs text-amber-200/60 mt-2 leading-relaxed">
                Esto borrará de forma permanente todos tus finales recopilados en la galería y cualquier partida salvada actual. ¿Estás absolutamente segura de hacerlo, Aranza?
              </p>
              <div className="flex gap-2 mt-5">
                <button
                  id="btn-confirm-erase-yes"
                  onClick={handleFullReset}
                  className="flex-1 py-2 rounded bg-red-800 hover:bg-red-700 text-red-100 text-xs font-semibold transition"
                >
                  Sí, borrar todo
                </button>
                <button
                  id="btn-confirm-erase-no"
                  onClick={() => { playClick(); setShowResetConfirm(false); }}
                  className="flex-1 py-1 px-3 rounded bg-amber-950 hover:bg-[#312017] text-amber-100 text-xs border border-amber-800/30 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER DOCKED ENDINGS GALLERY PANEL */}
      <AnimatePresence>
        {showGallery && (
          <EndingGallery 
            unlockedEndings={unlockedEndings} 
            playClickSound={playClick}
            onClose={() => setShowGallery(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
