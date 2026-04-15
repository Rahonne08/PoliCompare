'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ComparisonView } from '@/components/ComparisonView';
import { PoliticianSearch } from '@/components/PoliticianSearch';
import { Politician } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, Plus } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  const handleSelect1 = (p: Politician) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id1', p.id);
    router.push(`/compare?${params.toString()}`);
  };

  const handleSelect2 = (p: Politician) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id2', p.id);
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Político 1</label>
          <PoliticianSearch onSelect={handleSelect1} placeholder={id1 ? "Trocar político..." : "Selecionar primeiro político..."} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Político 2</label>
          <PoliticianSearch onSelect={handleSelect2} placeholder={id2 ? "Trocar político..." : "Selecionar segundo político..."} />
        </div>
      </div>

      {/* Comparison Content */}
      {id1 && id2 ? (
        <ComparisonView id1={id1} id2={id2} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 rounded-3xl border-2 border-dashed">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="h-10 w-10 text-primary opacity-50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Inicie uma comparação</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Selecione dois políticos nos campos acima para comparar seus dados, projetos e desempenho.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg hidden sm:inline-block">PoliCompare</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline-block">Comparando políticos</span>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Carregando...</div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
