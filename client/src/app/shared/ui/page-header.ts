import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';

/** Projete o ícone do bloco colorido como conteúdo. */
@Component({
  imports: [LucideArrowLeft, RouterLink],
  selector: 'app-page-header',
  host: { class: 'mb-8 block' },
  template: `
    <a
      [routerLink]="voltarPara()"
      class="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <svg lucideArrowLeft class="size-4" aria-hidden="true"></svg>
      {{ voltarRotulo() }}
    </a>
    <div class="mt-4 flex items-center gap-4">
      <span
        class="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-float"
        aria-hidden="true"
      >
        <ng-content />
      </span>
      <div class="min-w-0">
        <h1 [id]="tituloId()" class="text-3xl font-bold tracking-tight text-foreground">
          {{ titulo() }}
        </h1>
        @if (subtitulo()) {
          <p class="mt-1 text-muted-foreground">{{ subtitulo() }}</p>
        }
      </div>
    </div>
  `,
})
export class PageHeader {
  readonly voltarPara = input.required<string>();
  readonly voltarRotulo = input.required<string>();
  readonly titulo = input.required<string>();
  readonly subtitulo = input('');
  readonly tituloId = input<string | null>(null);
}
