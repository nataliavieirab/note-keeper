import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideFolderOpen, LucidePlus } from '@lucide/angular';
import { ApiValidationProblemDetails } from '../../auth/auth.models';
import { NotasService } from '../../notas/notas.service';
import { EmptyState } from '../../shared/ui/empty-state';
import { UI } from '../../shared/ui/classes';
import { obterCorCategoria } from '../categorias.cores';
import { CategoriaDto } from '../categorias.models';
import { CategoriasService } from '../categorias.service';

@Component({
  imports: [EmptyState, LucideFolderOpen, LucidePlus, RouterLink],
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

  constructor() {
    this.carregarCategorias();
    this.carregarContagem();
  }

  protected inicial(titulo: string): string {
    return titulo.trim().charAt(0).toUpperCase();
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
}
