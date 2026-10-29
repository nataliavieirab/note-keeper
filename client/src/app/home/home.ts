import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideFolderOpen,
  LucideNotebookText,
  LucidePenLine,
  LucidePlus,
  LucideSearch,
  LucideTags,
} from '@lucide/angular';
import { ApiValidationProblemDetails } from '../auth/auth.models';
import { AuthService } from '../auth/auth.service';
import { CategoriaDto } from '../categorias/categorias.models';
import { CategoriasService } from '../categorias/categorias.service';
import { NotaDto } from '../notas/notas.models';
import { NotasService } from '../notas/notas.service';
import { formatarData, formatarTempoRelativo } from '../shared/datas';
import { Navbar } from '../shared/navbar/navbar';
import { CategoryBadge } from '../shared/ui/category-badge';
import { UI } from '../shared/ui/classes';
import { NotesCollage } from '../shared/ui/notes-collage';
import { StatusBadge } from '../shared/ui/status-badge';

const QUANTIDADE_NOTAS_RECENTES = 3;

@Component({
  imports: [
    CategoryBadge,
    LucideArrowRight,
    LucideFolderOpen,
    LucideNotebookText,
    LucidePenLine,
    LucidePlus,
    LucideSearch,
    LucideTags,
    Navbar,
    NotesCollage,
    RouterLink,
    StatusBadge,
  ],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  private readonly notasService = inject(NotasService);
  private readonly categoriasService = inject(CategoriasService);

  protected readonly authService = inject(AuthService);
  protected readonly sessaoAutenticada = this.authService.sessao;
  protected readonly ui = UI;
  protected readonly formatarData = formatarData;
  protected readonly formatarTempoRelativo = formatarTempoRelativo;

  protected readonly notas = signal<readonly NotaDto[]>([]);
  protected readonly categorias = signal<readonly CategoriaDto[]>([]);
  protected readonly carregandoNotas = signal(true);
  protected readonly carregandoCategorias = signal(true);
  protected readonly mensagemErroNotas = signal('');
  protected readonly mensagemErroCategorias = signal('');

  protected readonly carregando = computed(
    () => this.carregandoNotas() || this.carregandoCategorias(),
  );
  protected readonly totalAtivas = computed(
    () => this.notas().filter((nota) => nota.status === 'Ativa').length,
  );
  protected readonly notasRecentes = computed(() =>
    [...this.notas()]
      .sort((a, b) => this.instante(b) - this.instante(a))
      .slice(0, QUANTIDADE_NOTAS_RECENTES),
  );

  protected readonly recursos = [
    {
      icone: 'escrever',
      titulo: 'Escreva rápido',
      texto: 'Guarde ideias importantes em segundos.',
    },
    {
      icone: 'categorias',
      titulo: 'Organize por categorias',
      texto: 'Cores automáticas para cada assunto.',
    },
    {
      icone: 'buscar',
      titulo: 'Encontre na hora',
      texto: 'Busque e filtre suas notas facilmente.',
    },
  ] as const;

  constructor() {
    if (!this.sessaoAutenticada()) return;

    this.notasService.listar().subscribe({
      next: (notas) => {
        this.notas.set(notas);
        this.carregandoNotas.set(false);
      },
      error: (resposta: HttpErrorResponse) => {
        this.mensagemErroNotas.set(
          this.obterMensagemErro(
            resposta,
            'Não foi possível carregar as notas. Tente novamente em instantes.',
          ),
        );
        this.carregandoNotas.set(false);
      },
    });

    this.categoriasService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
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

  protected dataDaNota(nota: NotaDto): string {
    return nota.atualizadoEm || nota.criadoEm;
  }

  protected plural(quantidade: number, singular: string, plural: string): string {
    return `${quantidade} ${quantidade === 1 ? singular : plural}`;
  }

  private instante(nota: NotaDto): number {
    const tempo = new Date(this.dataDaNota(nota)).getTime();

    return Number.isNaN(tempo) ? 0 : tempo;
  }

  private obterMensagemErro(resposta: HttpErrorResponse, mensagemPadrao: string): string {
    const problem = resposta.error as ApiValidationProblemDetails | null;

    return problem?.detail ?? mensagemPadrao;
  }
}
