# 🏋️‍♀️ Estação Fitness Web

Acesse: [https://espacofitness.vercel.app](https://espacofitness.vercel.app)

**Estação Fitness** é uma plataforma web para academias que permite o gerenciamento de fichas de treino e avaliação física dos alunos, oferecendo uma experiência simples e organizada tanto para administradores quanto para clientes.

Este projeto faz parte de um sistema completo voltado à organização e otimização da rotina de treinos em academias.

---

![Dashboard](https://github.com/user-attachments/assets/4d1a551a-6076-4b19-9fa7-efebfc70d9c3)
![Listagem de exercícios](https://github.com/user-attachments/assets/6a87ab89-7190-4fbf-8a0a-c96b42db5167)

---

## 🚀 Funcionalidades

### 🔐 Autenticação de Usuários
- Login com autenticação baseada em cookies.
- Redirecionamento automático com base no tipo de usuário (administrador ou cliente).

### 📊 Dashboard (Tela Inicial)
Após o login, o usuário é redirecionado para o dashboard, onde tem acesso a:
- **Fichas de Avaliação**: resultados de avaliações físicas e progresso dos alunos.
- **Fichas de Treino**: agrupadas por gênero (masculino e feminino).
- Botão de **Logout** no rodapé.

### 🏋️‍♂️ Fichas de Treino
- Separação entre treinos masculinos e femininos.
- Listagem de exercícios por grupo muscular.
- Cada exercício apresenta:
  - Nome (ex: *Peck Deck / Crucifixo Máquina*)
  - Séries e repetições (ex: 4 séries de 12 repetições)
  - Grupo muscular (ex: Peito)
  - Tempo de descanso (ex: 30 segundos)
  - Vídeo explicativo embutido (via React Player)

### 👥 Gerenciamento de Usuários (Administrador)
- Cadastro, edição e exclusão de usuários.
- Associação de fichas de treino a cada aluno.

### 📝 Gerenciamento de Fichas de Treino
- Criação e edição de fichas de treino com exercícios personalizados.
- Visualização com descrição detalhada e vídeo demonstrativo.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** — Framework React com suporte a SSR e SSG.
- **Tailwind CSS** — Estilização com classes utilitárias.
- **React Icons** — Ícones para interfaces modernas.
- **React Toastify** — Notificações toast elegantes.
- **Axios** — Requisições HTTP para integração com a API.
- **React Player** — Player de vídeo para demonstrações de exercícios.

---

## ▶️ Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/fitness-station-web.git
   cd fitness-station-web
   ```
2. **Instale as dependências:**
    ```bash
   npm install
    ```
3. **Inicie o servidor de desenvolvimento:**
    ```bash
   npm run dev
    ```
---

## 📂 Estrutura de Pastas

```plaintext
./src
├── app
│   ├── (admin)         # Páginas exclusivas para administradores
│   ├── (client)        # Páginas acessíveis por clientes
│   ├── (public)        # Telas públicas como login
│   └── layout.tsx      # Layout principal da aplicação
├── components          # Componentes reutilizáveis (botões, modais, inputs, etc.)
├── hooks               # Hooks customizados (ex.: autenticação, fichas)
├── libs                # Configurações externas (ex.: axios)
├── services            # Integrações com a API
├── styles              # Estilos globais
└── utils               # Funções utilitárias
