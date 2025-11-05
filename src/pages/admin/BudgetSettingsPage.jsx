import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Upload, 
  Palette, 
  Building2, 
  FileText, 
  Image, 
  Type, 
  Save,
  RotateCcw,
  Eye,
  Download
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { useBudgetSettings } from '../../contexts/BudgetSettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BudgetSettingsPage = () => {
  const { currentUser } = useAuth();
  const {
    settings,
    updateLayout,
    updateCompany,
    updateSignature,
    uploadLogo,
    uploadSignature,
    resetSettings,
    isBusinessUser
  } = useBudgetSettings();

  const [activeTab, setActiveTab] = useState('layout');
  const [loading, setLoading] = useState(false);

  const colorSchemeOptions = [
    { value: 'primary', label: 'Azul (Padrão)' },
    { value: 'secondary', label: 'Cinza' },
    { value: 'green', label: 'Verde' },
    { value: 'purple', label: 'Roxo' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const signatureTypeOptions = [
    { value: 'upload', label: 'Upload de Imagem' },
    { value: 'text', label: 'Texto' },
    { value: 'none', label: 'Nenhuma' }
  ];

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo deve ter no máximo 2MB');
      return;
    }

    try {
      setLoading(true);
      await uploadLogo(file);
      toast.success('Logo carregado com sucesso!');
    } catch (error) {
      toast.error('Erro ao carregar logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Assinatura deve ter no máximo 2MB');
      return;
    }

    try {
      setLoading(true);
      await uploadSignature(file);
      toast.success('Assinatura carregada com sucesso!');
    } catch (error) {
      toast.error('Erro ao carregar assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    resetSettings();
    toast.success('Configurações resetadas!');
  };

  const handlePreview = () => {
    // Implementar preview do orçamento
    toast.info('Preview será implementado em breve!');
  };

  const handleExport = () => {
    // Implementar exportação das configurações
    toast.info('Exportação será implementada em breve!');
  };

  if (!isBusinessUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Esta funcionalidade está disponível apenas para usuários empresariais.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Configurações do Orçamento
                </h1>
                <p className="text-gray-600 mt-1">
                  Personalize o layout e visual dos seus orçamentos
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'layout', label: 'Layout', icon: Settings },
                    { id: 'company', label: 'Empresa', icon: Building2 },
                    { id: 'signature', label: 'Assinatura', icon: FileText },
                    { id: 'colors', label: 'Cores', icon: Palette }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                {activeTab === 'layout' && (
                  <LayoutSettings
                    settings={settings.layout}
                    onUpdate={updateLayout}
                  />
                )}

                {activeTab === 'company' && (
                  <CompanySettings
                    settings={settings.company}
                    onUpdate={updateCompany}
                    onLogoUpload={handleLogoUpload}
                    loading={loading}
                  />
                )}

                {activeTab === 'signature' && (
                  <SignatureSettings
                    settings={settings.signature}
                    onUpdate={updateSignature}
                    onSignatureUpload={handleSignatureUpload}
                    loading={loading}
                  />
                )}

                {activeTab === 'colors' && (
                  <ColorSettings
                    settings={settings.layout}
                    onUpdate={updateLayout}
                  />
                )}
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button
              onClick={handleSave}
              loading={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Componente de configurações de layout
const LayoutSettings = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Layout</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Elementos Visuais</h4>
          
          {[
            { key: 'showLogo', label: 'Mostrar Logo da Empresa' },
            { key: 'showSignature', label: 'Mostrar Assinatura' },
            { key: 'showCompanyInfo', label: 'Mostrar Informações da Empresa' },
            { key: 'showSupplierInfo', label: 'Mostrar Fornecedores' },
            { key: 'showDiscount', label: 'Mostrar Desconto' },
            { key: 'showDateTime', label: 'Mostrar Data/Hora de Geração' }
          ].map((item) => (
            <label key={item.key} className="flex items-center">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => onUpdate({ [item.key]: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Esquema de Cores</h4>
          
          <Select
            label="Esquema de Cores"
            value={settings.colorScheme}
            onChange={(e) => onUpdate({ colorScheme: e.target.value })}
            options={colorSchemeOptions}
          />
        </div>
      </div>
    </div>
  );
};

// Componente de configurações da empresa
const CompanySettings = ({ settings, onUpdate, onLogoUpload, loading }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Nome da Empresa"
            value={settings.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Nome da sua empresa"
          />
          
          <Input
            label="Endereço"
            value={settings.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="Endereço completo"
          />
          
          <Input
            label="Telefone"
            value={settings.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="contato@empresa.com"
          />
          
          <Input
            label="Website"
            value={settings.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            placeholder="https://www.empresa.com"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo da Empresa
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                disabled={loading}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? 'Carregando...' : 'Upload Logo'}
              </label>
              {settings.logo && (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="h-12 w-12 object-contain border border-gray-200 rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de configurações de assinatura
const SignatureSettings = ({ settings, onUpdate, onSignatureUpload, loading }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Assinatura</h3>
      
      <div className="space-y-4">
        <Select
          label="Tipo de Assinatura"
          value={settings.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
          options={signatureTypeOptions}
        />

        {settings.type === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload de Assinatura
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={onSignatureUpload}
                disabled={loading}
                className="hidden"
                id="signature-upload"
              />
              <label
                htmlFor="signature-upload"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? 'Carregando...' : 'Upload Assinatura'}
              </label>
              {settings.image && (
                <img
                  src={settings.image}
                  alt="Assinatura"
                  className="h-12 w-32 object-contain border border-gray-200 rounded"
                />
              )}
            </div>
          </div>
        )}

        {settings.type === 'text' && (
          <Input
            label="Texto da Assinatura"
            value={settings.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Digite o texto da assinatura"
          />
        )}
      </div>
    </div>
  );
};

// Componente de configurações de cores
const ColorSettings = ({ settings, onUpdate }) => {
  const handleColorChange = (colorKey, value) => {
    onUpdate({
      customColors: {
        ...settings.customColors,
        [colorKey]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Esquema de Cores Personalizado</h3>
      
      {settings.colorScheme === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Primária
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.customColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="h-10 w-10 rounded border border-gray-300"
              />
              <Input
                value={settings.customColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Secundária
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.customColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="h-10 w-10 rounded border border-gray-300"
              />
              <Input
                value={settings.customColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="#6B7280"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor de Destaque
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.customColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="h-10 w-10 rounded border border-gray-300"
              />
              <Input
                value={settings.customColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="#10B981"
              />
            </div>
          </div>
        </div>
      )}

      {settings.colorScheme !== 'custom' && (
        <div className="text-center py-8">
          <Palette className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">
            Selecione "Personalizado" no esquema de cores para personalizar as cores
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetSettingsPage;
