import { Component, input } from '@angular/core';

/** Projete o ícone com o atributo `icone` e a ação com `acao`. */
@Component({
  selector: 'app-empty-state',
  host: { class: 'block' },
  template: `
    <div
      class="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"
    >
      <div
        class="mb-4 grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground"
        aria-hidden="true"
      >
        <ng-content select="[icone]" />
      </div>
      <h2 class="font-semibold text-foreground">{{ titulo() }}</h2>
      @if (texto()) {
        <p class="mt-1 max-w-sm text-sm text-muted-foreground">{{ texto() }}</p>
      }
      <div class="mt-5 empty:hidden"><ng-content select="[acao]" /></div>
    </div>
  `,
})
export class EmptyState {
  readonly titulo = input.required<string>();
  readonly texto = input('');
}
