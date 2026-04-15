'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPoliticianDetails } from '@/lib/api';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Scale, 
  Mail, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Phone,
  History,
  Info,
  Filter,
  Search as SearchIcon
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PoliticianProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [p, setP] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [proposalFilter, setProposalFilter] = React.useState({ search: '', year: 'all', status: 'all' });

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getPoliticianDetails(id);
        setP(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Carregando perfil completo...</p>
      </div>
    );
  }

  if (!p) return null;

  const filteredProposals = p.proposals.filter((prop: any) => {
    const matchesSearch = prop.title.toLowerCase().includes(proposalFilter.search.toLowerCase()) || 
                         prop.description.toLowerCase().includes(proposalFilter.search.toLowerCase());
    const matchesYear = proposalFilter.year === 'all' || prop.year.toString() === proposalFilter.year;
    const matchesStatus = proposalFilter.status === 'all' || prop.status === proposalFilter.status;
    return matchesSearch && matchesYear && matchesStatus;
  });

  const years = Array.from(new Set(p.proposals.map((prop: any) => prop.year))).sort((a: any, b: any) => b - a);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-bold text-lg">Perfil do Político</span>
          </div>
          <Button asChild className="rounded-full">
            <Link href={`/compare?id1=${p.id}`}>
              <Scale className="mr-2 h-4 w-4" />
              Comparar
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden border-2">
              <div className="h-32 bg-primary/10" />
              <CardContent className="relative pt-0 -mt-16 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                  <AvatarImage src={p.photoUrl} alt={p.name} className="object-cover" />
                  <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div className="mt-4 space-y-1">
                  <h1 className="text-2xl font-black tracking-tight">{p.name}</h1>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="default" className="bg-primary">{p.party}</Badge>
                    <Badge variant="outline">{p.state}</Badge>
                  </div>
                </div>
                <div className="w-full pt-6 mt-6 border-t space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="capitalize">{p.type}</span>
                  </div>
                  {p.email && (
                    <div className="flex items-center gap-3 text-muted-foreground group">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${p.email}`} className="truncate hover:text-primary transition-colors">{p.email}</a>
                    </div>
                  )}
                  {p.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{p.phone}</span>
                    </div>
                  )}
                  {p.birthDate && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{p.birthDate}</span>
                    </div>
                  )}
                  {p.education && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-left">{p.education}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">PoliScore Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreDisplay score={p.score} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-emerald-600">{p.presence.present}%</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Assiduidade</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-blue-600">{p.proposals.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Projetos</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto">
                    <History className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-3xl font-black text-amber-600">{p.history.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Cargos</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="proposals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl mb-6">
                <TabsTrigger value="proposals" className="rounded-lg gap-2">
                  <FileText className="h-4 w-4" />
                  Projetos
                </TabsTrigger>
                <TabsTrigger value="presence" className="rounded-lg gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Presença
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg gap-2">
                  <History className="h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="proposals" className="space-y-6">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Atividade Legislativa
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input 
                            placeholder="Buscar projeto..." 
                            className="h-9 w-[180px] pl-8 text-xs"
                            value={proposalFilter.search}
                            onChange={(e) => setProposalFilter(prev => ({ ...prev, search: e.target.value }))}
                          />
                        </div>
                        <Select value={proposalFilter.year} onValueChange={(val) => setProposalFilter(prev => ({ ...prev, year: val || 'all' }))}>
                          <SelectTrigger className="h-9 w-[100px] text-xs">
                            <SelectValue placeholder="Ano" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos Anos</SelectItem>
                            {years.map((y: any) => (
                              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredProposals.map((prop: any) => (
                        <div key={prop.id} className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-primary group-hover:underline cursor-pointer flex items-center gap-2">
                              {prop.title}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <Badge variant="secondary">{prop.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{prop.description}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {prop.status}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Ano: {prop.year}
                            </span>
                          </div>
                        </div>
                      ))}
                      {filteredProposals.length === 0 && (
                        <div className="text-center py-20">
                          <Info className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                          <p className="text-muted-foreground">Nenhum projeto encontrado com estes filtros.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presence" className="space-y-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Detalhamento de Presença
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>Presença em Sessões</span>
                        <span>{p.presence.present}%</span>
                      </div>
                      <Progress value={p.presence.present} className="h-3" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Presenças</p>
                        <p className="text-2xl font-black text-emerald-700">{p.presence.present}</p>
                      </div>
                      <div className="p-4 rounded-xl border bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
                        <p className="text-xs font-bold text-rose-600 uppercase mb-1">Faltas</p>
                        <p className="text-2xl font-black text-rose-700">{p.presence.absent}</p>
                      </div>
                      <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Justificadas</p>
                        <p className="text-2xl font-black text-blue-700">{p.presence.justified}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Histórico de Cargos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                      {p.history.map((item: any, idx: number) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-muted/20">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-foreground">{item.office}</div>
                              <time className="font-mono text-xs text-primary">{item.startYear} {item.endYear ? `- ${item.endYear}` : '(Atual)'}</time>
                            </div>
                            <div className="text-muted-foreground text-sm flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.state}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
