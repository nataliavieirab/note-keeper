import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notes-collage',
  host: {
    'aria-hidden': 'true',
    class: 'relative mx-auto block w-full max-w-md',
  },
  template: `
    <div
      class="pointer-events-none absolute top-6 left-2 size-56 rounded-full blur-3xl"
      [class]="naMarca() ? 'bg-primary-foreground/30' : 'bg-primary/35'"
    ></div>
    <div
      class="pointer-events-none absolute right-0 bottom-8 size-56 rounded-full blur-3xl"
      [class]="naMarca() ? 'bg-primary-foreground/20' : 'bg-primary-glow/40'"
    ></div>
    <div class="absolute bottom-16 -left-4 size-10 rounded-full bg-cat-7/70 blur-[1px]"></div>
    <div class="absolute right-[-0.5rem] bottom-24 size-6 rounded-full bg-cat-4/80"></div>

    <div class="absolute top-6 left-2 w-56 -rotate-6 perspective-[1000px]">
      <div
        class="glass-card rounded-2xl p-5"
        [class]="classeCartao()"
        style="--brilho: var(--cat-2)"
        (mousemove)="inclinar($event, cartaoIdeias)"
        (mouseleave)="repousar(cartaoIdeias)"
        #cartaoIdeias
      >
        <span [class]="etiqueta + ' bg-cat-2/85'">Ideias</span>
        <div class="relative z-10 mt-4 h-2.5 w-3/4 rounded-full" [class]="tracoTitulo()"></div>
        <div class="relative z-10 mt-3 h-2 w-full rounded-full" [class]="tracoTexto()"></div>
        <div class="relative z-10 mt-2 h-2 w-5/6 rounded-full" [class]="tracoTexto()"></div>
        <div class="glow"></div>
      </div>
    </div>

    <div class="absolute top-0 right-0 w-52 rotate-3 perspective-[1000px]">
      <div
        class="glass-card rounded-2xl p-5"
        [class]="classeCartao()"
        style="--brilho: var(--cat-1)"
        (mousemove)="inclinar($event, cartaoTrabalho)"
        (mouseleave)="repousar(cartaoTrabalho)"
        #cartaoTrabalho
      >
        <span [class]="etiqueta + ' bg-cat-1/85'">Trabalho</span>
        <div class="relative z-10 mt-4 h-2.5 w-2/3 rounded-full" [class]="tracoTitulo()"></div>
        <div class="relative z-10 mt-3 h-2 w-full rounded-full" [class]="tracoTexto()"></div>
        <div class="relative z-10 mt-2 h-2 w-1/2 rounded-full" [class]="tracoTexto()"></div>
        <div class="glow"></div>
      </div>
    </div>

    <div class="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rotate-1 perspective-[1000px]">
      <div
        class="glass-card rounded-2xl p-5"
        [class]="classeCartao()"
        style="--brilho: var(--cat-5)"
        (mousemove)="inclinar($event, cartaoPessoal)"
        (mouseleave)="repousar(cartaoPessoal)"
        #cartaoPessoal
      >
        <div class="flex gap-1.5">
          <span [class]="etiqueta + ' bg-cat-5/85'">Pessoal</span>
          <span [class]="etiqueta + ' bg-cat-6/85'">Viagem</span>
        </div>
        <div class="relative z-10 mt-4 h-2.5 w-4/5 rounded-full" [class]="tracoTitulo()"></div>
        <div class="relative z-10 mt-3 h-2 w-full rounded-full" [class]="tracoTexto()"></div>
        <div class="relative z-10 mt-2 h-2 w-2/3 rounded-full" [class]="tracoTexto()"></div>
        <div class="glow"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .glass-card {
        position: relative;
        background: rgb(255 255 255 / 55%);
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        box-shadow: 0 10px 40px color-mix(in oklab, var(--foreground) 16%, transparent);
        overflow: hidden;
        transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
        transform-style: preserve-3d;
        transition: transform 0.1s ease;
      }

      :host-context(.dark) .glass-card {
        background: rgb(255 255 255 / 8%);
        box-shadow: 0 10px 40px rgb(0 0 0 / 45%);
      }

      .glass-card.na-marca,
      :host-context(.dark) .glass-card.na-marca {
        background: rgb(255 255 255 / 18%);
      }

      .glass-card::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        padding: 2px;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(
          var(--angle, 135deg),
          rgb(255 255 255 / 75%),
          rgb(255 255 255 / 8%) 46%,
          transparent
        );
        transition: background 0.2s ease;
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask-composite: exclude;
      }

      .glow {
        position: absolute;
        top: var(--y, 50%);
        left: var(--x, 50%);
        z-index: 0;
        width: 200px;
        height: 200px;
        pointer-events: none;
        background: radial-gradient(
          circle at center,
          var(--brilho, var(--primary-glow)),
          transparent 80%
        );
        transform: translate(-50%, -50%);
        opacity: 0;
        transition:
          top 0.1s,
          left 0.1s,
          opacity 0.3s ease;
      }

      .glass-card:hover .glow {
        opacity: 0.55;
      }

      @media (prefers-reduced-motion: reduce) {
        .glass-card,
        .glass-card::before,
        .glow {
          transition: none;
        }

        .glow {
          display: none;
        }
      }
    `,
  ],
})
export class NotesCollage {
  readonly naMarca = input(false);

  protected readonly etiqueta =
    'relative z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground ring-1 ring-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]';

  protected classeCartao(): string {
    return this.naMarca() ? 'na-marca' : '';
  }

  protected tracoTitulo(): string {
    const reflexo = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]';
    return this.naMarca() ? `bg-primary-foreground/80 ${reflexo}` : `bg-foreground/70 ${reflexo}`;
  }

  protected tracoTexto(): string {
    return this.naMarca() ? 'bg-primary-foreground/35' : 'bg-foreground/18';
  }

  protected inclinar(evento: MouseEvent, cartao: HTMLElement): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const retangulo = cartao.getBoundingClientRect();
    const x = evento.clientX - retangulo.left;
    const y = evento.clientY - retangulo.top;
    const centroX = retangulo.width / 2;
    const centroY = retangulo.height / 2;
    if (centroX === 0 || centroY === 0) {
      return;
    }

    const rotacaoX = ((y - centroY) / centroY) * 8;
    const rotacaoY = ((x - centroX) / centroX) * -8;

    cartao.style.setProperty('--x', `${x}px`);
    cartao.style.setProperty('--y', `${y}px`);
    cartao.style.setProperty('--rx', `${rotacaoX}deg`);
    cartao.style.setProperty('--ry', `${rotacaoY}deg`);
    cartao.style.setProperty('--angle', `${135 + rotacaoX - rotacaoY}deg`);
  }

  protected repousar(cartao: HTMLElement): void {
    cartao.style.removeProperty('--x');
    cartao.style.removeProperty('--y');
    cartao.style.removeProperty('--rx');
    cartao.style.removeProperty('--ry');
    cartao.style.removeProperty('--angle');
  }
}
