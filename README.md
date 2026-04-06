🍎 Nutrição Activa - Fullstack App (ODS 3)

Esta é uma aplicação completa de monitorização nutricional, composta por uma API Backend robusta e um Frontend Single Page Application (SPA). O projeto está alinhado com o Objectivo de Desenvolvimento Sustentável 3 (Saúde e Bem-Estar) da ONU, facilitando o controlo de metas alimentares diárias.

🌐 Links do Projeto

    Live Demo (Frontend): https://projecto-final-app-nutricao.vercel.app/

    API (Backend): https://projectofinal-appnutricao.onrender.com/

🚀 Stack Tecnológica
Backend
Tecnologia	        Função
Node.js	            Ambiente de execução servidor
Express	            Framework Web (API REST)
TypeScript	        Tipagem e segurança de código
Supabase	        Base de dados PostgreSQL e Autenticação

Frontend
Tecnologia	        Função
Angular 18+	        Framework SPA (Componentes Standalone)
Vercel	            Hosting e Deployment Contínuo
CSS3	            Layout Responsivo (Mobile-First)
Router	            Gestão de navegação e Proteção de Rotas (AuthGuard)


🛠️ Funcionalidades Implementadas
Core & UX

    [x] Autenticação: Sistema de Login e Registo integrado com Supabase Auth.
    [x] Dashboard: Resumo visual das metas diárias (Calorias, Proteínas, Hidratos, Gorduras e Fibras).
    [x] Gestão de Metas: Personalização de objetivos nutricionais por utilizador.
    [x] Histórico Dinâmico: Visualização cronológica de todos os registos anteriores.
    [x] Responsividade: Interface adaptada para Desktop e Dispositivos Móveis.

API & Integração

    [x] GET /food-entries/today/:userId: Cálculo automático de totais diários.
    [x] POST /food-entries: Registo de novos consumos em tempo real.
    [x] Segurança: Implementação de AuthGuard no Angular para proteger rotas privadas.

🔄 Deployment & CI/CD

    Frontend: Alojado na Vercel com integração direta ao GitHub (Deploy automático ao fazer Push).
    Backend: Configurado para ambientes Node.js com variáveis de ambiente protegidas.
    CI: GitHub Actions configurado para validação de código (Linting).

⚙️ Como correr localmente
1. Backend

    Entra na pasta backend.
    npm install
    Cria um .env com SUPABASE_URL e SUPABASE_KEY.
    npm run dev

2. Frontend

    Entra na pasta frontend.
    npm install
    ng serve
    Abre http://localhost:4200

📐 Decisões de Arquitetura

    SPA (Single Page Application): Optou-se pelo Angular para garantir uma navegação fluida sem recarregamentos de página, essencial para uma boa experiência de utilizador em apps de registo diário.
    Modularização: O frontend utiliza Standalone Components, reduzindo o boilerplate e melhorando o tempo de carregamento (Lazy Loading).
    Vercel Rewrites: Configuração de vercel.json para permitir que o Router do Angular gira as rotas diretamente, evitando erros 404 em "Refresh".