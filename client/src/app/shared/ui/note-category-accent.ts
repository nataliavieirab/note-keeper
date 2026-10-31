import { Component, computed, input } from '@angular/core';
import { obterCorCategoria } from '../../categorias/categorias.cores';
import { CategoriaDto } from '../../categorias/categorias.models';

const TOKEN_COR = /bg-cat-(\d+)/;

/** A classe `bg-cat-N` já aponta para `var(--cat-N)`. O gradiente reutiliza esse tom. */
function variavelDaCor(classe: string): string | null {
  const token = TOKEN_COR.exec(classe);
  return token ? `var(--cat-${token[1]})` : null;
}

/**
 * Faixa lateral fina do card.
 * Uma categoria usa a cor sólida já atribuída.
 * Várias categorias formam um gradiente contínuo, no mesmo ângulo do gradiente da marca.
 * Sem categorias, usa o gradiente principal (`bg-brand`).
 */
@Component({
  selector: 'app-note-category-accent',
  host: {
    class: 'pointer-events-none absolute inset-y-0 left-0 flex w-1.5 flex-col',
    'aria-hidden': 'true',
  },
  template: `
    @if (gradiente(); as imagem) {
      <span class="min-h-0 flex-1" [style.background-image]="imagem"></span>
    } @else if (corSolida(); as classe) {
      <span [class]="'min-h-0 flex-1 ' + classe"></span>
    } @else {
      <span class="min-h-0 flex-1 bg-brand"></span>
    }
  `,
})
export class NoteCategoryAccent {
  readonly categorias = input<readonly CategoriaDto[]>([]);

  private readonly cores = computed(() =>
    this.categorias().map((categoria) => obterCorCategoria(categoria)),
  );

  protected readonly corSolida = computed(() => (this.cores().length === 1 ? this.cores()[0] : ''));

  protected readonly gradiente = computed(() => {
    const cores = this.cores()
      .map(variavelDaCor)
      .filter((cor): cor is string => cor !== null);

    if (cores.length < 2) return '';

    return `linear-gradient(135deg, ${cores.join(', ')})`;
  });
}
