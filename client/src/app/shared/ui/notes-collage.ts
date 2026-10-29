import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notes-collage',
  host: {
    'aria-hidden': 'true',
    class: 'relative mx-auto block w-full max-w-md',
  },
  template: `
    <div
      class="absolute top-6 left-2 w-56 -rotate-6 rounded-2xl p-5 shadow-card ring-1 ring-border"
      [class]="fundoCartao()"
    >
      <span class="rounded-full bg-cat-2 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
        >Ideias</span
      >
      <div class="mt-4 h-2.5 w-3/4 rounded-full bg-foreground/80"></div>
      <div class="mt-3 h-2 w-full rounded-full bg-muted"></div>
      <div class="mt-2 h-2 w-5/6 rounded-full bg-muted"></div>
    </div>
    <div
      class="absolute top-0 right-0 w-52 rotate-3 rounded-2xl p-5 shadow-card ring-1 ring-border"
      [class]="fundoCartao()"
    >
      <span class="rounded-full bg-cat-1 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
        >Trabalho</span
      >
      <div class="mt-4 h-2.5 w-2/3 rounded-full bg-foreground/80"></div>
      <div class="mt-3 h-2 w-full rounded-full bg-muted"></div>
      <div class="mt-2 h-2 w-1/2 rounded-full bg-muted"></div>
    </div>
    <div
      class="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rotate-1 rounded-2xl p-5 shadow-float ring-1 ring-border"
      [class]="fundoCartao()"
    >
      <div class="flex gap-1.5">
        <span
          class="rounded-full bg-cat-5 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
          >Pessoal</span
        >
        <span
          class="rounded-full bg-cat-6 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
          >Viagem</span
        >
      </div>
      <div class="mt-4 h-2.5 w-4/5 rounded-full bg-foreground/80"></div>
      <div class="mt-3 h-2 w-full rounded-full bg-muted"></div>
      <div class="mt-2 h-2 w-2/3 rounded-full bg-muted"></div>
    </div>
    <div class="absolute bottom-16 -left-4 size-10 rounded-full bg-cat-7/70 blur-[1px]"></div>
    <div class="absolute right-[-0.5rem] bottom-24 size-6 rounded-full bg-cat-4/80"></div>
  `,
})
export class NotesCollage {
  readonly naMarca = input(false);

  protected fundoCartao(): string {
    return this.naMarca() ? 'bg-card/95' : 'bg-card';
  }
}
