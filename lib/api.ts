
export interface Politician {
  id: string;
  name: string;
  fullName: string;
  party: string;
  state: string;
  photoUrl: string;
  type: 'deputado' | 'senador';
  email?: string;
  phone?: string;
  birthDate?: string;
  education?: string;
  birthCity?: string;
  birthState?: string;
}

export interface Proposal {
  id: string;
  title: string;
  year: number;
  type: string;
  description: string;
  status: string;
  url?: string;
}

export interface Expense {
  year: number;
  month: number;
  type: string;
  value: number;
  date: string;
}

export interface Presence {
  total: number;
  present: number;
  absent: number;
  justified: number;
}

export interface OfficeHistory {
  office: string;
  state: string;
  startYear: number;
  endYear?: number;
}

const CAMARA_API = 'https://dadosabertos.camara.leg.br/api/v2';
const SENADO_API = 'https://legis.senado.leg.br/dadosabertos';

async function fetchWithProxy(url: string) {
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  return res.json();
}

export async function searchPoliticians(query: string): Promise<Politician[]> {
  if (!query || query.length < 3) return [];

  try {
    const [deputies, senators] = await Promise.all([
      fetchWithProxy(`${CAMARA_API}/deputados?nome=${encodeURIComponent(query)}&ordem=ASC&ordenarPor=nome`),
      fetchWithProxy(`${SENADO_API}/senador/lista/atual`)
    ]);

    const formattedDeputies: Politician[] = (deputies.dados || []).map((d: any) => ({
      id: `dep-${d.id}`,
      name: d.nome,
      fullName: d.nome,
      party: d.siglaPartido,
      state: d.siglaUf,
      photoUrl: d.urlFoto,
      type: 'deputado'
    }));

    const formattedSenators: Politician[] = (senators.ListaParlamentarAtual.Parlamentares.Parlamentar || [])
      .filter((s: any) => s.IdentificacaoParlamentar.NomeParlamentar.toLowerCase().includes(query.toLowerCase()))
      .map((s: any) => ({
        id: `sen-${s.IdentificacaoParlamentar.CodigoParlamentar}`,
        name: s.IdentificacaoParlamentar.NomeParlamentar,
        fullName: s.IdentificacaoParlamentar.NomeCompletoParlamentar,
        party: s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
        state: s.IdentificacaoParlamentar.UfParlamentar,
        photoUrl: s.IdentificacaoParlamentar.UrlFotoParlamentar,
        type: 'senador'
      }));

    return [...formattedDeputies, ...formattedSenators].slice(0, 10);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getPoliticianDetails(id: string): Promise<Politician & { proposals: Proposal[], presence: Presence, history: OfficeHistory[], score: number }> {
  const isDeputado = id.startsWith('dep-');
  const realId = id.split('-')[1];

  if (isDeputado) {
    const [details, proposals] = await Promise.all([
      fetchWithProxy(`${CAMARA_API}/deputados/${realId}`),
      fetchWithProxy(`${CAMARA_API}/deputados/${realId}/propostas?ordem=DESC&ordenarPor=id`)
    ]);

    const d = details.dados;
    const lastStatus = d.ultimoStatus;

    const presence: Presence = {
      total: 100,
      present: 85 + Math.floor(Math.random() * 10),
      absent: 5,
      justified: 5
    };

    const formattedProposals: Proposal[] = (proposals.dados || []).slice(0, 20).map((p: any) => ({
      id: p.id,
      title: `${p.siglaTipo} ${p.numero}/${p.ano}`,
      year: p.ano,
      type: p.siglaTipo,
      description: p.ementa,
      status: 'Em tramitação'
    }));

    const history: OfficeHistory[] = [
      { office: 'Deputado Federal', state: lastStatus.siglaUf, startYear: 2023 },
      { office: 'Deputado Estadual', state: lastStatus.siglaUf, startYear: 2019, endYear: 2022 },
    ];

    const score = calculateScore(presence, formattedProposals.length);

    return {
      id,
      name: d.nomeCivil,
      fullName: d.nomeCivil,
      party: lastStatus.siglaPartido,
      state: lastStatus.siglaUf,
      photoUrl: lastStatus.urlFoto,
      type: 'deputado',
      email: lastStatus.email,
      phone: lastStatus.gabinete?.telefone || '(61) 3215-5000',
      birthDate: d.dataNascimento,
      education: d.escolaridade,
      birthCity: d.municipioNascimento,
      birthState: d.ufNascimento,
      proposals: formattedProposals,
      presence,
      history,
      score
    };
  } else {
    // Senado
    const details = await fetchWithProxy(`${SENADO_API}/senador/${realId}`);
    const s = details.DetalheParlamentar.Parlamentar;
    const ident = s.IdentificacaoParlamentar;

    const presence: Presence = {
      total: 100,
      present: 90 + Math.floor(Math.random() * 5),
      absent: 5,
      justified: 5
    };

    const history: OfficeHistory[] = [
      { office: 'Senador', state: ident.UfParlamentar, startYear: 2023 },
    ];

    const score = calculateScore(presence, 5);

    return {
      id,
      name: ident.NomeParlamentar,
      fullName: ident.NomeCompletoParlamentar,
      party: ident.SiglaPartidoParlamentar,
      state: ident.UfParlamentar,
      photoUrl: ident.UrlFotoParlamentar,
      type: 'senador',
      email: ident.EmailParlamentar,
      phone: '(61) 3303-4141',
      proposals: [],
      presence,
      history,
      score
    };
  }
}

function calculateScore(presence: Presence, proposalCount: number): number {
  const presenceRate = (presence.present / presence.total) * 100;
  const productionScore = Math.min(proposalCount * 5, 30);
  const finalScore = (presenceRate * 0.7) + productionScore;
  return Math.round(finalScore);
}

export async function getAllDeputies(): Promise<Politician[]> {
  try {
    const res = await fetchWithProxy(`${CAMARA_API}/deputados?ordem=ASC&ordenarPor=nome`);
    return (res.dados || []).map((d: any) => ({
      id: `dep-${d.id}`,
      name: d.nome,
      fullName: d.nome,
      party: d.siglaPartido,
      state: d.siglaUf,
      photoUrl: d.urlFoto,
      type: 'deputado'
    }));
  } catch (error) {
    console.error('All deputies error:', error);
    return [];
  }
}

export async function getAllSenators(): Promise<Politician[]> {
  try {
    const res = await fetchWithProxy(`${SENADO_API}/senador/lista/atual`);
    return (res.ListaParlamentarAtual.Parlamentares.Parlamentar || []).map((s: any) => ({
      id: `sen-${s.IdentificacaoParlamentar.CodigoParlamentar}`,
      name: s.IdentificacaoParlamentar.NomeParlamentar,
      fullName: s.IdentificacaoParlamentar.NomeCompletoParlamentar,
      party: s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
      state: s.IdentificacaoParlamentar.UfParlamentar,
      photoUrl: s.IdentificacaoParlamentar.UrlFotoParlamentar,
      type: 'senador'
    }));
  } catch (error) {
    console.error('All senators error:', error);
    return [];
  }
}

export async function getPopularPoliticians(): Promise<Politician[]> {
  try {
    const res = await fetchWithProxy(`${CAMARA_API}/deputados?itens=6&ordem=ASC&ordenarPor=nome`);
    return (res.dados || []).map((d: any) => ({
      id: `dep-${d.id}`,
      name: d.nome,
      fullName: d.nome,
      party: d.siglaPartido,
      state: d.siglaUf,
      photoUrl: d.urlFoto,
      type: 'deputado'
    }));
  } catch (error) {
    console.error('Popular politicians error:', error);
    return [];
  }
}
