import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Briefcase, Save, Edit3, Camera, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || '',
    email: currentUser?.email || '',
    telefone: currentUser?.telefone || '',
    profissao: currentUser?.profissao || '',
    plano: currentUser?.plano || 'basico',
    foto: currentUser?.foto || ''
  });
  const [profileImage, setProfileImage] = useState(currentUser?.foto || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          foto: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateUser(formData);
      if (result.success) {
        setIsEditing(false);
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil: ' + result.error);
      }
    } catch (error) {
      alert('Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: currentUser?.nome || '',
      email: currentUser?.email || '',
      telefone: currentUser?.telefone || '',
      profissao: currentUser?.profissao || '',
      plano: currentUser?.plano || 'basico',
      foto: currentUser?.foto || ''
    });
    setProfileImage(currentUser?.foto || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Meu Perfil
            </h1>
            <p className="text-secondary-600">
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>
        <Button
          variant={isEditing ? "outline" : "primary"}
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </>
          )}
        </Button>
      </div>

      {/* Foto de Perfil */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          Foto de Perfil
        </h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary-100 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-secondary-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-secondary-900">
              {formData.nome || 'Usuário'}
            </h3>
            <p className="text-secondary-600 mb-2">
              {formData.email}
            </p>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Alterar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <p className="text-sm text-secondary-500">
                Clique em "Editar" para alterar sua foto
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 border-b border-secondary-200 pb-2">
              Informações Pessoais
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                disabled={!isEditing}
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                disabled={!isEditing}
                helperText="O email não pode ser alterado"
              />
              
              <Input
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                icon={<Phone className="h-4 w-4" />}
                disabled={!isEditing}
                placeholder="(11) 99999-9999"
              />
              
              <Input
                label="Profissão"
                name="profissao"
                value={formData.profissao}
                onChange={handleChange}
                icon={<Briefcase className="h-4 w-4" />}
                disabled={!isEditing}
                placeholder="Ex: Arquiteto, Engenheiro"
              />
            </div>
          </Card>
        </div>

        {/* Informações da Conta */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Informações da Conta
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-700">Plano Atual</label>
                <div className="mt-1 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <span className="text-primary-800 font-semibold capitalize">
                    {formData.plano}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary-700">Tipo de Usuário</label>
                <div className="mt-1 p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
                  <span className="text-secondary-800 font-semibold">
                    {currentUser?.isAdmin ? 'Administrador' : 'Usuário'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary-700">Membro desde</label>
                <div className="mt-1 p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
                  <span className="text-secondary-800">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Ações */}
          {isEditing && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Ações
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleSave}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

