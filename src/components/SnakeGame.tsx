import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: Direction.RIGHT,
    score: 0,
    isGameOver: false,
    isPaused: true,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const snakeRef = useRef(gameState.snake);
  const directionRef = useRef(gameState.direction);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setGameState(prev => ({
      ...prev,
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: Direction.RIGHT,
      score: 0,
      isGameOver: false,
      isPaused: false,
    }));
    snakeRef.current = initialSnake;
    directionRef.current = Direction.RIGHT;
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const head = { ...snakeRef.current[0] };
    const dir = directionRef.current;

    switch (dir) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    // Body collision
    if (snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
      handleGameOver();
      return;
    }

    const newSnake = [head, ...snakeRef.current];
    let newScore = gameState.score;
    let newFood = gameState.food;

    // Food collision
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      newScore += 10;
      newFood = generateFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setGameState(prev => ({
      ...prev,
      snake: newSnake,
      food: newFood,
      score: newScore,
    }));
  }, [gameState.food, gameState.isGameOver, gameState.isPaused, gameState.score, generateFood]);

  const handleGameOver = () => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      localStorage.setItem('snakeHighScore', newHighScore.toString());
      return { ...prev, isGameOver: true, highScore: newHighScore };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP; break;
        case 'ArrowDown': if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN; break;
        case 'ArrowLeft': if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT; break;
        case 'ArrowRight': if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT; break;
        case ' ': togglePause(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (gameState.score / 10) * SPEED_INCREMENT);
    
    if (timestamp - lastUpdateRef.current >= speed) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.score, moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div id="game-container" className="relative flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="absolute top-4 left-0 right-0 flex justify-between px-8 text-xs font-mono tracking-widest text-cyan-400 opacity-60">
        <div className="flex items-center gap-2">
          <Trophy size={14} />
          <span>BEST: {gameState.highScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SCORE: {gameState.score}</span>
        </div>
      </div>

      <div 
        className="grid bg-black/60 border-2 border-cyan-500/30 overflow-hidden rounded-xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1.25rem)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1.25rem)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
          const isSnakeBody = gameState.snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = gameState.food.x === x && gameState.food.y === y;

          return (
            <div
              key={i}
              className={`w-5 h-5 transition-all duration-200 relative ${
                isSnakeHead 
                  ? 'bg-[#39ff14] shadow-[0_0_20px_#39ff14] z-10 scale-110 rounded-sm' 
                  : isSnakeBody 
                  ? 'bg-[#2ea410] shadow-[0_0_10px_#2ea410]/50 rounded-sm' 
                  : isFood 
                  ? 'bg-fuchsia-500 shadow-[0_0_15px_#ff00e5] animate-pulse rounded-full scale-75' 
                  : 'border-[0.2px] border-white/5'
              }`}
            >
              {isSnakeHead && (
                <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
                   <div className="w-1 h-1 bg-black rounded-full" />
                   <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={togglePause}
          disabled={gameState.isGameOver}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white"
        >
          {gameState.isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={resetGame}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-white"
        >
          <RefreshCw size={24} className={gameState.isGameOver ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-3xl"
          >
            <h2 className="text-4xl font-bold text-rose-500 tracking-tighter mb-2">SYSTEM FAILURE</h2>
            <p className="text-white/60 mb-6 font-mono">CORE BREACH DETECTED</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-transform active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              REBOOT SYSTEM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
