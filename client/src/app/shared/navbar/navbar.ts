import { afterNextRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { LucideLogOut, LucideMenu, LucideNotebookPen, LucideSearch, LucideX } from '@lucide/angular';
import { filter, map } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BTN_GHOST, BTN_PRIMARY } from '../ui/classes';

const CONSULTA_DESKTOP = '(min-width: 768px)';

@Component({
  imports: [LucideLogOut, LucideMenu, LucideNotebookPen, LucideSearch, LucideX, RouterLink],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  host: { class: 'sticky top-0 z-20 block' },
})
export class Navbar {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly campoBusca = viewChild<ElementRef<HTMLInputElement>>('campoBusca');
  private readonly campoBuscaMenu = viewChild<ElementRef<HTMLInputElement>>('campoBuscaMenu');

  protected readonly authService = inject(AuthService);
  protected readonly sessaoAutenticada = this.authService.sessao;
  protected readonly classesEntrar = BTN_GHOST;
  protected readonly classesCriarConta = BTN_PRIMARY;
  protected readonly links = [
    { rota: '/notas/listar', prefixo: '/notas', rotulo: 'Notas' },
    { rota: '/categorias/listar', prefixo: '/categorias', rotulo: 'Categorias' },
  ] as const;

  protected readonly termoBusca = toSignal(
    this.route.queryParamMap.pipe(map((parametros) => parametros.get('busca') ?? '')),
    { initialValue: '' },
  );
  private readonly urlAtual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly menuAberto = signal(false);

  constructor() {
    const focarCampoBusca = this.router.currentNavigation()?.extras.state?.['focarBusca'] === true;

    if (focarCampoBusca && !window.matchMedia(CONSULTA_DESKTOP).matches) {
      this.menuAberto.set(true);
    }

    let caminhoAnterior = this.caminho(this.router.url);

    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((evento) => {
        const caminho = this.caminho(evento.urlAfterRedirects);

        if (caminho !== caminhoAnterior) this.menuAberto.set(false);
        caminhoAnterior = caminho;
      });

    afterNextRender(() => {
      if (!focarCampoBusca) return;

      const campo = window.matchMedia(CONSULTA_DESKTOP).matches
        ? this.campoBusca()?.nativeElement
        : this.campoBuscaMenu()?.nativeElement;
      if (!campo) return;

      campo.focus();
      const fim = campo.value.length;
      campo.setSelectionRange(fim, fim);
    });
  }

  protected linkAtivo(prefixo: string): boolean {
    const caminho = this.caminho(this.urlAtual());

    return caminho === prefixo || caminho.startsWith(`${prefixo}/`);
  }

  private caminho(url: string): string {
    return url.split(/[?#]/)[0];
  }

  protected classesLink(prefixo: string): string {
    const base =
      'rounded-lg px-5 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    return this.linkAtivo(prefixo)
      ? `${base} bg-card text-foreground shadow-card`
      : `${base} text-muted-foreground hover:text-foreground`;
  }

  protected classesLinkMenu(prefixo: string): string {
    const base =
      'block rounded-lg px-3 py-3 font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

    return this.linkAtivo(prefixo) ? `${base} bg-muted text-foreground` : `${base} text-foreground`;
  }

  protected inicialUsuario(nome: string, email: string): string {
    return (nome.trim() || email).charAt(0);
  }

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected sair(): void {
    this.menuAberto.set(false);
    this.authService.encerrarSessao();
  }

  protected atualizarBusca(termo: string): void {
    if (termo === this.termoBusca()) return;

    const jaNaListagem = this.caminho(this.router.url) === '/notas/listar';

    void this.router.navigate(['/notas/listar'], {
      queryParams: { busca: termo || null },
      replaceUrl: true,
      state: jaNaListagem ? undefined : { focarBusca: true },
    });
  }
}
