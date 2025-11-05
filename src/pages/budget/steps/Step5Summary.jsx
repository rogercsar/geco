import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Download, Share2, Mail, MessageCircle, Package, Percent, Building2, Star, Calendar, Clock, Users } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ShareBudgetModal from '../../../components/ui/ShareBudgetModal';
import { formatCurrency, formatDate } from '../../../utils/format';
import { useBudgetSettings } from '../../../contexts/BudgetSettingsContext';

const Step5Summary = ({ data, onSave, onBack, loading, budgetMode, budgetType }) => {
  const { info, materials, labor, quantidades } = data;
  const { settings, isBusinessUser } = useBudgetSettings();
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Data e hora de geração do orçamento
  const generationDateTime = new Date();
  const formattedDate = generationDateTime.toLocaleDateString('pt-BR');
  const formattedTime = generationDateTime.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Materiais baseados na seleção
  const getSelectedMaterials = () => {
    const selectedMaterialIds = materials || [];
    
    const allMaterials = {
      'cimento': { id: 'cimento', name: 'Cimento', category: 'Básico', price: 25.50, unit: 'saco' },
      'areia': { id: 'areia', name: 'Areia', category: 'Básico', price: 85.00, unit: 'm³' },
      'brita': { id: 'brita', name: 'Brita', category: 'Básico', price: 95.00, unit: 'm³' },
      'tijolo': { id: 'tijolo', name: 'Tijolo', category: 'Básico', price: 450.00, unit: 'milheiro' },
      'ferro': { id: 'ferro', name: 'Ferro', category: 'Estrutural', price: 8.50, unit: 'kg' },
      'madeira': { id: 'madeira', name: 'Madeira', category: 'Estrutural', price: 1200.00, unit: 'm³' },
      'telha': { id: 'telha', name: 'Telha', category: 'Cobertura', price: 12.50, unit: 'unidade' },
      'piso': { id: 'piso', name: 'Piso', category: 'Acabamento', price: 45.00, unit: 'm²' },
      'tinta': { id: 'tinta', name: 'Tinta', category: 'Acabamento', price: 85.00, unit: 'galão' },
      'azulejo': { id: 'azulejo', name: 'Azulejo', category: 'Acabamento', price: 35.00, unit: 'm²' },
      'gesso': { id: 'gesso', name: 'Gesso', category: 'Acabamento', price: 15.00, unit: 'kg' },
      'rejunte': { id: 'rejunte', name: 'Rejunte', category: 'Acabamento', price: 8.50, unit: 'kg' },
      'fio': { id: 'fio', name: 'Fio Elétrico', category: 'Elétrica', price: 3.50, unit: 'metro' },
      'cano': { id: 'cano', name: 'Cano PVC', category: 'Hidráulica', price: 12.00, unit: 'metro' },
      'luminaria': { id: 'luminaria', name: 'Luminária', category: 'Elétrica', price: 45.00, unit: 'unidade' },
      'torneira': { id: 'torneira', name: 'Torneira', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
      'interruptor': { id: 'interruptor', name: 'Interruptor', category: 'Elétrica', price: 12.50, unit: 'unidade' },
      'piso-sala': { id: 'piso-sala', name: 'Piso Laminado', category: 'Piso', price: 45.00, unit: 'm²' },
      'tinta-sala': { id: 'tinta-sala', name: 'Tinta Acrílica', category: 'Pintura', price: 85.00, unit: 'galão' },
      'rodape': { id: 'rodape', name: 'Rodapé', category: 'Acabamento', price: 12.50, unit: 'metro' },
      'luminaria-sala': { id: 'luminaria-sala', name: 'Luminária de Teto', category: 'Iluminação', price: 120.00, unit: 'unidade' },
      'azulejo-cozinha': { id: 'azulejo-cozinha', name: 'Azulejo Cozinha', category: 'Revestimento', price: 35.00, unit: 'm²' },
      'granito': { id: 'granito', name: 'Granito', category: 'Bancada', price: 180.00, unit: 'm²' },
      'torneira-cozinha': { id: 'torneira-cozinha', name: 'Torneira Cozinha', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
      'pia': { id: 'pia', name: 'Pia', category: 'Hidráulica', price: 250.00, unit: 'unidade' },
      'piso-quarto': { id: 'piso-quarto', name: 'Piso Vinílico', category: 'Piso', price: 35.00, unit: 'm²' },
      'tinta-quarto': { id: 'tinta-quarto', name: 'Tinta Latex', category: 'Pintura', price: 75.00, unit: 'galão' },
      'luminaria-quarto': { id: 'luminaria-quarto', name: 'Luminária de Mesa', category: 'Iluminação', price: 65.00, unit: 'unidade' },
      'tomada': { id: 'tomada', name: 'Tomada', category: 'Elétrica', price: 8.50, unit: 'unidade' },
      'azulejo-banheiro': { id: 'azulejo-banheiro', name: 'Azulejo Banheiro', category: 'Revestimento', price: 35.00, unit: 'm²' },
      'box': { id: 'box', name: 'Box de Vidro', category: 'Vedação', price: 450.00, unit: 'unidade' },
      'vaso': { id: 'vaso', name: 'Vaso Sanitário', category: 'Sanitário', price: 180.00, unit: 'unidade' },
      'chuveiro': { id: 'chuveiro', name: 'Chuveiro', category: 'Hidráulica', price: 95.00, unit: 'unidade' }
    };

    return selectedMaterialIds.map(id => allMaterials[id]).filter(Boolean);
  };

  const selectedMaterials = getSelectedMaterials();

  // Mão de obra baseada na seleção
  const getSelectedLabor = () => {
    const selectedLaborIds = labor || [];
    
    const allLabor = {
      'pedreiro': { id: 'pedreiro', name: 'Pedreiro', category: 'Construção', price: 120.00, unit: 'dia' },
      'eletricista': { id: 'eletricista', name: 'Eletricista', category: 'Elétrica', price: 150.00, unit: 'dia' },
      'encanador': { id: 'encanador', name: 'Encanador', category: 'Hidráulica', price: 130.00, unit: 'dia' },
      'pintor': { id: 'pintor', name: 'Pintor', category: 'Acabamento', price: 100.00, unit: 'dia' },
      'carpinteiro': { id: 'carpinteiro', name: 'Carpinteiro', category: 'Madeira', price: 140.00, unit: 'dia' },
      'azulejista': { id: 'azulejista', name: 'Azulejista', category: 'Acabamento', price: 110.00, unit: 'dia' },
      'gesseiro': { id: 'gesseiro', name: 'Gesseiro', category: 'Acabamento', price: 90.00, unit: 'dia' },
      'soldador': { id: 'soldador', name: 'Soldador', category: 'Metal', price: 160.00, unit: 'dia' },
      'ajudante': { id: 'ajudante', name: 'Ajudante Geral', category: 'Auxiliar', price: 80.00, unit: 'dia' },
      'engenheiro': { id: 'engenheiro', name: 'Engenheiro Civil', category: 'Supervisão', price: 300.00, unit: 'dia' }
    };

    return selectedLaborIds.map(id => allLabor[id]).filter(Boolean);
  };

  const selectedLabor = getSelectedLabor();

  const totalValue = useMemo(() => {
    let materialsTotal = 0;
    let laborTotal = 0;

    // Calcular total de materiais
    if (budgetType === 'materials' || budgetType === 'combined') {
      materialsTotal = selectedMaterials.reduce((total, material) => {
        const quantity = quantidades?.[material.id] || 0;
        return total + (material.price * quantity);
      }, 0);
    }

    // Calcular total de mão de obra
    if (budgetType === 'labor' || budgetType === 'combined') {
      const selectedLabor = getSelectedLabor();
      laborTotal = selectedLabor.reduce((total, laborItem) => {
        const quantity = quantidades?.[laborItem.id] || 0;
        return total + (laborItem.price * quantity);
      }, 0);
    }

    return materialsTotal + laborTotal;
  }, [selectedMaterials, quantidades, budgetType]);

  // Desconto da plataforma (5% para novos usuários, 3% para usuários existentes)
  const platformDiscountRate = 0.05; // 5%
  const platformDiscount = totalValue * platformDiscountRate;
  const finalValue = totalValue - platformDiscount;

  // Fornecedores selecionados
  const selectedSuppliers = useMemo(() => {
    const suppliers = data.suppliers || {};
    return Object.values(suppliers).filter(supplier => supplier);
  }, [data.suppliers]);

  const materialsWithQuantities = useMemo(() => {
    return selectedMaterials.filter(material => {
      const quantity = quantidades?.[material.id] || 0;
      return quantity > 0;
    });
  }, [selectedMaterials, quantidades]);

  const handleSave = () => {
    const budgetData = {
      ...data,
      totalValue: totalValue,
      platformDiscount: platformDiscount,
      finalValue: finalValue,
      selectedSuppliers: selectedSuppliers
    };
    onSave(budgetData);
  };

  const handleExportPDF = () => {
    alert('Funcionalidade de exportação PDF será implementada em breve!');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getBudgetType = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Casa Completa';
      case 'etapas':
        return `Por Etapas - ${data.structure?.selectedOption}`;
      case 'comodos':
        return `Por Cômodos - ${data.structure?.selectedOption}`;
      default:
        return 'Orçamento';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Cabeçalho Personalizado */}
      {isBusinessUser && settings.layout.showLogo && settings.company.logo && (
        <Card className="p-4 sm:p-6 bg-white border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={settings.company.logo}
                alt="Logo da Empresa"
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {settings.company.name || 'Minha Empresa'}
                </h1>
                {settings.layout.showCompanyInfo && (
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    {settings.company.address && <p className="truncate">{settings.company.address}</p>}
                    {settings.company.phone && <p className="truncate">{settings.company.phone}</p>}
                    {settings.company.email && <p className="truncate">{settings.company.email}</p>}
                    {settings.company.website && <p className="truncate">{settings.company.website}</p>}
                  </div>
                )}
              </div>
            </div>
            {settings.layout.showDateTime && (
              <div className="text-left sm:text-right text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4"
        >
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
          Orçamento Finalizado!
        </h2>
        <p className="text-sm sm:text-base text-secondary-600 px-4">
          Revise os detalhes do seu orçamento antes de salvar
        </p>
        {!isBusinessUser && settings.layout.showDateTime && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Resumo do Orçamento */}
      <Card className="p-4 sm:p-6 bg-primary-50 border-primary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-1 truncate">
              {getBudgetType()}
            </h3>
            <p className="text-xs sm:text-sm text-primary-700 truncate">
              Projeto: {info.nomeProjeto}
            </p>
            <p className="text-xs sm:text-sm text-primary-700 truncate">
              Cliente: {info.nomeCliente}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="space-y-2">
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-xs sm:text-sm text-primary-700">Subtotal:</span>
                <span className="text-base sm:text-lg font-semibold text-primary-900">
                  {formatCurrency(totalValue)}
                </span>
              </div>
              {settings.layout.showDiscount && (
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Percent className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-700">Desconto Geco (5%):</span>
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-green-600">
                    -{formatCurrency(platformDiscount)}
                  </span>
                </div>
              )}
              <div className="border-t border-primary-200 pt-2">
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base sm:text-lg font-semibold text-primary-900">Total Final:</span>
                  <span className="text-2xl sm:text-3xl font-bold text-primary-900">
                    {formatCurrency(finalValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalhes dos Materiais */}
      {(budgetType === 'materials' || budgetType === 'combined') && selectedMaterials.length > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-600 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold text-secondary-900">
              Materiais Selecionados
            </h3>
          </div>

        <div className="space-y-3 sm:space-y-4">
          {materialsWithQuantities.map((material, index) => {
            const quantity = quantidades?.[material.id] || 0;
            const subtotal = material.price * quantity;
            
            return (
              <motion.div
                key={`material-${material.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg space-y-2 sm:space-y-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-secondary-900 text-sm sm:text-base truncate">
                    {material.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-secondary-600 truncate">
                    {material.category} • {formatCurrency(material.price)} / {material.unit}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-secondary-900 text-sm sm:text-base">
                    {quantity} {material.unit}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-600">
                    {formatCurrency(subtotal)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {materialsWithQuantities.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-secondary-400" />
            <p className="text-sm sm:text-base text-secondary-500">
              Nenhum material com quantidade definida
            </p>
          </div>
        )}
        </Card>
      )}

      {/* Detalhes da Mão de Obra */}
      {(budgetType === 'labor' || budgetType === 'combined') && selectedLabor.length > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-600 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold text-secondary-900">
              Mão de Obra Selecionada
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {selectedLabor.map((laborItem, index) => {
              const quantity = quantidades?.[laborItem.id] || 0;
              const subtotal = laborItem.price * quantity;
              
              return (
                <motion.div
                  key={`labor-${laborItem.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-secondary-900 text-sm sm:text-base truncate">
                      {laborItem.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-secondary-600 truncate">
                      {laborItem.category} • {formatCurrency(laborItem.price)} / {laborItem.unit}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-secondary-900 text-sm sm:text-base">
                      {quantity} {laborItem.unit}
                    </p>
                    <p className="text-xs sm:text-sm text-secondary-600">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Fornecedores Selecionados */}
      {selectedSuppliers.length > 0 && settings.layout.showSupplierInfo && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-600 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-semibold text-secondary-900">
              Fornecedores Selecionados
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {selectedSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 sm:p-4 bg-secondary-50 rounded-lg border border-secondary-200"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                    <h4 className="font-medium text-secondary-900 text-sm sm:text-base truncate">
                      {supplier.name}
                    </h4>
                  </div>
                  <Badge variant="secondary" size="sm" className="text-xs px-2 py-1 flex-shrink-0">
                    Selecionado
                  </Badge>
                </div>
                
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-secondary-600">
                  {supplier.phone && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Informações do Projeto */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-3 sm:mb-4">
          Informações do Projeto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-secondary-600">Nome do Projeto</p>
            <p className="font-medium text-secondary-900 text-sm sm:text-base truncate">{info.nomeProjeto}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-secondary-600">Cliente</p>
            <p className="font-medium text-secondary-900 text-sm sm:text-base truncate">{info.nomeCliente}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-secondary-600">Localização</p>
            <p className="font-medium text-secondary-900 text-sm sm:text-base truncate">{info.cidade}, {info.estado}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-secondary-600">Tipo de Obra</p>
            <p className="font-medium text-secondary-900 text-sm sm:text-base truncate">{info.tipoObra}</p>
          </div>
        </div>
      </Card>

      {/* Assinatura */}
      {isBusinessUser && settings.layout.showSignature && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Assinatura
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {settings.company.name || 'Minha Empresa'}
              </p>
            </div>
            <div className="text-left sm:text-right">
              {settings.signature.type === 'upload' && settings.signature.image && (
                <img
                  src={settings.signature.image}
                  alt="Assinatura"
                  className="h-12 w-24 sm:h-16 sm:w-32 object-contain"
                />
              )}
              {settings.signature.type === 'text' && settings.signature.text && (
                <div className="text-xs sm:text-sm text-gray-600">
                  {settings.signature.text}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Ações */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 pt-4 sm:pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Voltar
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={loading}
            className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={loading}
            className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Compartilhar</span>
            <span className="sm:hidden">Share</span>
          </Button>
          
          <Button
            onClick={handleSave}
            loading={loading}
            className="w-full sm:flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Salvar Orçamento</span>
            <span className="sm:hidden">Salvar</span>
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareBudgetModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        budget={{
          id: `budget-${Date.now()}`,
          info: {
            nomeProjeto: info?.nomeProjeto || 'Projeto',
            nomeCliente: info?.nomeCliente || 'Cliente'
          },
          total: finalValue,
          createdAt: generationDateTime
        }}
      />
    </motion.div>
  );
};

export default Step5Summary;