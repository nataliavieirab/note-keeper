import { Component, computed, input } from '@angular/core';
import { obterCorCategoria } from '../../categorias/categorias.cores';
import { CategoriaDto } from '../../categorias/categorias.models';

/**
 * Atributo para `span`, `li`, `a` ou `button`. Em botões de seleção, ligue `[ativo]`
 * e `[attr.aria-pressed]` no próprio elemento.
 * Com `[colorido]`, o fundo usa sempre a cor da categoria; `[ativo]` só marca a seleção.
 */
@Component({
  selector: '[appCategoryBadge]',
  template: '{{ categoria().titulo }}',
  host: { '[class]': 'classes()' },
})
export class CategoryBadge {
  readonly categoria = input.required<CategoriaDto>();
  readonly tamanho = input<'sm' | 'md'>('sm');
  readonly ativo = input(true);
  readonly colorido = input(false);

  protected readonly classes = computed(() => {
    const tamanho = this.tamanho() === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm';
    const cor =
      this.ativo() || this.colorido()
        ? obterCorCategoria(this.categoria())
        : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground';
    const selecao =
      this.colorido() && this.ativo()
        ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground'
        : '';

    return `inline-block max-w-full truncate rounded-full align-middle font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${tamanho} ${cor} ${selecao}`;
  });
}
