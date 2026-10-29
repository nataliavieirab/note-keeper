import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { BTN_GHOST } from './classes';

let proximoId = 0;

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <dialog
      #dialogo
      class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-6 text-foreground shadow-float backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      [attr.aria-labelledby]="idTitulo"
      [attr.aria-describedby]="idTexto"
      [attr.aria-busy]="pendente()"
      (cancel)="aoCancelarNativo($event)"
      (click)="aoClicarFundo($event)"
    >
      <h2 [id]="idTitulo" class="text-lg font-bold tracking-tight">{{ titulo() }}</h2>
      <p [id]="idTexto" class="mt-2 text-sm text-muted-foreground">{{ texto() }}</p>
      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" [class]="classesCancelar" [disabled]="pendente()" (click)="cancelar.emit()">
          Cancelar
        </button>
        <button
          type="button"
          [class]="classesConfirmar"
          [disabled]="pendente()"
          (click)="confirmar.emit()"
        >
          {{ pendente() ? rotuloPendente() : rotuloConfirmar() }}
        </button>
      </div>
    </dialog>
  `,
})
export class ConfirmDialog {
  readonly aberto = input(false);
  readonly titulo = input.required<string>();
  readonly texto = input.required<string>();
  readonly rotuloConfirmar = input.required<string>();
  readonly rotuloPendente = input('Excluindo...');
  readonly pendente = input(false);

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  private readonly dialogo = viewChild<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly id = ++proximoId;
  protected readonly idTitulo = `confirmacao-${this.id}-titulo`;
  protected readonly idTexto = `confirmacao-${this.id}-texto`;
  protected readonly classesCancelar = BTN_GHOST;
  protected readonly classesConfirmar =
    'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  constructor() {
    effect(() => {
      const dialogo = this.dialogo()?.nativeElement;
      if (!dialogo) return;

      if (this.aberto() && !dialogo.open) dialogo.showModal();
      if (!this.aberto() && dialogo.open) dialogo.close();
    });
  }

  protected aoCancelarNativo(evento: Event): void {
    evento.preventDefault();

    if (!this.pendente()) this.cancelar.emit();
  }

  protected aoClicarFundo(evento: MouseEvent): void {
    const dialogo = this.dialogo()?.nativeElement;
    if (!dialogo || evento.target !== dialogo || this.pendente()) return;

    const area = dialogo.getBoundingClientRect();
    const dentro =
      evento.clientX >= area.left &&
      evento.clientX <= area.right &&
      evento.clientY >= area.top &&
      evento.clientY <= area.bottom;

    if (!dentro) this.cancelar.emit();
  }
}
