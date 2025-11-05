import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import Button from './Button';

const UpgradeToast = ({ limit, message, variant = 'warning', onUpgradeClick, onClose }) => {
  const defaultMessage =
    limit != null
      ? `Limite atingido: seu plano permite até ${limit} orçamentos. Faça upgrade para criar mais.`
      : 'Recurso disponível nos planos Pro e Empresarial. Faça upgrade para acessar.';

  const isInfo = variant === 'info';
  const ContainerClasses = isInfo
    ? 'bg-blue-50 border border-blue-200'
    : 'bg-yellow-50 border border-yellow-200';
  const IconComponent = isInfo ? Info : AlertTriangle;
  const IconClasses = isInfo ? 'h-5 w-5 text-blue-600 mt-0.5' : 'h-5 w-5 text-yellow-600 mt-0.5';

  return (
    <div className={`${ContainerClasses} shadow-lg rounded-md p-3 max-w-sm`}>
      <div className="flex items-start gap-3">
        <IconComponent className={IconClasses} />
        <div className="flex-1">
          <p className="text-sm text-secondary-900">
            {message || defaultMessage}
          </p>
          <div className="mt-2 flex gap-2 items-center">
            <Button size="sm" onClick={onUpgradeClick}>
              Fazer Upgrade
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Fechar
            </Button>
            <button
              type="button"
              className="text-primary-700 underline text-xs"
              onClick={onUpgradeClick}
            >
              Ver planos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToast;