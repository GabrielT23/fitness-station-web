# Fitness Station Web

Site para gerenciamento de fichas de treino e usuários em uma academia.

Este projeto faz parte de um sistema que tem como objetivo auxiliar academias no gerenciamento de fichas de treino, usuários e exercícios. Ele permite que administradores e clientes interajam com o sistema de forma eficiente, promovendo uma experiência organizada e intuitiva.

![image](https://github.com/user-attachments/assets/fitness-station-preview.png)

---

### **Tecnologias Utilizadas**

* **Next.js:** Um framework React para desenvolvimento de aplicações web com renderização do lado do servidor e geração de sites estáticos.
* **Tailwind CSS:** Um framework CSS utilitário que permite criar designs customizados rapidamente usando classes pré-definidas.
* **React Icons:** Biblioteca de ícones para React, utilizada para melhorar a interface do usuário.
* **React Toastify:** Biblioteca para exibição de notificações toast.
* **Axios:** Cliente HTTP para comunicação com a API.
* **React Player:** Biblioteca para exibição de vídeos de exercícios.

---

### **Funcionalidades**

* **Gerenciamento de Fichas de Treino:**
  - Criação, edição e exclusão de fichas de treino.
  - Vinculação de fichas de treino a usuários.
  - Exibição de exercícios com vídeos explicativos.

* **Gerenciamento de Usuários:**
  - Cadastro, edição e exclusão de usuários.
  - Diferenciação entre administradores e clientes.

* **Autenticação de Usuários:**
  - Login com autenticação baseada em cookies.
  - Redirecionamento de usuários com base no tipo (admin ou cliente).

* **Dashboard:**
  - Visualização de fichas de treino e avaliações.
  - Botão de logout para encerrar a sessão.

---

### **Começando**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/fitness-station-web.git
   cd fitness-station-web
    ```bash
    npm install

---
### **Estrutura de pastas**

./src
├── app
│   ├── (admin)         # Páginas e funcionalidades do administrador
│   ├── (client)        # Páginas e funcionalidades do cliente
│   ├── (public)        # Páginas públicas (ex.: login)
│   └── [layout.tsx](http://_vscodecontentref_/0)      # Layout principal da aplicação
├── components          # Componentes reutilizáveis (botões, inputs, modais, etc.)
├── hooks               # Hooks personalizados (ex.: autenticação, usuários, fichas)
├── libs                # Configurações de bibliotecas externas (ex.: Axios)
├── services            # Serviços para comunicação com a API
├── styles              # Estilos globais (ex.: Tailwind CSS)
└── utils               # Funções utilitárias