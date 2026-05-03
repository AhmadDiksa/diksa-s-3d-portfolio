'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface Entity { x: number; y: number; w: number; h: number; }
interface Bullet extends Entity { dy: number; }
interface Enemy extends Entity { hp: number; speed: number; shootTimer: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }
interface Star { x: number; y: number; size: number; speed: number; opacity: number; }

const GW = 900, GH = 650;
const PW = 48, PH = 48;
const EW = 40, EH = 36;
const BW = 4, BH = 14;
const PLAYER_SPEED = 5, BULLET_SPEED = 10, ENEMY_BULLET_SPEED = 4;

function collides(a: Entity, b: Entity) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function makeEnemyGrid(wave: number): Enemy[] {
  const rows = Math.min(2 + Math.floor(wave / 2), 5);
  const cols = Math.min(6 + wave, 12);
  const enemies: Enemy[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      enemies.push({ x: 60 + c * (EW + 20), y: 60 + r * (EH + 18), w: EW, h: EH, hp: 1 + Math.floor(wave / 3), speed: 0.5 + wave * 0.12, shootTimer: Math.random() * 180 });
  return enemies;
}

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'dead'>('idle');
  const rafRef = useRef<number>(0);
  const s = useRef({
    player: { x: GW / 2 - PW / 2, y: GH - 80, w: PW, h: PH },
    bullets: [] as Bullet[], enemyBullets: [] as Bullet[], enemies: [] as Enemy[],
    stars: [] as Star[], particles: [] as Particle[], keys: {} as Record<string, boolean>,
    shootCooldown: 0, direction: 1, score: 0, lives: 3, wave: 1,
    gameState: 'idle' as 'idle' | 'playing' | 'dead', invincible: 0,
  });

  const initStars = () => Array.from({ length: 120 }, () => ({ x: Math.random() * GW, y: Math.random() * GH, size: Math.random() * 2 + 0.3, speed: 0.3 + Math.random() * 0.8, opacity: 0.2 + Math.random() * 0.8 }));

  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5, spd = 1.5 + Math.random() * 3;
      s.current.particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 40 + Math.random() * 20, maxLife: 60, color, size: 2 + Math.random() * 3 });
    }
  };

  const startGame = useCallback(() => {
    const g = s.current;
    g.player = { x: GW / 2 - PW / 2, y: GH - 80, w: PW, h: PH };
    g.bullets = []; g.enemyBullets = []; g.particles = [];
    g.stars = initStars(); g.enemies = makeEnemyGrid(1);
    g.score = 0; g.lives = 3; g.wave = 1; g.direction = 1; g.shootCooldown = 0; g.invincible = 0;
    g.gameState = 'playing';
    setScore(0); setLives(3); setWave(1); setGameState('playing');
  }, []);

  useEffect(() => {
    const g = s.current;
    g.stars = initStars();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const onKey = (e: KeyboardEvent, down: boolean) => { g.keys[e.code] = down; if (['Space','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); };
    const onSpace = (e: KeyboardEvent) => { if (e.code === 'Space' && g.gameState !== 'playing') startGame(); };
    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));
    window.addEventListener('keydown', onSpace);

    function drawPlayer(x: number, y: number, inv: number) {
      const alpha = inv > 0 && Math.floor(inv / 5) % 2 === 0 ? 0.3 : 1;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.moveTo(x + PW/2, y); ctx.lineTo(x + PW, y + PH); ctx.lineTo(x, y + PH); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.moveTo(x, y + PH * 0.5); ctx.lineTo(x - 12, y + PH); ctx.lineTo(x + 12, y + PH); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + PW, y + PH * 0.5); ctx.lineTo(x + PW + 12, y + PH); ctx.lineTo(x + PW - 12, y + PH); ctx.closePath(); ctx.fill();
      const gr = ctx.createRadialGradient(x + PW/2, y + PH, 2, x + PW/2, y + PH, 14);
      gr.addColorStop(0, 'rgba(226,232,240,0.8)'); gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr; ctx.fillRect(x - 5, y + PH - 4, PW + 10, 20);
      ctx.restore();
    }

    function drawEnemy(e: Enemy) {
      const cx = e.x + e.w/2, cy = e.y + e.h/2;
      ctx.save();
      ctx.fillStyle = `hsl(0, 0%, ${50 + e.hp * 10}%)`;
      ctx.beginPath(); ctx.ellipse(cx, cy, e.w/2, e.h/2, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(cx-8, cy-4, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+8, cy-4, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx-7, cy-4, 2.5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+9, cy-4, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawBullet(b: Bullet, color: string) {
      ctx.save();
      const gr = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
      gr.addColorStop(0, color); gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr; ctx.shadowColor = color; ctx.shadowBlur = 6;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.restore();
    }

    function loop() {
      const g = s.current;
      ctx.fillStyle = '#08080f'; ctx.fillRect(0, 0, GW, GH);
      for (const star of g.stars) {
        star.y += star.speed; if (star.y > GH) { star.y = 0; star.x = Math.random() * GW; }
        ctx.globalAlpha = star.opacity; ctx.fillStyle = '#fff'; ctx.fillRect(star.x, star.y, star.size, star.size);
      }
      ctx.globalAlpha = 1;

      if (g.gameState !== 'playing') {
        ctx.fillStyle = 'rgba(8,8,15,0.75)'; ctx.fillRect(0, 0, GW, GH);
        ctx.textAlign = 'center';
        if (g.gameState === 'idle') {
          ctx.font = 'bold 48px monospace'; ctx.fillStyle = '#e2e8f0'; ctx.fillText('SPACE SHOOTER', GW/2, GH/2 - 40);
          ctx.font = '16px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('SPACE / click START to play', GW/2, GH/2 + 10);
          ctx.font = '12px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillText('← → Move  |  SPACE Shoot', GW/2, GH/2 + 44);
        } else {
          ctx.font = 'bold 52px monospace'; ctx.fillStyle = '#f87171'; ctx.fillText('GAME OVER', GW/2, GH/2 - 40);
          ctx.font = '20px monospace'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(`Score: ${g.score}`, GW/2, GH/2 + 10);
          ctx.font = '13px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillText('SPACE or click PLAY AGAIN', GW/2, GH/2 + 48);
        }
        rafRef.current = requestAnimationFrame(loop); return;
      }

      if (g.shootCooldown > 0) g.shootCooldown--;
      if (g.invincible > 0) g.invincible--;
      if ((g.keys['ArrowLeft'] || g.keys['KeyA']) && g.player.x > 0) g.player.x -= PLAYER_SPEED;
      if ((g.keys['ArrowRight'] || g.keys['KeyD']) && g.player.x + g.player.w < GW) g.player.x += PLAYER_SPEED;
      if ((g.keys['Space'] || g.keys['KeyZ']) && g.shootCooldown === 0) {
        g.bullets.push({ x: g.player.x + PW/2 - BW/2, y: g.player.y, w: BW, h: BH, dy: -BULLET_SPEED });
        g.shootCooldown = 14;
      }
      g.bullets = g.bullets.filter(b => { b.y += b.dy; return b.y + b.h > 0; });
      g.enemyBullets = g.enemyBullets.filter(b => { b.y += b.dy; return b.y < GH; });
      let hitEdge = false;
      for (const e of g.enemies) { e.x += g.direction * e.speed; if (e.x + e.w > GW - 10 || e.x < 10) hitEdge = true; }
      if (hitEdge) { g.direction *= -1; for (const e of g.enemies) e.y += 18; }
      for (const e of g.enemies) { e.shootTimer--; if (e.shootTimer <= 0) { g.enemyBullets.push({ x: e.x + e.w/2 - BW/2, y: e.y + e.h, w: BW, h: BH, dy: ENEMY_BULLET_SPEED }); e.shootTimer = 90 + Math.random() * 120 - g.wave * 5; } }

      let newScore = g.score;
      g.bullets = g.bullets.filter(b => {
        let hit = false;
        g.enemies = g.enemies.filter(e => { if (collides(b, e)) { hit = true; e.hp--; if (e.hp <= 0) { spawnParticles(e.x + e.w/2, e.y + e.h/2, '#94a3b8', 14); newScore += 10 + g.wave * 5; return false; } spawnParticles(e.x + e.w/2, e.y + e.h/2, '#e2e8f0', 5); return true; } return true; });
        return !hit;
      });
      if (newScore !== g.score) { g.score = newScore; setScore(newScore); }
      if (g.invincible === 0) {
        for (let i = g.enemyBullets.length - 1; i >= 0; i--) {
          if (collides(g.enemyBullets[i], g.player)) {
            g.enemyBullets.splice(i, 1); spawnParticles(g.player.x + PW/2, g.player.y + PH/2, '#f87171', 20);
            g.lives--; setLives(g.lives); g.invincible = 120;
            if (g.lives <= 0) { g.gameState = 'dead'; setGameState('dead'); } break;
          }
        }
      }
      if (g.enemies.some(e => e.y + e.h > GH - 80)) { g.gameState = 'dead'; setGameState('dead'); }
      if (g.enemies.length === 0) { g.wave++; setWave(g.wave); g.enemies = makeEnemyGrid(g.wave); g.enemyBullets = []; }
      g.particles = g.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95; p.life--; return p.life > 0; });

      for (const p of g.particles) { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI*2); ctx.fill(); }
      ctx.globalAlpha = 1;
      drawPlayer(g.player.x, g.player.y, g.invincible);
      for (const e of g.enemies) drawEnemy(e);
      for (const b of g.bullets) drawBullet(b, '#cbd5e1');
      for (const b of g.enemyBullets) drawBullet(b, '#f87171');

      ctx.font = 'bold 13px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.textAlign = 'left'; ctx.fillText(`SCORE  ${g.score}`, 16, GH - 12);
      ctx.textAlign = 'center'; ctx.fillText(`WAVE ${g.wave}`, GW/2, GH - 12);
      ctx.textAlign = 'right'; ctx.fillStyle = '#f87171'; ctx.fillText('♥'.repeat(g.lives) + '♡'.repeat(Math.max(0, 3-g.lives)), GW - 16, GH - 12);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('keydown', e => onKey(e, true)); window.removeEventListener('keyup', e => onKey(e, false)); window.removeEventListener('keydown', onSpace); };
  }, [startGame]);

  return (
    <div className="min-h-screen bg-[#08080f] flex flex-col items-center justify-center p-4">
      {/* Game Navbar */}
      <div className="mb-8 flex gap-1 bg-white/5 p-1 border border-white/10 rounded-full">
        <Link 
          href="/game" 
          className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full bg-white text-black transition-all"
        >
          Space Shooter
        </Link>
        <Link 
          href="/pong" 
          className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full text-white/40 hover:text-white transition-all"
        >
          Pong VIP
        </Link>
      </div>
      <div className="w-full max-w-[900px] flex justify-between items-center mb-4">
        <Link href="/" className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">← Portfolio</Link>
        <div className="flex gap-6 text-[11px] font-mono text-white/30">
          <span>Score: <span className="text-white">{score}</span></span>
          <span>Wave: <span className="text-white">{wave}</span></span>
          <span className="text-red-400">{'♥'.repeat(lives)}{'♡'.repeat(Math.max(0, 3-lives))}</span>
        </div>
      </div>
      <div className="relative border border-white/10" style={{ boxShadow: '0 0 60px rgba(255,255,255,0.05)' }}>
        <canvas ref={canvasRef} width={GW} height={GH} className="block" />
      </div>
      <div className="w-full max-w-[900px] flex justify-between items-center mt-4">
        <p className="text-[11px] font-mono text-white/20">← → MOVE  |  SPACE SHOOT</p>
        <button onClick={startGame} className="px-6 py-2 text-[11px] uppercase tracking-widest font-bold border border-white/20 text-white/60 hover:bg-white hover:text-black transition-all duration-200">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </button>
        <Link href="/pong" className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">Pong VIP →</Link>
      </div>
    </div>
  );
}
