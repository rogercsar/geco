// Utilitários para exportação de relatórios

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (data, filename = 'relatorio.pdf', elementId) => {
  try {
    let targetElement = elementId ? document.getElementById(elementId) : null

    // Se não houver elemento alvo, gerar HTML temporário para captura
    let tempContainer = null
    if (!targetElement) {
      tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.top = '-10000px'
      tempContainer.style.left = '-10000px'
      tempContainer.style.width = '794px' // A4 width in px at ~96dpi
      tempContainer.style.background = '#fff'
      tempContainer.innerHTML = generateHTMLReport(data)
      document.body.appendChild(tempContainer)
      targetElement = tempContainer
    }

    const canvas = await html2canvas(targetElement, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let position = 0
    let heightLeft = imgHeight

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)

    if (tempContainer) {
      document.body.removeChild(tempContainer)
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    alert('Não foi possível exportar o PDF. Tente novamente.')
  }
}

export const exportToExcel = (data, filename = 'relatorio.xlsx') => {
  // Implementação básica de exportação para Excel
  // Em uma implementação real, você usaria uma biblioteca como SheetJS
  const csvContent = generateCSVReport(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename.replace('.xlsx', '.csv'))
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  console.log(`Exportando relatório para Excel: ${filename}`)
}

export const exportToImage = async (elementId, filename = 'relatorio.png') => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Elemento não encontrado para exportação')
      alert('Elemento não encontrado para exportação de imagem.')
      return
    }

    const canvas = await html2canvas(element, { scale: 2 })
    const dataUrl = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erro ao exportar imagem:', error)
    alert('Não foi possível exportar a imagem. Tente novamente.')
  }
}

const generateHTMLReport = (data) => {
  const currentDate = new Date().toLocaleDateString('pt-BR')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Orçamentos - Geco</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Orçamentos</h1>
        <p>Gerado em: ${currentDate}</p>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Total de Orçamentos</h3>
          <p>${data.totalCount}</p>
        </div>
        <div class="stat-card">
          <h3>Valor Total</h3>
          <p>R$ ${data.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div class="stat-card">
          <h3>Valor Médio</h3>
          <p>R$ ${data.averageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      
      <h2>Distribuição por Tipo</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Percentual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Materiais</td>
            <td>${data.materialsCount}</td>
            <td>${data.totalCount > 0 ? ((data.materialsCount / data.totalCount) * 100).toFixed(1) : 0}%</td>
          </tr>
          <tr>
            <td>Mão de Obra</td>
            <td>${data.laborCount}</td>
            <td>${data.totalCount > 0 ? ((data.laborCount / data.totalCount) * 100).toFixed(1) : 0}%</td>
          </tr>
          <tr>
            <td>Combinados</td>
            <td>${data.combinedCount}</td>
            <td>${data.totalCount > 0 ? ((data.combinedCount / data.totalCount) * 100).toFixed(1) : 0}%</td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>Relatório gerado pelo sistema Geco</p>
      </div>
    </body>
    </html>
  `
}

const generateCSVReport = (data) => {
  const headers = ['Tipo', 'Quantidade', 'Percentual']
  const rows = [
    ['Materiais', data.materialsCount, data.totalCount > 0 ? ((data.materialsCount / data.totalCount) * 100).toFixed(1) + '%' : '0%'],
    ['Mão de Obra', data.laborCount, data.totalCount > 0 ? ((data.laborCount / data.totalCount) * 100).toFixed(1) + '%' : '0%'],
    ['Combinados', data.combinedCount, data.totalCount > 0 ? ((data.combinedCount / data.totalCount) * 100).toFixed(1) + '%' : '0%']
  ]
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  return csvContent
}

export const shareReport = (data) => {
  // Implementação básica de compartilhamento
  // Em uma implementação real, você usaria Web Share API ou redes sociais
  
  const shareData = {
    title: 'Relatório de Orçamentos - Geco',
    text: `Relatório com ${data.totalCount} orçamentos totalizando R$ ${data.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    url: window.location.href
  }
  
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Relatório compartilhado com sucesso'))
      .catch((error) => console.log('Erro ao compartilhar:', error))
  } else {
    // Fallback para navegadores que não suportam Web Share API
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert('Link do relatório copiado para a área de transferência!')
      })
      .catch(() => {
        alert('Não foi possível copiar o link. Tente novamente.')
      })
  }
}

