import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCalendar,
  LucideNotebookText,
  LucidePencil,
  LucideTrash,
} from '@lucide/angular';
import { ApiValidationProblemDetails } from '../../auth/auth.models';
import { NotaDto } from '../../notas/notas.models';
import { NotasService } from '../../notas/notas.service';
import { formatarData, formatarTempoRelativo } from '../../shared/datas';
import { UI } from '../../shared/ui/classes';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { EmptyState } from '../../shared/ui/empty-state';
import { StatusBadge } from '../../shared/ui/status-badge';
import { obterCorCategoria } from '../categorias.cores';
import { CategoriaDto } from '../categorias.models';
import { CategoriasService } from '../categorias.service';

@Component({
  imports: [
    ConfirmDialog,
    EmptyState,
    LucideArrowLeft,
    LucideCalendar,
    LucideNotebookText,
    LucidePencil,
    LucideTrash,
    RouterLink,
    StatusBadge,
  ],
  selector: 'app-detalhes-categoria',
  templateUrl: './detalhes-categoria.html',
})
export class DetalhesCategoria {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriasService = inject(CategoriasService);
  private readonly notasService = inject(NotasService);
  private readonly categoriaId: string | null;

  protected readonly ui = UI;
  protected readonly formatarData = formatarData;
  protected readonly formatarTempoRelativo = formatarTempoRelativo;
  protected readonly categoria = signal<CategoriaDto | null>(null);
  protected readonly corDaCategoria = computed(() => {
    const categoria = this.categoria();

    return categoria ? obterCorCategoria(categoria) : '';
  });
  protected readonly carregando = signal(true);
  protected readonly mensagemErro = signal('');
  protected readonly notas = signal<readonly NotaDto[]>([]);
  protected readonly carregandoNotas = signal(true);
  protected readonly mensagemErroNotas = signal('');
  protected readonly confirmandoExclusao = signal(false);
  protected readonly excluindo = signal(false);
  protected readonly textoExclusao = computed(() => {
    const titulo = this.categoria()?.titulo ?? 'esta categoria';

    return `A categoria “${titulo}” será excluída. Suas notas não serão excluídas — apenas deixarão de ter esta categoria.`;
  });

  constructor() {
    this.categoriaId = this.route.snapshot.paramMap.get('categoriaId');
    if (!this.categoriaId) {
      this.mensagemErro.set('Identificador da categoria inválida.');
      this.carregando.set(false);
      this.carregandoNotas.set(false);
      return;
    }

    this.carregarCoresCategorias();
    this.carregarNotas(this.categoriaId);

    this.categoriasService.obterPorId(this.categoriaId).subscribe({
      next: (categoria) => {
        this.categoria.set(categoria);
        this.carregando.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErro.set(this.obterMensagemErro(resposta));
        this.carregando.set(false);
      },
    });
  }

  protected abrirConfirmacao(): void {
    this.mensagemErro.set('');
    this.confirmandoExclusao.set(true);
  }

  protected cancelarExclusao(): void {
    if (this.excluindo()) return;
    this.confirmandoExclusao.set(false);
  }

  protected confirmarExclusao(): void {
    if (!this.categoriaId || this.excluindo()) return;
    this.excluindo.set(true);
    this.mensagemErro.set('');
    this.categoriasService.excluir(this.categoriaId).subscribe({
      next: () => {
        this.excluindo.set(false);
        void this.router.navigateByUrl('/categorias/listar');
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErro.set(this.obterMensagemErroExclusao(resposta));
        this.excluindo.set(false);
      },
    });
  }

  private carregarNotas(categoriaId: string): void {
    this.notasService.listar([categoriaId]).subscribe({
      next: (notas) => {
        this.notas.set(notas);
        this.carregandoNotas.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErroNotas.set(this.obterMensagemErroNotas(resposta));
        this.carregandoNotas.set(false);
      },
    });
  }

  private carregarCoresCategorias(): void {
    this.categoriasService.listar().subscribe({
      error: () => undefined,
    });
  }

  private obterMensagemErroExclusao(resposta: HttpErrorResponse): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;
    return problem?.detail ?? 'Não foi possível excluir a categoria. Tente novamente em instantes.';
  }

  private obterMensagemErroNotas(resposta: HttpErrorResponse): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;

    return problem?.detail ?? 'Não foi possível carregar as notas. Tente novamente em instantes.';
  }

  private obterMensagemErro(resposta: HttpErrorResponse): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;

    return (
      problem?.detail ?? 'Não foi possível carregar o categoria. Tente novamente em instantes.'
    );
  }
}
