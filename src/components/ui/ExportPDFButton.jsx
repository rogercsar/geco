import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from './Button';
import { Download } from 'lucide-react';

const ExportPDFButton = ({ budgetId, budgetData }) => {
  const handleExport = () => {
    const input = document.getElementById(`budget-details-${budgetId}`);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`orcamento-${budgetData.projectName}.pdf`);
    });
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
};

export default ExportPDFButton;
