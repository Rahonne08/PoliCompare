'use client';

import * as React from 'react';
import { Politician, getPoliticianDetails } from '@/lib/api';
import { PoliticianCard } from './PoliticianCard';
import { ScoreDisplay } from './ScoreDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ComparisonViewProps {
  id1: string;
  id2: string;
}

export function ComparisonView({ id1, id2 }: ComparisonViewProps) {
  const [p1, setP1] = React.useState<any>(null);
  const [p2, setP2] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [data1, data2] = await Promise.all([
          getPoliticianDetails(id1),
          getPoliticianDetails(id2)
        ]);
        setP1(data1);
        setP2(data2);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados dos políticos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id1, id2]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Analisando dados públicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-bold">Ops! Algo deu errado</h3>
        <p className="text-muted-foreground max-w-md">{error}</p>
      </div>
    );
  }

  const presenceData = [
    { 
      name: p1.name, 
      total: p1.presence.total,
      present: p1.presence.present,
      absent: p1.presence.absent,
      justified: p1.presence.justified,
    },
    { 
      name: p2.name, 
      total: p2.presence.total,
      present: p2.presence.present,
      absent: p2.presence.absent,
      justified: p2.presence.justified,
    },
  ];

  return (
    <div className="space-y-8">
      {/* VS Header */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
        <PoliticianCard politician={p1} />
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-black italic text-xl shadow-lg ring-4 ring-primary/20">
            VS
          </div>
        </div>
        <PoliticianCard politician={p2} />
      </div>

      {/* Main Comparison Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-sm">Geral</TabsTrigger>
            <TabsTrigger value="proposals" className="rounded-lg data-[state=active]:shadow-sm">Projetos</TabsTrigger>
            <TabsTrigger value="presence" className="rounded-lg data-[state=active]:shadow-sm">Presença</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Score de Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-around gap-8 py-6">
                <div className="text-center space-y-2">
                  <ScoreDisplay score={p1.score} />
                  <p className="font-bold text-sm truncate max-w-[120px]">{p1.name}</p>
                </div>
                <div className="h-20 w-px bg-border hidden md:block" />
                <div className="text-center space-y-2">
                  <ScoreDisplay score={p2.score} />
                  <p className="font-bold text-sm truncate max-w-[120px]">{p2.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Estado</p>
                    <p className="font-semibold">{p1.state} vs {p2.state}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Partido</p>
                    <p className="font-semibold">{p1.party} vs {p2.party}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Tipo</p>
                    <p className="font-semibold capitalize">{p1.type.slice(0, 3)} vs {p2.type.slice(0, 3)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Escolaridade</span>
                    <span className="font-medium text-right max-w-[150px] truncate">{p1.education || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Data Nasc.</span>
                    <span className="font-medium">{p1.birthDate || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[p1, p2].map((p, idx) => (
              <Card key={p.id} className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Projetos de {p.name}
                    </div>
                    <Badge variant="secondary">{p.proposals.length} Total</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {p.proposals.map((prop: any) => (
                        <div key={prop.id} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-primary">{prop.title}</span>
                            <Badge variant="outline" className="text-[9px] h-4">{prop.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{prop.description}</p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {prop.status}
                          </div>
                        </div>
                      ))}
                      {p.proposals.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                          <FileText className="h-8 w-8 opacity-20 mb-2" />
                          <p className="text-sm">Nenhum projeto recente</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="presence">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Comparativo Detalhado de Presença</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={presenceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Total de Sessões" />
                    <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Presenças" />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Faltas" />
                    <Bar dataKey="justified" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} name="Justificadas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[p1, p2].map((p) => (
                <Card key={p.id} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Taxa de Assiduidade</p>
                      </div>
                      <span className="text-2xl font-black text-primary">{p.presence.present}%</span>
                    </div>
                    <Progress value={p.presence.present} className="h-3" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 mb-1" />
                        <span className="text-[10px] text-muted-foreground">Presenças</span>
                        <span className="text-xs font-bold text-emerald-600">{p.presence.present}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-rose-50 dark:bg-rose-950/20">
                        <XCircle className="h-3 w-3 text-rose-500 mb-1" />
                        <span className="text-[10px] text-muted-foreground">Faltas</span>
                        <span className="text-xs font-bold text-rose-600">{p.presence.absent}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/20">
                        <Clock className="h-3 w-3 text-blue-500 mb-1" />
                        <span className="text-[10px] text-muted-foreground">Justificadas</span>
                        <span className="text-xs font-bold text-blue-600">{p.presence.justified}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
