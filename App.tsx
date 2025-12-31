
import React, { useState, useEffect, useRef } from 'react';
import Fireworks from './components/Fireworks';
import CountdownDisplay from './components/CountdownDisplay';
import { getNewYearQuote } from './services/geminiService';

// 祥云灯笼组件
const Lantern = ({ className, size = "normal" }: { className?: string; size?: "small" | "normal" }) => {
  const isSmall = size === "small";
  return (
    <div className={`flex flex-col items-center animate-sway transition-all duration-700 ${className}`}>
      <div className={`${isSmall ? 'w-0.5 h-4' : 'w-0.5 h-6'} bg-yellow-600`}></div>
      <div className={`${isSmall ? 'w-10 h-14' : 'w-12 h-16'} bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] relative border-2 border-yellow-500 flex items-center justify-center`}>
        <div className="w-full h-0.5 bg-yellow-500/50 absolute top-1/4"></div>
        <div className="w-full h-0.5 bg-yellow-500/50 absolute bottom-1/4"></div>
        <span className={`${isSmall ? 'text-base' : 'text-lg'} text-yellow-400 font-bold select-none`}>福</span>
      </div>
      <div className="relative flex flex-col items-center -mt-1">
        <div className={`${isSmall ? 'w-4 h-1' : 'w-5 h-1'} bg-yellow-600 rounded-full`}></div>
        <div className={`${isSmall ? 'w-3 h-5' : 'w-4 h-6'} bg-red-700 rounded-b-lg shadow-lg flex flex-col items-center pt-1 overflow-hidden`}>
           <div className="w-full h-0.5 bg-yellow-500/30 mb-1"></div>
           <div className="w-full h-0.5 bg-yellow-500/30"></div>
        </div>
        <div className="flex gap-0.5 mt-0.5">
           <div className="w-0.5 h-3 bg-red-500 animate-pulse"></div>
           <div className="w-0.5 h-5 bg-red-500 animate-pulse delay-75"></div>
           <div className="w-0.5 h-3 bg-red-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const defaultTarget = new Date('2026-01-01T00:00:00');
  const [targetDate, setTargetDate] = useState<Date>(defaultTarget);
  const [quote, setQuote] = useState<string>('正在感悟未来...');
  const [isNewYear, setIsNewYear] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [burstCounter, setBurstCounter] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      const q = await getNewYearQuote();
      setQuote(q);
    };
    fetchQuote();


    const checkNewYear = setInterval(() => {
      const now = new Date();
      if (now >= targetDate && !isNewYear) {
        setIsNewYear(true);
        // 触发全屏烟花大爆发
        setBurstCounter(prev => prev + 1);
      }
    }, 500);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(checkNewYear);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isNewYear, targetDate]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Autoplay blocked."));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const previewMidnight = () => {
    setIsNewYear(false);
    setTargetDate(new Date(Date.now() + 5000));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-cute bg-[#020617]">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out scale-110 pointer-events-none"
        style={{ 
          backgroundImage: `url("${new URL('background.jpg', import.meta.env.BASE_URL).toString()}")`,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)`
        }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-10"></div>
      </div>
      
      <div className="absolute top-0 left-12 z-20 hidden lg:block"><Lantern /></div>
      <div className="absolute top-0 right-12 z-20 hidden lg:block"><Lantern /></div>

      <div className="absolute bottom-8 left-8 z-50">
        <button 
          onClick={previewMidnight}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border-yellow-500/30 text-yellow-100 hover:bg-yellow-500/20 transition-all duration-300 group shadow-lg shadow-yellow-500/10"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🚀</span>
          <span className="text-sm font-bold tracking-widest">体验零点</span>
        </button>
      </div>

      

      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleMusic}
          className={`w-12 h-12 flex items-center justify-center rounded-full glass border-white/20 shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 ${isPlaying ? 'animate-spin-slow' : ''}`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" loop />
      </div>

      <Fireworks burstTrigger={burstCounter} soundEnabled={false} />

      <main className="relative z-30 flex flex-col items-center text-center max-w-5xl w-full px-4 py-10">
        <header className="mb-12 sm:mb-20">
          <h2 className="text-yellow-400 uppercase tracking-[0.5em] text-xs sm:text-sm font-semibold mb-6 drop-shadow-lg opacity-90 animate-pulse">
            🎇 岁序更新 · 万象新生 🎇
          </h2>
          <h1 className="text-6xl sm:text-9xl font-black text-white tracking-tighter mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            {isNewYear ? '2026 大吉' : '2026 倒计时'}
          </h1>
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-200 text-base sm:text-xl max-w-lg mx-auto font-light drop-shadow-md opacity-80">
            星辰指引前行的路，2026 的辉煌即将开启。
          </p>
        </header>

        <section className="mb-16">
          {!isNewYear ? (
            <CountdownDisplay targetDate={targetDate} />
          ) : (
            <div className="text-7xl sm:text-[10rem] font-black animate-bounce text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-white to-yellow-500 drop-shadow-[0_0_60px_rgba(250,204,21,0.6)]">
              新年快乐！
            </div>
          )}
        </section>

        <footer className="mt-4 max-w-3xl w-full">
          <div className="glass px-10 py-10 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 blur-[80px]"></div>
            <p className="text-white text-xl sm:text-3xl font-medium leading-relaxed italic transition-transform duration-500 group-hover:scale-[1.02]">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </footer>
      </main>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-20"></div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
