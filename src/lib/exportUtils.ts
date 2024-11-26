import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface ExportData {
  clientName: string;
  validationScore: number;
  opportunities: any[];
  recommendations: any[];
}

export async function exportToPDF(data: ExportData) {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.text('Validation Dashboard Report', margin, yPos);
  yPos += 15;

  // Client Info
  doc.setFontSize(14);
  doc.text(`Client: ${data.clientName}`, margin, yPos);
  yPos += 10;
  doc.text(`Validation Score: ${data.validationScore}%`, margin, yPos);
  yPos += 15;

  // Opportunities
  doc.setFontSize(16);
  doc.text('Funding Opportunities', margin, yPos);
  yPos += 10;
  doc.setFontSize(12);
  data.opportunities.forEach((opp) => {
    doc.text(`• ${opp.name} - Match Score: ${opp.matchScore}%`, margin + 5, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`  Amount: ${opp.amount}`, margin + 10, yPos);
    yPos += 7;
    doc.text(`  Deadline: ${new Date(opp.deadline).toLocaleDateString()}`, margin + 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
  });

  // Recommendations
  yPos += 5;
  doc.setFontSize(16);
  doc.text('Recommendations', margin, yPos);
  yPos += 10;
  doc.setFontSize(12);
  data.recommendations.forEach((rec) => {
    doc.text(`• ${rec.title}`, margin + 5, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`  ${rec.description}`, margin + 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
  });

  // Save the PDF
  doc.save(`${data.clientName.replace(/\s+/g, '_')}_validation_report.pdf`);
}

export async function exportToExcel(data: ExportData) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Validation Dashboard Report'],
    [],
    ['Client', data.clientName],
    ['Validation Score', `${data.validationScore}%`],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

  // Opportunities sheet
  const opportunitiesData = [
    ['Name', 'Match Score', 'Amount', 'Deadline'],
    ...data.opportunities.map(opp => [
      opp.name,
      `${opp.matchScore}%`,
      opp.amount,
      new Date(opp.deadline).toLocaleDateString(),
    ]),
  ];
  const opportunitiesWs = XLSX.utils.aoa_to_sheet(opportunitiesData);

  // Recommendations sheet
  const recommendationsData = [
    ['Title', 'Description', 'Impact'],
    ...data.recommendations.map(rec => [
      rec.title,
      rec.description,
      rec.impact,
    ]),
  ];
  const recommendationsWs = XLSX.utils.aoa_to_sheet(recommendationsData);

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  XLSX.utils.book_append_sheet(wb, opportunitiesWs, 'Opportunities');
  XLSX.utils.book_append_sheet(wb, recommendationsWs, 'Recommendations');

  // Save the file
  XLSX.writeFile(wb, `${data.clientName.replace(/\s+/g, '_')}_validation_report.xlsx`);
}