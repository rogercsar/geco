import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  MessageCircle, 
  Link, 
  Copy, 
  Download, 
  Share2,
  MessageSquare,
  QrCode,
  CheckCircle
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import { formatCurrency, formatDate } from '../../utils/format';

const ShareBudgetModal = ({ isOpen, onClose, budget }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [emailData, setEmailData] = useState({
    to: '',
    subject: `Orçamento - ${budget?.info?.nomeProjeto || 'Projeto'}`,
    message: `Olá,\n\nSegue o orçamento solicitado:\n\nProjeto: ${budget?.info?.nomeProjeto || 'N/A'}\nCliente: ${budget?.info?.nomeCliente || 'N/A'}\nValor Total: ${formatCurrency(budget?.total || 0)}\n\nAtenciosamente,\nEquipe Geco`
  });
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      id: 'email',
      label: 'Email',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => handleEmailShare()
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => handleWhatsAppShare()
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-blue-400 hover:bg-blue-500',
      action: () => handleTelegramShare()
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <Share2 className="h-5 w-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleFacebookShare()
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => handleTwitterShare()
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <Share2 className="h-5 w-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => handleLinkedInShare()
    }
  ];

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const budgetId = budget?.id || 'demo';
    return `${baseUrl}/budget/${budgetId}`;
  };

  const generateShareText = () => {
    return `Confira este orçamento de construção:\n\n🏗️ Projeto: ${budget?.info?.nomeProjeto || 'N/A'}\n💰 Valor: ${formatCurrency(budget?.total || 0)}\n📅 Data: ${formatDate(budget?.createdAt)}\n\nCriado com Geco - Plataforma de Orçamentos de Construção Civil`;
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(emailData.message);
    const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://t.me/share/url?url=${encodeURIComponent(generateShareLink())}&text=${text}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateShareLink())}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(generateShareLink())}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generateShareLink())}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleDownloadQR = () => {
    // Implementar geração de QR Code
    alert('Funcionalidade de QR Code será implementada em breve!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Share2 className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-secondary-900">
                  Compartilhar Orçamento
                </h2>
                <p className="text-sm text-secondary-600">
                  {budget?.info?.nomeProjeto || 'Projeto sem nome'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-secondary-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('link')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'link'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Link className="h-4 w-4" />
                <span>Link</span>
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'email'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'social'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>Redes Sociais</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'link' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Link de Compartilhamento
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={generateShareLink()}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCopyLink}
                      className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadQR}
                    className="flex-1"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(generateShareLink(), '_blank')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Abrir Link
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email do Destinatário
                  </label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Assunto
                  </label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={6}
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleEmailShare}
                  disabled={!emailData.to}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-secondary-700 mb-3">
                    Compartilhar nas Redes Sociais
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {shareOptions.map((option) => (
                      <Button
                        key={option.id}
                        onClick={option.action}
                        className={`${option.color} text-white flex items-center justify-center space-x-2 py-3`}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 rounded-lg">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">
                    Preview da Mensagem
                  </h4>
                  <p className="text-sm text-secondary-600 whitespace-pre-line">
                    {generateShareText()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareBudgetModal;


