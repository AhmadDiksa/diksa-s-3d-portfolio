'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const W = 900, H = 600;
const PADDLE_W = 14, PADDLE_H = 90;
const BALL_R = 9;
const PLAYER_X = 30, AI_X = W - 30 - PADDLE_W;
const PADDLE_SPEED = 6;
const MAX_SCORE = 7;

interface GameState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  playerScore: number;
  aiScore: number;
  keys: Record<string, boolean>;
  particles: Particle[];
  trail: { x: number; y: number; age: number }[];
  state: 'idle' | 'playing' | 'paused';
  winner: '' | 'player' | 'ai';
  aiDifficulty: number; // 0-1
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

function makeBallVelocity(dir: 1 | -1 = 1) {
  const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
  const speed = 5.5;
  return { vx: Math.cos(angle) * speed * dir, vy: Math.sin(angle) * speed };
}

export default function PongPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pScore, setPScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [winner, setWinner] = useState<'' | 'player' | 'ai'>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const rafRef = useRef<number>(0);
  const stateRef = useRef<GameState>({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ballX: W / 2, ballY: H / 2,
    ballVX: 5.5, ballVY: 0,
    playerScore: 0, aiScore: 0,
    keys: {}, particles: [], trail: [],
    state: 'idle', winner: '',
    aiDifficulty: 0.7,
  });

  const diffMap = { easy: 0.4, medium: 0.72, hard: 0.96 };

  const resetBall = (dir: 1 | -1 = 1) => {
    const s = stateRef.current;
    s.ballX = W / 2; s.ballY = H / 2;
    const v = makeBallVelocity(dir);
    s.ballVX = v.vx; s.ballVY = v.vy;
    s.trail = [];
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    const s = stateRef.current;
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const speed = 1.5 + Math.random() * 4;
      s.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 35 + Math.random() * 20, maxLife: 55, color, size: 2 + Math.random() * 3 });
    }
  };

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.playerY = H / 2 - PADDLE_H / 2;
    s.aiY = H / 2 - PADDLE_H / 2;
    s.playerScore = 0; s.aiScore = 0;
    s.particles = []; s.trail = [];
    s.aiDifficulty = diffMap[difficulty];
    resetBall(1);
    s.state = 'playing'; s.winner = '';
    setGameState('playing'); setPScore(0); setAiScore(0); setWinner('');
  }, [difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      s.keys[e.code] = down;
      if (['ArrowUp', 'ArrowDown', 'Space', 'KeyW', 'KeyS'].includes(e.code)) e.preventDefault();
    };
    const onSpaceStart = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (s.state === 'idle' || s.winner) startGame();
        else if (s.state === 'playing') { s.state = 'paused'; setGameState('paused'); }
        else if (s.state === 'paused') { s.state = 'playing'; setGameState('playing'); }
      }
    };
    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));
    window.addEventListener('keydown', onSpaceStart);

    function drawPaddle(x: number, y: number, color: string, glow: string) {
      ctx.save();
      ctx.shadowColor = glow; ctx.shadowBlur = 18;
      const grad = ctx.createLinearGradient(x, y, x + PADDLE_W, y + PADDLE_H);
      grad.addColorStop(0, color); grad.addColorStop(1, glow);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, PADDLE_W, PADDLE_H, 6);
      ctx.fill();
      ctx.restore();
    }

    function drawBall(x: number, y: number, speed: number) {
      ctx.save();
      const glow = `hsl(${220 + speed * 5}, 90%, 70%)`;
      ctx.shadowColor = glow; ctx.shadowBlur = 24;
      const grad = ctx.createRadialGradient(x - 3, y - 3, 2, x, y, BALL_R);
      grad.addColorStop(0, '#ffffff'); grad.addColorStop(0.5, glow); grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x, y, BALL_R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function loop() {
      // Background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, W, H);

      // Center line
      ctx.save();
      ctx.setLineDash([12, 14]);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.restore();

      // Court glow
      const courtGlow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 340);
      courtGlow.addColorStop(0, 'rgba(255,255,255,0.02)'); courtGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = courtGlow; ctx.fillRect(0, 0, W, H);

      if (s.state !== 'playing') {
        ctx.fillStyle = 'rgba(5,5,16,0.75)'; ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        if (s.state === 'idle') {
          ctx.font = 'bold 52px system-ui'; ctx.fillStyle = '#94a3b8';
          ctx.fillText('PONG VIP', W/2, H/2 - 50);
          ctx.font = '16px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillText('W/S or ↑↓ to move  |  SPACE to start', W/2, H/2 + 5);
          ctx.font = '12px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillText(`AI Difficulty: ${difficulty.toUpperCase()}`, W/2, H/2 + 35);
        } else if (s.state === 'paused') {
          ctx.font = 'bold 40px system-ui'; ctx.fillStyle = '#facc15';
          ctx.fillText('PAUSED', W/2, H/2 - 20);
          ctx.font = '14px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fillText('SPACE to resume', W/2, H/2 + 20);
        } else if (s.winner) {
          const isPlayer = s.winner === 'player';
          ctx.font = 'bold 52px system-ui';
          ctx.fillStyle = isPlayer ? '#22c55e' : '#ef4444';
          ctx.fillText(isPlayer ? 'YOU WIN! 🏆' : 'AI WINS', W/2, H/2 - 40);
          ctx.font = '16px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillText('SPACE or click PLAY AGAIN', W/2, H/2 + 15);
        }
        drawPaddle(PLAYER_X, s.playerY, '#e2e8f0', '#94a3b8');
        drawPaddle(AI_X, s.aiY, '#f87171', '#fca5a5');
        rafRef.current = requestAnimationFrame(loop); return;
      }

      // ---- Update ----
      // Player paddle
      if ((s.keys['ArrowUp'] || s.keys['KeyW']) && s.playerY > 0) s.playerY -= PADDLE_SPEED;
      if ((s.keys['ArrowDown'] || s.keys['KeyS']) && s.playerY + PADDLE_H < H) s.playerY += PADDLE_SPEED;

      // AI paddle — tracks ball with difficulty-based reaction
      const aiCenter = s.aiY + PADDLE_H / 2;
      const diff = s.ballY - aiCenter;
      const aiSpeed = PADDLE_SPEED * s.aiDifficulty;
      if (Math.abs(diff) > 4) s.aiY += Math.sign(diff) * Math.min(aiSpeed, Math.abs(diff));
      s.aiY = Math.max(0, Math.min(H - PADDLE_H, s.aiY));

      // Ball trail
      s.trail.push({ x: s.ballX, y: s.ballY, age: 0 });
      if (s.trail.length > 14) s.trail.shift();
      s.trail.forEach(t => t.age++);

      // Move ball
      s.ballX += s.ballVX;
      s.ballY += s.ballVY;

      // Wall bounce
      if (s.ballY - BALL_R <= 0) { s.ballY = BALL_R; s.ballVY = Math.abs(s.ballVY); }
      if (s.ballY + BALL_R >= H) { s.ballY = H - BALL_R; s.ballVY = -Math.abs(s.ballVY); }

      // Player paddle hit
      if (s.ballX - BALL_R <= PLAYER_X + PADDLE_W && s.ballX - BALL_R >= PLAYER_X && s.ballY >= s.playerY && s.ballY <= s.playerY + PADDLE_H) {
        s.ballVX = Math.abs(s.ballVX) * 1.05;
        const relY = (s.ballY - (s.playerY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ballVY = relY * 7;
        s.ballX = PLAYER_X + PADDLE_W + BALL_R;
        spawnParticles(s.ballX, s.ballY, '#94a3b8');
      }

      // AI paddle hit
      if (s.ballX + BALL_R >= AI_X && s.ballX + BALL_R <= AI_X + PADDLE_W && s.ballY >= s.aiY && s.ballY <= s.aiY + PADDLE_H) {
        s.ballVX = -Math.abs(s.ballVX) * 1.05;
        const relY = (s.ballY - (s.aiY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ballVY = relY * 7;
        s.ballX = AI_X - BALL_R;
        spawnParticles(s.ballX, s.ballY, '#fca5a5');
      }

      // Cap ball speed
      const spd = Math.sqrt(s.ballVX ** 2 + s.ballVY ** 2);
      if (spd > 18) { s.ballVX = (s.ballVX / spd) * 18; s.ballVY = (s.ballVY / spd) * 18; }

      // Score
      if (s.ballX < 0) {
        s.aiScore++; setAiScore(s.aiScore);
        spawnParticles(0, s.ballY, '#ef4444');
        if (s.aiScore >= MAX_SCORE) { s.winner = 'ai'; s.state = 'playing'; setWinner('ai'); }
        else resetBall(1);
      }
      if (s.ballX > W) {
        s.playerScore++; setPScore(s.playerScore);
        spawnParticles(W, s.ballY, '#22c55e');
        if (s.playerScore >= MAX_SCORE) { s.winner = 'player'; setWinner('player'); }
        else resetBall(-1);
      }

      // ---- Draw ----
      // Trail
      for (let i = 0; i < s.trail.length; i++) {
        const t = s.trail[i];
        const alpha = (i / s.trail.length) * 0.4;
        const r = BALL_R * (i / s.trail.length) * 0.8;
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(t.x, t.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Particles
      s.particles = s.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.93; p.vy *= 0.93; p.life--; return p.life > 0; });
      for (const p of s.particles) {
        ctx.save(); ctx.globalAlpha = p.life / p.maxLife;
        ctx.shadowColor = p.color; ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Paddles & ball
      drawPaddle(PLAYER_X, s.playerY, '#e2e8f0', '#94a3b8');
      drawPaddle(AI_X, s.aiY, '#f87171', '#fca5a5');
      drawBall(s.ballX, s.ballY, spd);

      // Score display
      ctx.save();
      ctx.font = 'bold 64px system-ui'; ctx.textAlign = 'center'; ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff';
      ctx.fillText(`${s.playerScore}`, W / 4, 80);
      ctx.fillText(`${s.aiScore}`, 3 * W / 4, 80);
      ctx.restore();

      // Labels
      ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.textAlign = 'left';
      ctx.fillText('YOU', PLAYER_X + PADDLE_W + 6, 18);
      ctx.textAlign = 'right';
      ctx.fillText('AI', AI_X - 6, 18);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', e => onKey(e, true));
      window.removeEventListener('keyup', e => onKey(e, false));
      window.removeEventListener('keydown', onSpaceStart);
    };
  }, [startGame, difficulty]);

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-4">
      {/* Game Navbar */}
      <div className="mb-8 flex gap-1 bg-white/5 p-1 border border-white/10 rounded-full">
        <Link 
          href="/game" 
          className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full text-white/40 hover:text-white transition-all"
        >
          Space Shooter
        </Link>
        <Link 
          href="/pong" 
          className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full bg-white text-black transition-all"
        >
          Pong VIP
        </Link>
      </div>

      {/* Header */}
      <div className="w-full max-w-[900px] flex justify-between items-center mb-4">
        <Link href="/" className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
          ← Portfolio
        </Link>
        <div className="flex items-center gap-4">
          {/* Difficulty selector */}
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-[10px] uppercase tracking-widest px-3 py-1 border transition-colors ${difficulty === d ? 'border-brand-400 text-brand-400' : 'border-white/10 text-white/30 hover:border-white/30'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-6 text-[11px] font-mono">
          <span className="text-white">{pScore}</span>
          <span className="text-white/20">vs</span>
          <span className="text-red-400">{aiScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-white/10" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.03), 0 0 40px rgba(248,113,113,0.04)' }}>
        <canvas ref={canvasRef} width={W} height={H} className="block" />
      </div>

      {/* Controls */}
      <div className="w-full max-w-[900px] flex justify-between items-center mt-4">
        <p className="text-[11px] font-mono text-white/20">W/S or ↑↓ to move  |  SPACE pause</p>
        <button
          onClick={startGame}
          className="px-6 py-2 text-[11px] uppercase tracking-widest font-bold border border-white/20 text-white/60 hover:bg-white hover:text-black transition-all duration-200"
        >
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
        <Link href="/game" className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
          Space Shooter →
        </Link>
      </div>
    </div>
  );
}
