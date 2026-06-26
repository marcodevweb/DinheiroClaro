# DinheiroClaro

O **DinheiroClaro** é uma aplicação web de controle financeiro pessoal, projetada com foco absoluto em praticidade, simplicidade e privacidade. 

Diferente de sistemas convencionais, o **DinheiroClaro** funciona de forma 100% offline-first e local: não requer cadastro, e-mail ou senhas, e todos os seus dados permanecem armazenados unicamente no seu navegador, sem transitar por nenhum servidor externo.

## Funcionalidades Principais

1. **Gestão de Lançamentos**: 
   - Adicione receitas e despesas com valores, datas, categorias e descrições personalizadas.
   - Categorias pré-definidas (Alimentação, Transporte, Moradia, Lazer, Saúde, Salário, Outros) e suporte completo à criação de categorias personalizadas na hora.
   - Listagem completa de movimentações do mês atual, com recursos integrados de busca por texto, filtro de tipo (Receitas ou Despesas), ordenação inteligente e edição/exclusão direta.

2. **Dashboard de Análise**:
   - Resumo consolidado no topo contendo o total de receitas, total de despesas e o saldo líquido do mês.
   - **Gráfico de Pizza**: Distribuição percentual e visual das despesas por categoria.
   - **Gráfico de Linha/Área**: Progressão diária e evolução do saldo acumulado ao longo dos dias do mês selecionado.
   - Navegação histórica fluida através de um seletor de mês e ano para consultar lançamentos e estatísticas de períodos anteriores.

3. **Relatórios em PDF**:
   - Geração instantânea de relatórios financeiros mensais estruturados em PDF através do botão "Exportar PDF" (utilizando a biblioteca `jsPDF`).
   - O documento exportado conta com tabelas limpas de distribuição de categorias, dados do resumo financeiro e o detalhamento cronológico de todos os lançamentos do mês selecionado.

4. **Visual e Usabilidade**:
   - Design moderno, limpo, responsivo e adaptado para visualização em celulares, tablets e computadores de mesa.
   - Transição fluida de estados com feedback visual em tempo real de todas as atualizações de valores e saldo.

## Tecnologias Utilizadas

- **React + Vite** (com suporte total a TypeScript)
- **Tailwind CSS** (estilização rápida, responsiva e de alta performance)
- **Recharts** (gráficos interativos e fluidos para web)
- **jsPDF** (geração estruturada de relatórios em formato PDF)
- **Web Storage API (localStorage)** (para persistência íntegra e privada dos dados financeiros diretamente na máquina do usuário)

## Como Rodar o Projeto Localmente

Para rodar o projeto em sua máquina de desenvolvimento, siga os passos abaixo:

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) instalado em seu sistema operacional (versão 18 ou superior recomendada).

### Passo a Passo

1. **Instalar Dependências**:
   Navegue até a pasta raiz do projeto e instale as dependências executando o comando:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desenvolvimento**:
   Para iniciar a aplicação localmente no ambiente de testes, execute:
   ```bash
   npm run dev
   ```
   A aplicação estará rodando e poderá ser acessada em seu navegador no endereço: [http://localhost:3000](http://localhost:3000).

3. **Construir para Produção**:
   Caso queira gerar os arquivos estáticos compilados para hospedar na web (por exemplo, no GitHub Pages, Vercel ou Netlify):
   ```bash
   npm run build
   ```
   Os arquivos finais de produção serão gerados na pasta `dist/`.

## Foco em Privacidade

O DinheiroClaro foi projetado para que o usuário tenha total controle sobre suas informações. Por ser armazenado via `localStorage`, as informações financeiras cadastrados por você **nunca** serão compartilhadas com terceiros ou enviadas para a nuvem. Caso queira limpar os dados por completo, basta limpar os dados do site ou o cache do seu próprio navegador.
