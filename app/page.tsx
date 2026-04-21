'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  RotateCcw, 
  Percent, 
  Equal,
  ChevronLeft
} from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((parseFloat(display) * -1).toString());
  }, [display]);

  const handlePercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  }, [display]);

  const performCalculation = useCallback((nextValue: number) => {
    if (prevValue === null || operator === null) return nextValue;

    switch (operator) {
      case '+': return prevValue + nextValue;
      case '-': return prevValue - nextValue;
      case '*': return prevValue * nextValue;
      case '/': return prevValue / nextValue;
      default: return nextValue;
    }
  }, [prevValue, operator]);

  const handleOperator = useCallback((nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = performCalculation(inputValue);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, operator, prevValue, performCalculation]);

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);

    if (prevValue === null || operator === null) return;

    const result = performCalculation(inputValue);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    
    // Add to history
    setHistory(prev => [`${prevValue} ${operator} ${inputValue} = ${result}`, ...prev].slice(0, 5));
  }, [display, operator, prevValue, performCalculation]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleDigit(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === 'Enter' || e.key === '=') handleEquals();
      if (e.key === 'Backspace') setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
      if (e.key === 'Escape') clearAll();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleEquals, handleOperator, clearAll]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="relative group">
        {/* Decorative elements to feel like hardware */}
        <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-[#8E9299] opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-[#8E9299] opacity-20 group-hover:opacity-40 transition-opacity" />
        
        {/* Main Unit */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[320px] bg-[#151619] rounded-[32px] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-[#2A2C31]"
        >
          {/* Brand/Model Info */}
          <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#8E9299] uppercase">SwiftCalc v.1</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3CCB39] shadow-[0_0_8px_rgba(60,203,57,0.4)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8E9299] opacity-30" />
            </div>
          </div>

          {/* Display Area */}
          <div className="bg-[#0D0E10] rounded-2xl p-5 mb-8 border border-[#2A2C31] shadow-inner relative overflow-hidden">
            {/* LCD Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:4px_4px]" />
            
            <div className="text-right h-6 mb-1">
              <AnimatePresence mode="wait">
                {operator && (
                  <motion.span 
                    key={operator}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-mono text-[#8E9299] uppercase tracking-wider"
                  >
                    {prevValue} {operator}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-right overflow-hidden">
              <motion.span 
                key={display}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-mono text-white tracking-tighter"
              >
                {display}
              </motion.span>
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Top Row */}
            <CalcButton onClick={clearAll} className="text-[#FF4444]" icon={<RotateCcw size={18} />} label="AC" />
            <CalcButton onClick={toggleSign} icon={<><Plus size={14} className="inline"/><Minus size={14} className="inline ml-[-4px]"/></>} label="+/-" />
            <CalcButton onClick={handlePercent} icon={<Percent size={18} />} label="%" />
            <CalcButton onClick={() => handleOperator('/')} active={operator === '/'} className="bg-[#2A2C31] text-white" icon={<Divide size={20} />} />

            {/* Middle Rows */}
            <CalcButton onClick={() => handleDigit('7')} label="7" />
            <CalcButton onClick={() => handleDigit('8')} label="8" />
            <CalcButton onClick={() => handleDigit('9')} label="9" />
            <CalcButton onClick={() => handleOperator('*')} active={operator === '*'} className="bg-[#2A2C31] text-white" icon={<X size={20} />} />

            <CalcButton onClick={() => handleDigit('4')} label="4" />
            <CalcButton onClick={() => handleDigit('5')} label="5" />
            <CalcButton onClick={() => handleDigit('6')} label="6" />
            <CalcButton onClick={() => handleOperator('-')} active={operator === '-'} className="bg-[#2A2C31] text-white" icon={<Minus size={20} />} />

            <CalcButton onClick={() => handleDigit('1')} label="1" />
            <CalcButton onClick={() => handleDigit('2')} label="2" />
            <CalcButton onClick={() => handleDigit('3')} label="3" />
            <CalcButton onClick={() => handleOperator('+')} active={operator === '+'} className="bg-[#2A2C31] text-white" icon={<Plus size={20} />} />

            {/* Bottom Row */}
            <CalcButton onClick={() => handleDigit('0')} label="0" className="col-span-2 text-left px-7" />
            <CalcButton onClick={handleDecimal} label="." />
            <CalcButton onClick={handleEquals} className="bg-[#F27D26] text-white hover:bg-[#ff8c3a]" icon={<Equal size={22} />} />
          </div>

          {/* History Peek */}
          <div className="mt-8 pt-6 border-t border-[#2A2C31]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8E9299]">Recent Log</span>
            </div>
            <div className="space-y-1.5 h-16 overflow-hidden relative">
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#151619] to-transparent pointer-events-none" />
              {history.length === 0 ? (
                <span className="text-[10px] font-mono text-[#8E9299] opacity-30 italic">No activity registered...</span>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="text-[10px] font-mono text-[#8E9299] flex justify-between">
                    <span>{'>'}</span>
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function CalcButton({ 
  label, 
  onClick, 
  className = '', 
  icon, 
  active = false 
}: { 
  label?: string; 
  onClick: () => void; 
  className?: string;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`
        h-14 rounded-xl flex items-center justify-center font-mono text-lg transition-all
        ${active ? 'ring-2 ring-[#F27D26] ring-inset' : ''}
        ${!className.includes('bg-') ? 'bg-[#1E2024] text-[#8E9299] hover:bg-[#25282D] hover:text-white' : ''}
        ${className}
      `}
    >
      {icon ? icon : label}
    </motion.button>
  );
}
