import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building, MapPin, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ESTADOS, CIDADES, TIPOS_OBRA } from '../../../data/constants';

const Step1ProjectInfo = ({ data, onChange, onNext, onBack }) => {
  const [formData, setFormData] = useState(data);
  const [cidades, setCidades] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.estado) {
      setCidades(CIDADES[formData.estado] || []);
      setFormData(prev => ({ ...prev, cidade: '' }));
    } else {
      setCidades([]);
    }
  }, [formData.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nomeProjeto.trim()) {
      newErrors.nomeProjeto = 'Nome do projeto é obrigatório';
    }
    
    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome do cliente é obrigatório';
    }
    
    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }
    
    if (!formData.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    
    if (!formData.tipoObra) {
      newErrors.tipoObra = 'Tipo de obra é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onChange(formData);
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Informações do Projeto
        </h2>
        <p className="text-secondary-600">
          Preencha os dados básicos do seu orçamento
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Nome do Projeto */}
        <Input
          label="Nome do Projeto/Orçamento"
          name="nomeProjeto"
          value={formData.nomeProjeto}
          onChange={handleChange}
          placeholder="Ex: Casa Residencial 120m²"
          icon={<Building className="h-4 w-4" />}
          error={errors.nomeProjeto}
          required
        />

        {/* Nome do Cliente */}
        <Input
          label="Nome do Cliente"
          name="nomeCliente"
          value={formData.nomeCliente}
          onChange={handleChange}
          placeholder="Nome completo do cliente"
          icon={<User className="h-4 w-4" />}
          error={errors.nomeCliente}
          required
        />

        {/* Localização */}
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="Selecione o estado"
            error={errors.estado}
            required
          >
            {ESTADOS.map(estado => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </Select>

          <Select
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            placeholder="Selecione a cidade"
            disabled={!formData.estado}
            error={errors.cidade}
            required
          >
            {cidades.map(cidade => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </Select>
        </div>

        {/* País (fixo) */}
        <Input
          label="País"
          name="pais"
          value={formData.pais}
          disabled
          helperText="Atualmente disponível apenas para o Brasil"
        />

        {/* Tipo de Obra */}
        <Select
          label="Tipo de Obra"
          name="tipoObra"
          value={formData.tipoObra}
          onChange={handleChange}
          placeholder="Selecione o tipo de obra"
          icon={<Briefcase className="h-4 w-4" />}
          error={errors.tipoObra}
          required
        >
          {TIPOS_OBRA.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </Select>

        {/* Botões */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={!formData.nomeProjeto || !formData.nomeCliente || !formData.estado || !formData.cidade || !formData.tipoObra}
          >
            Continuar
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step1ProjectInfo;