export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-400 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
          <p className="text-pink-100 text-sm">Espaço Fitness — Última atualização: novembro de 2024</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* 1 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            1. Quem somos
          </h2>
          <p className="text-gray-600 leading-relaxed">
            O <strong>Espaço Fitness</strong> é uma academia que disponibiliza um aplicativo móvel e um
            painel web para gerenciamento de alunos, fichas de treino, avaliações físicas e controle
            financeiro. Este documento descreve como tratamos as informações dos usuários da nossa
            plataforma digital.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            2. Dados coletados
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            A plataforma coleta apenas os dados estritamente necessários para o funcionamento do
            sistema:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
            <li>Nome e nome de usuário (definidos pelo administrador)</li>
            <li>CPF e e-mail (opcionais, cadastrados pelo administrador)</li>
            <li>Dados de avaliação física (inseridos pelo administrador)</li>
            <li>Registros de fichas de treino e planos contratados</li>
            <li>Histórico de faturas e pagamentos</li>
          </ul>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-sm font-medium">
              O aplicativo <strong>não coleta</strong> dados de localização, não acessa câmera,
              microfone ou dados biométricos, e não realiza rastreamento de comportamento fora
              da plataforma.
            </p>
          </div>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            3. Criação de contas e dados obrigatórios
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            As contas de acesso são criadas <strong>exclusivamente pelo administrador da academia</strong>.
            O aluno não realiza auto-cadastro e não precisa informar nenhum dado pessoal de forma
            obrigatória para acessar a plataforma.
          </p>
          <p className="text-gray-600 leading-relaxed">
            O login é feito com um nome de usuário e senha definidos pelo administrador. Dados
            como CPF e e-mail são campos opcionais e, quando fornecidos, são inseridos pelo
            próprio administrador para fins administrativos internos.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            4. Finalidade do uso dos dados
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">Os dados são utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
            <li>Autenticação e controle de acesso à plataforma</li>
            <li>Gerenciamento de fichas de treino e avaliações físicas</li>
            <li>Controle de planos, mensalidades e faturas</li>
            <li>Comunicação interna entre administrador e aluno</li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            5. Compartilhamento de dados
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Não compartilhamos dados pessoais dos usuários com terceiros para fins comerciais ou
            publicitários. As informações ficam restritas à operação interna da academia. Dados
            poderão ser divulgados apenas se exigido por lei ou por determinação de autoridade
            competente.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            6. Segurança dos dados
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Adotamos medidas técnicas para proteger as informações dos usuários:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Senhas criptografadas', desc: 'Armazenadas com bcrypt, nunca em texto puro' },
              { title: 'Autenticação JWT', desc: 'Tokens de acesso com expiração automática' },
              { title: 'Comunicação segura', desc: 'Tráfego protegido por HTTPS/TLS' },
              { title: 'Armazenamento seguro', desc: 'Dados locais no app via expo-secure-store' },
              { title: 'Controle de acesso', desc: 'Permissões separadas por perfil (admin/aluno)' },
              { title: 'Infraestrutura em nuvem', desc: 'Hospedagem em ambiente controlado e isolado' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            7. Retenção e exclusão de dados
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Os dados são mantidos enquanto o vínculo do aluno com a academia estiver ativo. Após
            o encerramento do contrato, os dados poderão ser retidos pelo prazo necessário para
            cumprimento de obrigações legais. O administrador pode excluir a conta de um aluno
            a qualquer momento, removendo seus dados do sistema.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            8. Seus direitos (LGPD — Lei 13.709/2018)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Em conformidade com a Lei Geral de Proteção de Dados, você tem direito a:
          </p>
          <div className="space-y-2">
            {[
              ['Acesso', 'Saber quais dados seus estão armazenados'],
              ['Correção', 'Solicitar a correção de dados incorretos ou desatualizados'],
              ['Exclusão', 'Pedir a remoção dos seus dados pessoais'],
              ['Portabilidade', 'Receber seus dados em formato estruturado'],
              ['Revogação do consentimento', 'Retirar autorização para o tratamento dos dados'],
              ['Informação', 'Conhecer com quais entidades seus dados são compartilhados'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 items-start bg-pink-50 rounded-lg px-4 py-3">
                <span className="text-pink-600 font-bold text-sm mt-0.5">✓</span>
                <p className="text-gray-700 text-sm">
                  <strong>{title}:</strong> {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            9. Menores de idade
          </h2>
          <p className="text-gray-600 leading-relaxed">
            O aplicativo pode ser utilizado por menores de 18 anos mediante autorização e supervisão
            dos pais ou responsáveis legais. O cadastro de menores é realizado pelo administrador,
            que deve garantir a existência de consentimento dos responsáveis.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            10. Alterações nesta política
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Esta política pode ser atualizada periodicamente. Alterações relevantes serão
            comunicadas aos usuários com antecedência razoável. A data da última atualização
            é exibida no topo desta página.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-pink-500 pl-3">
            11. Contato
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Em caso de dúvidas sobre esta política ou para exercer seus direitos, entre em
            contato com a administração da academia:
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=558882170864&text=${encodeURIComponent(
              'Olá! Tenho uma dúvida sobre a política de privacidade do aplicativo.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            Falar pelo WhatsApp
          </a>
        </section>

        <div className="border-t border-gray-200 pt-6 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Espaço Fitness. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
