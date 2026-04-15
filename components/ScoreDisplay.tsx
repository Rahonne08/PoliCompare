'use client';

import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'lg';
}

export function ScoreDisplay({ score, size = 'lg' }: ScoreDisplayProps) {
  const radius = size === 'lg' ? 60 : 30;
  const stroke = size === 'lg' ? 10 : 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-blue-500';
    if (s >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getBgColor = (s: number) => {
    if (s >= 80) return 'stroke-emerald-500';
    if (s >= 60) return 'stroke-blue-500';
    if (s >= 40) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            className="text-muted/20"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={getBgColor(score)}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-4xl' : 'text-xl'} ${getColor(score)}`}>
            {score}
          </span>
          {size === 'lg' && <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">PoliScore</span>}
        </div>
      </div>

      {size === 'lg' && (
        <Popover>
          <PopoverTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Info className="h-3 w-3" />
            Como é calculado?
          </PopoverTrigger>
          <PopoverContent className="w-64 text-sm">
            <div className="space-y-2">
              <h4 className="font-bold">Cálculo do PoliScore</h4>
              <p className="text-muted-foreground text-xs">
                O score é uma métrica de transparência e atividade legislativa:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                <li><span className="font-semibold text-foreground">70% Assiduidade:</span> Presença em sessões e votações.</li>
                <li><span className="font-semibold text-foreground">30% Produção:</span> Projetos de lei e propostas apresentadas.</li>
              </ul>
              <p className="text-[10px] italic text-muted-foreground pt-1 border-t">
                Dados atualizados via API da Câmara e Senado.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
