import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBudget } from '../../contexts/BudgetContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Progress from '../../components/ui/Progress';
import Step0BudgetType from './steps/Step0BudgetType';
import Step1BudgetType from './steps/Step1BudgetType';
import Step2ProjectInfo from './steps/Step1ProjectInfo';
import Step3StructureType from './steps/Step3StructureType';
import Step4Stages from './steps/Step3Stages';
import Step5Materials from './steps/Step4Materials';
import Step5Labor from './steps/Step4Labor';
import Step5Combined from './steps/Step4Combined';
import Step6Summary from './steps/Step5Summary';

const NewBudgetPage = ({ onPageChange }) => {
  const { currentUser } = useAuth();
  const { createBudget } = useBudget();
  const [currentStep, setCurrentStep] = useState(0);
  const [budgetType, setBudgetType] = useState(null); // 'materials', 'labor', 'combined'
  const [budgetMode, setBudgetMode] = useState(null); // 'casa-completa' ou 'comodos'
  const [budgetData, setBudgetData] = useState({
    info: {
      nomeProjeto: '',
      nomeCliente: '',
      pais: 'Brasil',
      estado: '',
      cidade: '',
      tipoObra: ''
    },
    structure: {
      type: null,
      etapas: [],
      comodos: []
    },
    materials: [],
    labor: [],
    quantidades: {},
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const getTotalSteps = () => {
    if (!budgetMode || !budgetType) return 0;
    return 6; // 0: Modo, 1: Tipo, 2: Info, 3: Estrutura, 4: Materiais, 5: Resumo
  };

  const totalSteps = getTotalSteps();
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModeSelect = (mode) => {
    setBudgetMode(mode);
    setCurrentStep(1);
  };

  const handleBudgetTypeSelect = (type) => {
    setBudgetType(type);
    setCurrentStep(2);
  };

  const handleDataChange = (stepData) => {
    setBudgetData(prev => ({
      ...prev,
      ...stepData
    }));
    
    // Se budgetMode foi definido, atualizar o estado
    if (stepData.budgetMode) {
      setBudgetMode(stepData.budgetMode);
    }
  };

  const handleSaveBudget = async () => {
    setLoading(true);
    try {
      // Calcular valor total
      const selectedMaterialIds = budgetData.materials || [];
      const quantidades = budgetData.quantidades || {};
      
      const allMaterials = {
        'cimento': { price: 25.50 },
        'areia': { price: 85.00 },
        'brita': { price: 95.00 },
        'tijolo': { price: 450.00 },
        'ferro': { price: 8.50 },
        'madeira': { price: 1200.00 },
        'telha': { price: 12.50 },
        'piso': { price: 45.00 },
        'tinta': { price: 85.00 },
        'azulejo': { price: 35.00 },
        'gesso': { price: 15.00 },
        'rejunte': { price: 8.50 },
        'fio': { price: 3.50 },
        'cano': { price: 12.00 },
        'luminaria': { price: 45.00 },
        'torneira': { price: 85.00 },
        'interruptor': { price: 12.50 },
        'piso-sala': { price: 45.00 },
        'tinta-sala': { price: 85.00 },
        'rodape': { price: 12.50 },
        'luminaria-sala': { price: 120.00 },
        'azulejo-cozinha': { price: 35.00 },
        'granito': { price: 180.00 },
        'torneira-cozinha': { price: 85.00 },
        'pia': { price: 250.00 },
        'piso-quarto': { price: 35.00 },
        'tinta-quarto': { price: 75.00 },
        'luminaria-quarto': { price: 65.00 },
        'tomada': { price: 8.50 },
        'azulejo-banheiro': { price: 35.00 },
        'box': { price: 450.00 },
        'vaso': { price: 180.00 },
        'chuveiro': { price: 95.00 }
      };

      const totalValue = selectedMaterialIds.reduce((total, materialId) => {
        const quantity = quantidades[materialId] || 0;
        const material = allMaterials[materialId];
        return total + (material ? material.price * quantity : 0);
      }, 0);

      const result = await createBudget({
        ...budgetData,
        total: totalValue,
        userId: currentUser.id,
        plano: currentUser.plano,
        budgetMode: budgetMode
      });
      
      if (result.success) {
        onPageChange('dashboard');
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0BudgetType onSelectType={handleModeSelect} />;
      case 1:
        return (
          <Step1BudgetType
            budgetMode={budgetMode}
            onSelectType={handleBudgetTypeSelect}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step2ProjectInfo
            data={budgetData.info}
            onChange={(info) => handleDataChange({ info })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3StructureType
            data={budgetData.structure}
            onChange={(structure) => handleDataChange({ structure })}
            onNext={handleNext}
            onBack={handleBack}
            budgetMode={budgetMode}
          />
        );
      case 4:
        return (
          <Step4Stages
            data={budgetData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
            budgetMode={budgetMode}
            budgetType={budgetType}
          />
        );
      case 5:
        if (budgetType === 'materials') {
          return (
            <Step5Materials
              data={budgetData}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              currentUser={currentUser}
              budgetMode={budgetMode}
            />
          );
        } else if (budgetType === 'labor') {
          return (
            <Step5Labor
              data={budgetData}
              onUpdate={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              loading={loading}
            />
          );
        } else if (budgetType === 'combined') {
          return (
            <Step5Combined
              data={budgetData}
              onUpdate={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              loading={loading}
            />
          );
        }
        break;
      case 6:
        return (
          <Step6Summary
            data={budgetData}
            onSave={handleSaveBudget}
            onBack={handleBack}
            loading={loading}
            budgetMode={budgetMode}
            budgetType={budgetType}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Escolha o Modo',
    'Escolha o Tipo',
    'Informações do Projeto',
    budgetMode === 'casa' ? 'Tipo de Estrutura' : 
    budgetMode === 'etapas' ? 'Seleção de Etapas' : 'Seleção de Cômodos',
    'Materiais',
    'Resumo'
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onPageChange('dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Novo Orçamento
            </h1>
            <p className="text-secondary-600">
              {currentStep === 0 ? 'Escolha o modo de orçamento' : `Passo ${currentStep} de ${totalSteps}: ${stepTitles[currentStep]}`}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {budgetMode && budgetType && (
        <Card className="p-4 lg:p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-secondary-600">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} size="lg" />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-200 text-secondary-600'
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </div>
  );
};

export default NewBudgetPage;
