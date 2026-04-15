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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function PoliticianProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [p, setP] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

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
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{p.email}</span>
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
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-3xl font-black text-amber-600">--</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Mandatos</p>
                </CardContent>
              </Card>
            </div>

            {/* Proposals Section */}
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Projetos de Lei Recentes
                </CardTitle>
                <Button variant="outline" size="sm">Ver todos</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {p.proposals.map((prop: any) => (
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Presence Detail */}
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
          </div>
        </div>
      </main>
    </div>
  );
}
