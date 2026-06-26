import { jsPDF } from 'jspdf';
import { Transaction } from '../types';
import { 
  getMonthlySummary, 
  getExpensesByCategory, 
  filterTransactionsByMonth, 
  formatCurrency 
} from './calculations';

export function exportMonthlyReportPdf(
  transactions: Transaction[], 
  monthStr: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const [year, month] = monthStr.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const monthName = monthNames[parseInt(month, 10) - 1] || month;
  const formattedPeriod = `${monthName} de ${year}`;

  const summary = getMonthlySummary(transactions, monthStr);
  const categories = getExpensesByCategory(transactions, monthStr);
  const filteredTransactions = filterTransactionsByMonth(transactions, monthStr)
    .sort((a, b) => b.date.localeCompare(a.date)); // Mais recentes primeiro

  let currentY = 20;
  const pageHeight = 297;
  const leftMargin = 15;
  const contentWidth = 180;

  // Função auxiliar para verificar e adicionar nova página
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = 20;
      drawHeaderFooter();
    }
  };

  // Desenhar cabeçalho e rodapé decorativos em cada página
  const drawHeaderFooter = () => {
    // Linha de cabeçalho
    doc.setDrawColor(229, 231, 235); // Cinza claro
    doc.setLineWidth(0.5);
    doc.line(leftMargin, 12, leftMargin + contentWidth, 12);

    // Rodapé
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('DinheiroClaro — Controle Financeiro Pessoal', leftMargin, pageHeight - 10);
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, leftMargin + contentWidth - 40, pageHeight - 10);
  };

  // Primeira página - Inicializar cabeçalho/rodapé
  drawHeaderFooter();

  // Título do Relatório
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39); // Cinza escuro
  doc.text('DinheiroClaro', leftMargin, currentY);
  
  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(`Relatório de Controle Financeiro Mensal • ${formattedPeriod}`, leftMargin, currentY);

  currentY += 12;

  // 1. Bloco de Resumo Financeiro (Cards)
  doc.setFillColor(249, 250, 251); // Fundo cinza bem claro
  doc.roundedRect(leftMargin, currentY, contentWidth, 32, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('RESUMO FINANCEIRO', leftMargin + 6, currentY + 8);

  // Receitas (Verde #16A34A)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Total de Receitas', leftMargin + 6, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(22, 163, 74);
  doc.text(formatCurrency(summary.income), leftMargin + 6, currentY + 23);

  // Despesas (Vermelho #DC2626)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('Total de Despesas', leftMargin + 65, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(220, 38, 38);
  doc.text(formatCurrency(summary.expense), leftMargin + 65, currentY + 23);

  // Saldo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('Saldo do Mês', leftMargin + 125, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const [balR, balG, balB] = summary.balance >= 0 ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(balR, balG, balB);
  doc.text(formatCurrency(summary.balance), leftMargin + 125, currentY + 23);

  currentY += 40;

  // 2. Gastos por Categoria
  if (categories.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('Gastos por Categoria', leftMargin, currentY);

    currentY += 6;

    // Cabeçalho da tabela de categorias
    doc.setFillColor(243, 244, 246);
    doc.rect(leftMargin, currentY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text('Categoria', leftMargin + 4, currentY + 5);
    doc.text('Valor Total', leftMargin + 85, currentY + 5);
    doc.text('Representação (%)', leftMargin + 135, currentY + 5);

    currentY += 7;

    categories.forEach(cat => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      doc.text(cat.name, leftMargin + 4, currentY + 5);
      doc.text(formatCurrency(cat.value), leftMargin + 85, currentY + 5);
      doc.text(`${cat.percentage.toFixed(1)}%`, leftMargin + 135, currentY + 5);

      // Linha separadora
      doc.setDrawColor(243, 244, 246);
      doc.line(leftMargin, currentY + 7, leftMargin + contentWidth, currentY + 7);

      currentY += 8;
    });

    currentY += 8;
  }

  // 3. Detalhamento de Lançamentos
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('Lista de Lançamentos', leftMargin, currentY);

  currentY += 6;

  if (filteredTransactions.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Nenhum lançamento registrado neste mês.', leftMargin, currentY + 5);
    currentY += 12;
  } else {
    // Cabeçalho da tabela de transações
    doc.setFillColor(243, 244, 246);
    doc.rect(leftMargin, currentY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text('Data', leftMargin + 4, currentY + 5);
    doc.text('Descrição', leftMargin + 28, currentY + 5);
    doc.text('Categoria', leftMargin + 85, currentY + 5);
    doc.text('Tipo', leftMargin + 130, currentY + 5);
    doc.text('Valor', leftMargin + 155, currentY + 5);

    currentY += 7;

    filteredTransactions.forEach(t => {
      checkPageBreak(8);

      // Formatar data DD/MM/AAAA
      const [yVal, mVal, dVal] = t.date.split('-');
      const formattedDate = `${dVal}/${mVal}/${yVal}`;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);

      // Data
      doc.text(formattedDate, leftMargin + 4, currentY + 5);
      
      // Descrição (com truncamento se muito longa)
      let desc = t.description || 'Sem descrição';
      if (desc.length > 25) {
        desc = desc.substring(0, 22) + '...';
      }
      doc.text(desc, leftMargin + 28, currentY + 5);

      // Categoria
      doc.text(t.category, leftMargin + 85, currentY + 5);

      // Tipo
      const isIncome = t.type === 'income';
      doc.setFont('helvetica', 'bold');
      if (isIncome) {
        doc.setTextColor(22, 163, 74);
        doc.text('Receita', leftMargin + 130, currentY + 5);
      } else {
        doc.setTextColor(220, 38, 38);
        doc.text('Despesa', leftMargin + 130, currentY + 5);
      }

      // Valor
      doc.text(formatCurrency(t.amount), leftMargin + 155, currentY + 5);

      // Linha separadora
      doc.setDrawColor(243, 244, 246);
      doc.line(leftMargin, currentY + 7, leftMargin + contentWidth, currentY + 7);

      currentY += 8;
    });
  }

  // Salvar documento
  doc.save(`Relatorio_DinheiroClaro_${monthStr}.pdf`);
}
