'use client';

import * as React from 'react';
import { PoliticianSearch } from '@/components/PoliticianSearch';
import { PoliticianCard } from '@/components/PoliticianCard';
import { getPopularPoliticians, Politician } from '@/lib/api';
import { motion } from 'motion/react';
import { Search, Scale, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [popular, setPopular] = React.useState<Politician[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getPopularPoliticians();
        setPopular(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider"
          >
            <ShieldCheck className="h-3 w-3" />
            Transparência Pública em Tempo Real
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-foreground"
          >
            Poli<span className="text-primary">Compare</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Compare políticos brasileiros lado a lado. Analise projetos, presença e desempenho legislativo com dados oficiais.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto pt-4"
          >
            <PoliticianSearch placeholder="Busque um político para começar..." className="shadow-2xl shadow-primary/10" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 pt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Comparação Imparcial</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Dados da Câmara e Senado</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Busca Inteligente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Políticos em Destaque</h2>
              <p className="text-muted-foreground">Explore os perfis mais buscados recentemente.</p>
            </div>
            <Link href="/politicians">
              <Button variant="outline" className="rounded-xl gap-2">
                Ver Todos os Políticos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-muted animate-pulse border-2" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.map((p) => (
                <PoliticianCard key={p.id} politician={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            PoliCompare utiliza dados abertos fornecidos pela 
            <a href="https://dadosabertos.camara.leg.br/" target="_blank" className="text-primary hover:underline ml-1">Câmara dos Deputados</a> e 
            <a href="https://legis.senado.leg.br/dadosabertos/docs/ui/index.html" target="_blank" className="text-primary hover:underline ml-1">Senado Federal</a>.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2026 PoliCompare. Promovendo a transparência e o voto consciente.
          </p>
        </div>
      </footer>
    </div>
  );
}
