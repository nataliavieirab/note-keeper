import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideCalendar,
  LucideFileText,
  LucidePencil,
  LucidePlus,
  LucideSearch,
  LucideTrash,
  LucideX,
} from '@lucide/angular';
import { map } from 'rxjs';
import { ApiValidationProblemDetails } from '../../auth/auth.models';
import { CategoriaDto } from '../../categorias/categorias.models';
import { CategoriasService } from '../../categorias/categorias.service';
import { formatarData, formatarTempoRelativo } from '../../shared/datas';
import { Navbar } from '../../shared/navbar/navbar';
import { CategoryBadge } from '../../shared/ui/category-badge';
import { UI } from '../../shared/ui/classes';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { EmptyState } from '../../shared/ui/empty-state';
import { StatusBadge } from '../../shared/ui/status-badge';
import { NotaDto } from '../notas.models';
import { NotasService } from '../notas.service';

function normalizarTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Component({
  imports: [
    CategoryBadge,
    ConfirmDialog,
    EmptyState,
    LucideCalendar,
    LucideFileText,
    LucidePencil,
    LucidePlus,
    LucideSearch,
    LucideTrash,
    LucideX,
    Navbar,
    RouterLink,
    StatusBadge,
  ],
  selector: 'app-listar-notas',
  templateUrl: './listar-notas.html',
  host: { class: 'block' },
})
export class ListarNotas {
  private readonly notasService = inject(NotasService);
  private readonly categoriasService = inject(CategoriasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private requisicaoNotas = 0;

  protected readonly ui = UI;
  protected readonly formatarData = formatarData;
  protected readonly formatarTempoRelativo = formatarTempoRelativo;
  protected readonly esqueleto = [1, 2, 3, 4, 5, 6];

  protected readonly notas = signal<readonly NotaDto[]>([]);
  protected readonly carregando = signal(true);
  protected readonly mensagemErro = signal('');
  protected readonly categorias = signal<readonly CategoriaDto[]>([]);
  protected readonly carregandoCategorias = signal(true);
  protected readonly categoriasCarregadas = signal(false);
  protected readonly mensagemErroCategorias = signal('');
  protected readonly categoriaIdsSelecionadas = signal<readonly string[]>([]);
  protected readonly notaIdEmExclusao = signal<string | null>(null);
  protected readonly excluindo = signal(false);
  protected readonly termoBusca = toSignal(
    this.route.queryParamMap.pipe(map((parametros) => parametros.get('busca') ?? '')),
    { initialValue: '' },
  );
  protected readonly notasFiltradas = computed(() => {
    const termo = normalizarTexto(this.termoBusca().trim());
    const notas = this.notas();

    if (!termo) return notas;

    return notas.filter((nota) => normalizarTexto(nota.titulo).includes(termo));
  });
  protected readonly temCriterios = computed(
    () => this.categoriaIdsSelecionadas().length > 0 || this.termoBusca().trim().length > 0,
  );

  constructor() {
    this.carregarCategorias();
    this.carregarNotas();
  }

  protected categoriaSelecionada(categoriaId: string): boolean {
    return this.categoriaIdsSelecionadas().includes(categoriaId);
  }

  protected alternarCategoria(categoriaId: string): void {
    if (this.excluindo()) return;

    const selecionada = !this.categoriaSelecionada(categoriaId);

    this.categoriaIdsSelecionadas.update((ids) => {
      if (selecionada) {
        return ids.includes(categoriaId) ? ids : [...ids, categoriaId];
      }

      return ids.filter((id) => id !== categoriaId);
    });

    this.carregarNotas();
  }

  protected limparBuscaEFiltros(): void {
    if (this.excluindo()) return;

    const tinhaCategorias = this.categoriaIdsSelecionadas().length > 0;
    this.categoriaIdsSelecionadas.set([]);

    if (tinhaCategorias) this.carregarNotas();

    void this.router.navigate(['/notas/listar'], {
      queryParams: { busca: null },
      replaceUrl: true,
    });
  }

  protected dataDaNota(nota: NotaDto): string {
    return nota.atualizadoEm || nota.criadoEm;
  }

  protected abrirConfirmacao(notaId: string): void {
    if (this.excluindo()) return;

    this.mensagemErro.set('');
    this.notaIdEmExclusao.set(notaId);
  }

  protected cancelarExclusao(): void {
    if (this.excluindo()) return;

    this.notaIdEmExclusao.set(null);
  }

  protected confirmarExclusao(): void {
    const notaId = this.notaIdEmExclusao();

    if (!notaId || this.excluindo()) return;

    this.excluindo.set(true);
    this.mensagemErro.set('');

    this.notasService.excluir(notaId).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.notaIdEmExclusao.set(null);
        this.carregarNotas();
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErro.set(
          this.obterMensagemErro(
            resposta,
            'Não foi possível excluir a nota. Tente novamente em instantes.',
          ),
        );
        this.excluindo.set(false);
      },
    });
  }

  private carregarCategorias(): void {
    this.carregandoCategorias.set(true);
    this.mensagemErroCategorias.set('');

    this.categoriasService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.categoriasCarregadas.set(true);
        this.carregandoCategorias.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErroCategorias.set(
          this.obterMensagemErro(
            resposta,
            'Não foi possível carregar as categorias. Tente novamente em instantes.',
          ),
        );
        this.carregandoCategorias.set(false);
      },
    });
  }

  private carregarNotas(): void {
    const requisicao = ++this.requisicaoNotas;
    const categoriaIds = this.categoriaIdsSelecionadas();

    if (!this.excluindo()) {
      this.notaIdEmExclusao.set(null);
    }

    this.carregando.set(true);
    this.mensagemErro.set('');

    this.notasService.listar(categoriaIds.length > 0 ? categoriaIds : undefined).subscribe({
      next: (notas) => {
        if (requisicao !== this.requisicaoNotas) return;

        this.notas.set(notas);
        this.carregando.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        if (requisicao !== this.requisicaoNotas) return;

        this.notas.set([]);
        this.mensagemErro.set(
          this.obterMensagemErro(
            resposta,
            'Não foi possível carregar as notas. Tente novamente em instantes.',
          ),
        );
        this.carregando.set(false);
      },
    });
  }

  private obterMensagemErro(resposta: HttpErrorResponse, mensagemPadrao: string): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;

    return problem?.detail ?? mensagemPadrao;
  }
}
