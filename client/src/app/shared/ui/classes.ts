export type VarianteBotao = 'primary' | 'outline' | 'ghost' | 'danger';

const BASE_BOTAO =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const VARIANTES_BOTAO: Record<VarianteBotao, string> = {
  primary: 'bg-brand text-primary-foreground shadow-float hover:brightness-110',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  danger:
    'border border-border bg-card text-destructive hover:bg-destructive hover:text-destructive-foreground',
};

export function btnCls(variante: VarianteBotao = 'primary'): string {
  return `${BASE_BOTAO} ${VARIANTES_BOTAO[variante]}`;
}

export const BTN_PRIMARY = btnCls('primary');
export const BTN_OUTLINE = btnCls('outline');
export const BTN_GHOST = btnCls('ghost');
export const BTN_DANGER = btnCls('danger');

const BASE_INPUT =
  'w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-4 focus:ring-accent';

export function inputCls(invalido: boolean): string {
  return invalido
    ? `${BASE_INPUT} border-destructive`
    : `${BASE_INPUT} border-input focus:border-primary`;
}

export const LABEL_CLS = 'flex justify-between text-sm font-semibold text-foreground';
export const ERRO_CAMPO_CLS = 'mt-1.5 block text-xs font-medium text-destructive';
export const DICA_CAMPO_CLS = 'mt-1.5 block text-xs text-muted-foreground';
export const ALERTA_ERRO_CLS =
  'rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm whitespace-pre-line text-destructive';
export const ALERTA_SUCESSO_CLS =
  'rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm text-success';
export const PAINEL_CLS = 'rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8';
export const LINK_CLS =
  'rounded font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export const UI = {
  botaoPrimario: BTN_PRIMARY,
  botaoContorno: BTN_OUTLINE,
  botaoFantasma: BTN_GHOST,
  botaoPerigo: BTN_DANGER,
  label: LABEL_CLS,
  erroCampo: ERRO_CAMPO_CLS,
  dicaCampo: DICA_CAMPO_CLS,
  alertaErro: ALERTA_ERRO_CLS,
  alertaSucesso: ALERTA_SUCESSO_CLS,
  painel: PAINEL_CLS,
  link: LINK_CLS,
} as const;
