'use client';

import { Politician } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Building2, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface PoliticianCardProps {
  politician: Politician & { score?: number };
  className?: string;
}

export function PoliticianCard({ politician, className }: PoliticianCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`overflow-hidden border-2 hover:border-primary/30 transition-all group ${className}`}>
        <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        <CardHeader className="relative pt-0 -mt-12 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={politician.photoUrl} alt={politician.name} className="object-cover" />
            <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
          </Avatar>
          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{politician.name}</h3>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="default" className="bg-primary hover:bg-primary/90">
                {politician.party}
              </Badge>
              <Badge variant="outline" className="border-primary/20">
                {politician.state}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
            <Building2 className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-[10px] uppercase text-muted-foreground font-semibold">Cargo</span>
            <span className="text-sm font-medium capitalize">{politician.type}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
            <Award className="h-4 w-4 text-primary mb-1" />
            <span className="text-[10px] uppercase text-muted-foreground font-semibold">Score</span>
            <span className="text-sm font-bold text-primary">{politician.score || '--'}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
