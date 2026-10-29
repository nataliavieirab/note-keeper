import { signal } from '@angular/core';
import { CategoriaDto } from './categorias.models';

const CHAVE_CORES_CATEGORIAS = 'notekeeper.cores-categorias';
const VERSAO_ATRIBUICOES = 2;

const PALETA_CORES: readonly string[] = [
  'bg-cat-1 text-primary-foreground',
  'bg-cat-2 text-primary-foreground',
  'bg-cat-3 text-primary-foreground',
  'bg-cat-4 text-primary-foreground',
  'bg-cat-5 text-primary-foreground',
  'bg-cat-6 text-primary-foreground',
  'bg-cat-7 text-primary-foreground',
  'bg-cat-8 text-primary-foreground',
  'bg-cat-9 text-primary-foreground',
  'bg-cat-10 text-primary-foreground',
  'bg-cat-11 text-primary-foreground',
  'bg-cat-12 text-primary-foreground',
  'bg-cat-13 text-primary-foreground',
  'bg-cat-14 text-primary-foreground',
  'bg-cat-15 text-primary-foreground',
  'bg-cat-16 text-primary-foreground',
  'bg-cat-17 text-primary-foreground',
  'bg-cat-18 text-primary-foreground',
  'bg-cat-19 text-primary-foreground',
];

const atribuicoes = signal<Readonly<Record<string, number>>>(lerAtribuicoes());

/** Única função a substituir quando a API passar a informar a cor da categoria. */
export function obterCorCategoria(categoria: CategoriaDto): string {
  const indice = atribuicoes()[categoria.id];

  return PALETA_CORES[indice ?? indiceProvisorio(categoria.id)];
}

/** Guarda a cor já usada e entrega um tom livre às categorias novas. */
export function sincronizarCoresCategorias(categorias: readonly CategoriaDto[]): void {
  const mapa = montarAtribuicoes(
    categorias.map((categoria) => categoria.id),
    atribuicoes(),
    PALETA_CORES.length,
  );

  atribuicoes.set(mapa);
  salvarAtribuicoes(mapa);
}

function montarAtribuicoes(
  ids: readonly string[],
  anteriores: Readonly<Record<string, number>>,
  tamanho: number,
): Record<string, number> {
  const mapa: Record<string, number> = {};
  const uso = Array.from({ length: tamanho }, () => 0);

  for (const id of ids) {
    const indice = anteriores[id];

    if (indice === undefined || indice < 0 || indice >= tamanho) continue;

    mapa[id] = indice;
    uso[indice]++;
  }

  const novas = ids.filter((id) => mapa[id] === undefined).sort(compararIdentificadores);

  for (const id of novas) {
    const indice = indiceMenosUsado(uso);
    mapa[id] = indice;
    uso[indice]++;
  }

  return mapa;
}

function indiceMenosUsado(uso: readonly number[]): number {
  let escolhido = 0;

  for (let indice = 1; indice < uso.length; indice++) {
    if (uso[indice] < uso[escolhido]) escolhido = indice;
  }

  return escolhido;
}

function compararIdentificadores(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
}

function indiceProvisorio(id: string): number {
  let soma = 0;

  for (let indice = 0; indice < id.length; indice++) {
    soma += id.charCodeAt(indice);
  }

  return soma % PALETA_CORES.length;
}

function lerAtribuicoes(): Record<string, number> {
  try {
    const bruto = localStorage.getItem(CHAVE_CORES_CATEGORIAS);

    if (!bruto) return {};

    const dados = JSON.parse(bruto) as unknown;

    if (!eAtribuicaoVersionada(dados)) {
      localStorage.removeItem(CHAVE_CORES_CATEGORIAS);
      return {};
    }

    const mapa: Record<string, number> = {};

    for (const [id, indice] of Object.entries(dados.atribuicoes)) {
      if (
        typeof indice !== 'number' ||
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= PALETA_CORES.length
      ) {
        continue;
      }

      mapa[id] = indice;
    }

    return mapa;
  } catch {
    return {};
  }
}

function eAtribuicaoVersionada(
  dados: unknown,
): dados is { versao: typeof VERSAO_ATRIBUICOES; atribuicoes: Record<string, number> } {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return false;

  const armazenado = dados as { versao?: unknown; atribuicoes?: unknown };

  return (
    armazenado.versao === VERSAO_ATRIBUICOES &&
    !!armazenado.atribuicoes &&
    typeof armazenado.atribuicoes === 'object' &&
    !Array.isArray(armazenado.atribuicoes)
  );
}

function salvarAtribuicoes(mapa: Readonly<Record<string, number>>): void {
  try {
    localStorage.setItem(
      CHAVE_CORES_CATEGORIAS,
      JSON.stringify({ versao: VERSAO_ATRIBUICOES, atribuicoes: mapa }),
    );
  } catch {
    return;
  }
}
