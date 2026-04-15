# PoliCompare – Comparador de Políticos do Brasil 🇧🇷

O **PoliCompare** é uma plataforma web moderna e transparente dedicada a fornecer dados reais e comparativos sobre os políticos brasileiros. Utilizando as APIs oficiais da Câmara dos Deputados e do Senado Federal, o sistema permite que cidadãos analisem o desempenho legislativo, assiduidade e propostas de seus representantes de forma imparcial e intuitiva.

## 🎯 Objetivo

Promover a cidadania e o voto consciente através da transparência pública, facilitando o acesso a informações que muitas vezes estão dispersas em diferentes portais governamentais.

## 🚀 Funcionalidades Principais

- **🔍 Busca Inteligente:** Encontre políticos por nome, partido ou estado com sugestões em tempo real.
- **⚖️ Comparação Lado a Lado:** Interface estilo "VS" para comparar dois políticos simultaneamente.
- **📊 PoliScore:** Sistema de pontuação exclusivo baseado em atividade legislativa e presença.
- **📜 Projetos de Lei:** Acesso às propostas e projetos mais recentes apresentados pelos parlamentares.
- **🗳️ Presença em Votações:** Gráficos detalhados de assiduidade, faltas e justificativas.
- **🧑‍💼 Perfil Detalhado:** Informações completas sobre carreira, escolaridade e contatos oficiais.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [Shadcn/UI](https://ui.shadcn.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Animações:** [Motion](https://motion.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🔗 Integração de Dados

Os dados são consumidos em tempo real das seguintes fontes oficiais:
- [API da Câmara dos Deputados](https://dadosabertos.camara.leg.br/api/v2/)
- [API do Senado Federal](https://legis.senado.leg.br/dadosabertos/docs/ui/index.html)

## 📦 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/policompare.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🛡️ Transparência e Ética

O PoliCompare é uma ferramenta de utilidade pública e não possui vínculos partidários. Todos os cálculos de score são baseados estritamente em dados quantitativos fornecidos pelos portais de transparência do Governo Federal.

---

Desenvolvido com foco em transparência e cidadania. 🇧🇷
