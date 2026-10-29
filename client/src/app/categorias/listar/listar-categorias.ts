import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideFolderOpen, LucidePencil, LucidePlus, LucideTrash } from '@lucide/angular';
import { ApiValidationProblemDetails } from '../../auth/auth.models';
import { NotasService } from '../../notas/notas.service';
import { UI } from '../../shared/ui/classes';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { EmptyState } from '../../shared/ui/empty-state';
import { obterCorCategoria } from '../categorias.cores';
import { CategoriaDto } from '../categorias.models';
import { CategoriasService } from '../categorias.service';

@Component({
  imports: [
    ConfirmDialog,
    EmptyState,
    LucideFolderOpen,
    LucidePencil,
    LucidePlus,
    LucideTrash,
    RouterLink,
  ],
  selector: 'app-listar-categorias',
  templateUrl: './listar-categorias.html',
})
export class ListarCategorias {
  private readonly categoriasService = inject(CategoriasService);
  private readonly notasService = inject(NotasService);

  protected readonly ui = UI;
  protected readonly corCategoria = obterCorCategoria;
  protected readonly categorias = signal<readonly CategoriaDto[]>([]);
  protected readonly carregando = signal(true);
  protected readonly mensagemErro = signal('');
  protected readonly contagemPorCategoria = signal<ReadonlyMap<string, number> | null>(null);
  protected readonly categoriaIdEmExclusao = signal<string | null>(null);
  protected readonly excluindo = signal(false);

  constructor() {
    this.carregarCategorias();
    this.carregarContagem();
  }

  protected inicial(titulo: string): string {
    return titulo.trim().charAt(0).toUpperCase();
  }

  protected abrirConfirmacao(categoriaId: string): void {
    if (this.excluindo()) return;

    this.mensagemErro.set('');
    this.categoriaIdEmExclusao.set(categoriaId);
  }

  protected cancelarExclusao(): void {
    if (this.excluindo()) return;

    this.categoriaIdEmExclusao.set(null);
  }

  protected confirmarExclusao(): void {
    const categoriaId = this.categoriaIdEmExclusao();

    if (!categoriaId || this.excluindo()) return;

    this.excluindo.set(true);
    this.mensagemErro.set('');

    this.categoriasService.excluir(categoriaId).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.categoriaIdEmExclusao.set(null);
        this.carregarCategorias();
        this.carregarContagem();
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErro.set(this.obterMensagemErroExclusao(resposta));
        this.excluindo.set(false);
      },
    });
  }

  private carregarCategorias(): void {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.categoriasService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregando.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErro.set(this.obterMensagemErro(resposta));
        this.carregando.set(false);
      },
    });
  }

  private carregarContagem(): void {
    this.notasService.listar().subscribe({
      next: (notas) => {
        const contagem = new Map<string, number>();

        for (const nota of notas) {
          for (const categoria of nota.categorias) {
            contagem.set(categoria.id, (contagem.get(categoria.id) ?? 0) + 1);
          }
        }

        this.contagemPorCategoria.set(contagem);
      },
      error: () => this.contagemPorCategoria.set(null),
    });
  }

  private obterMensagemErro(response: HttpErrorResponse): string {
    const problem = response.error as ApiValidationProblemDetails | null;

    return (
      problem?.detail ?? 'Não foi possível carregar as categorias. Tente novamente em instantes.'
    );
  }

  private obterMensagemErroExclusao(resposta: HttpErrorResponse): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;

    return problem?.detail ?? 'Não foi possível excluir a categoria. Tente novamente em instantes.';
  }
}
