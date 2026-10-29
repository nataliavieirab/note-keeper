import { Component, input } from '@angular/core';
import { LucideArchive, LucideCircleCheck } from '@lucide/angular';
import { StatusNota } from '../../notas/notas.models';

@Component({
  imports: [LucideArchive, LucideCircleCheck],
  selector: 'app-status-badge',
  host: { class: 'inline-flex' },
  template: `
    @if (status() === 'Ativa') {
      <span
        class="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success"
      >
        <svg lucideCircleCheck class="size-3.5" aria-hidden="true"></svg> Ativa
      </span>
    } @else {
      <span
        class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
      >
        <svg lucideArchive class="size-3.5" aria-hidden="true"></svg> Arquivada
      </span>
    }
  `,
})
export class StatusBadge {
  readonly status = input.required<StatusNota>();
}
