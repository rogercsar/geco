// Utilitário para checagens de permissões por plano

export const PLAN_IDS = {
  BASICO: 'basico',
  PRO: 'pro',
  EMPRESARIAL: 'empresarial',
};

export function getUserPlan(user) {
  return (user?.plano || PLAN_IDS.BASICO).toLowerCase();
}

export function isBasic(user) {
  return getUserPlan(user) === PLAN_IDS.BASICO;
}

// Exportação em PDF: permitido para Pro e Empresarial
export function canExportPDF(user) {
  return !isBasic(user);
}

// Acesso a fornecedores: bloqueado no Básico
export function canAccessSuppliers(user) {
  return !isBasic(user);
}

import { PLAN_LIMITS } from '../data/constants';

// Limite de orçamentos definido em constants
export function canCreateNewBudget(user, userBudgetCount = 0) {
  if (isBasic(user)) {
    const limit = PLAN_LIMITS?.basico ?? 3;
    return userBudgetCount < limit;
  }
  return true;
}

export function getBudgetLimit(user) {
  return isBasic(user) ? (PLAN_LIMITS?.basico ?? 3) : null;
}