import { CategoriaDto } from './categorias.models';

const PALETA_CORES: readonly string[] = [
  'bg-cat-1 text-primary-foreground',
  'bg-cat-2 text-primary-foreground',
  'bg-cat-3 text-primary-foreground',
  'bg-cat-4 text-primary-foreground',
  'bg-cat-5 text-primary-foreground',
  'bg-cat-6 text-primary-foreground',
  'bg-cat-7 text-primary-foreground',
  'bg-cat-8 text-primary-foreground',
];

/** Única função a substituir quando a API passar a informar a cor da categoria. */
export function obterCorCategoria(categoria: CategoriaDto): string {
  return PALETA_CORES[somarCodigo(categoria.id) % PALETA_CORES.length];
}

function somarCodigo(id: string): number {
  let soma = 0;

  for (let indice = 0; indice < id.length; indice++) {
    soma += id.charCodeAt(indice);
  }

  return soma;
}
