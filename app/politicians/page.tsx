'use client';

import * as React from 'react';
import { Politician, getAllDeputies, getAllSenators } from '@/lib/api';
import { PoliticianCard } from '@/components/PoliticianCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Users, UserCheck, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function PoliticiansPage() {
  const [deputies, setDeputies] = React.useState<Politician[]>([]);
  const [senators, setSenators] = React.useState<Politician[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [d, s] = await Promise.all([getAllDeputies(), getAllSenators()]);
        setDeputies(d);
        setSenators(s);
      } catch (error) {
        console.error('Error fetching all politicians:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredDeputies = deputies.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.party.toLowerCase().includes(search.toLowerCase()) || 
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSenators = senators.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.party.toLowerCase().includes(search.toLowerCase()) || 
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary/5 border-b py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar para o Início
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Todos os Políticos</h1>
              <p className="text-muted-foreground">Explore a lista completa de representantes ativos no Congresso Nacional.</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar por nome, partido ou estado..." 
                className="pl-10 h-12 rounded-xl border-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Carregando parlamentares...</p>
          </div>
        ) : (
          <Tabs defaultValue="deputies" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="deputies" className="rounded-lg gap-2">
                  <Users className="h-4 w-4" />
                  Deputados ({filteredDeputies.length})
                </TabsTrigger>
                <TabsTrigger value="senators" className="rounded-lg gap-2">
                  <UserCheck className="h-4 w-4" />
                  Senadores ({filteredSenators.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="deputies">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDeputies.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  >
                    <PoliticianCard politician={p} />
                  </motion.div>
                ))}
              </div>
              {filteredDeputies.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhum deputado encontrado com os critérios de busca.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="senators">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSenators.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  >
                    <PoliticianCard politician={p} />
                  </motion.div>
                ))}
              </div>
              {filteredSenators.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhum senador encontrado com os critérios de busca.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
