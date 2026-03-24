# 🍎 Nutrição Activa - API Backend (ODS 3)

Este é o servidor da aplicação **Nutrição Activa**, desenvolvido para ajudar utilizadores a monitorizar a sua ingestão nutricional diária. O projeto está alinhado com o **Objetivo de Desenvolvimento Sustentável 3 (Saúde e Bem-Estar)** da ONU.

---

### 🚀 Stack Tecnológica
| Tecnologia | Função |
| :--- | :--- |
| **Node.js 24** | Ambiente de execução |
| **Express** | Framework Web (API REST) |
| **TypeScript** | Tipagem e segurança de código |
| **Supabase** | Base de dados PostgreSQL e Autenticação |

---

### 🛠️ Funcionalidades Implementadas (TP1)
- [x] Ligação funcional ao Supabase Cloud.
- [x] **GET** `/food-entries/today/:userId`: Lista as entradas do dia e calcula automaticamente os totais de Kcal, Proteínas, Carbohidratos, Gorduras e Fibras.
- [x] **POST** `/food-entries`: Permite registar um novo consumo de alimento na base de dados.
- [x] Estrutura de pastas organizada (`routes/`, `config/`).

---

### 📖 Endpoints Principais
- `GET /` - Health check da API.
- `POST /food-entries` - Cria um novo registo (necessita de JSON no body).
- `GET /food-entries/today/:userId` - Retorna o resumo nutricional do dia.

---

### ⚙️ Como correr localmente
1. Clona o repositório e entra na pasta `backend`.
2. Instala as dependências: `npm install`.
3. Cria um ficheiro `.env` baseado no `.env.example` com as tuas chaves do Supabase.
4. Compila e inicia: `npm run dev`.

---

### 📐 Decisão de Design
Escolhi utilizar o **Supabase Client (@supabase/supabase-js)** em vez de um driver PostgreSQL genérico (pg-pool). Esta decisão foi tomada para garantir uma integração nativa com o **Supabase Auth** no futuro e facilitar o deploy no Render.com, utilizando HTTPS (Porta 443) para evitar bloqueios de firewall comuns na Porta 5432.
