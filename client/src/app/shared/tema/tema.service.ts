import { Service, signal } from '@angular/core';

const CHAVE_TEMA = 'notekeeper.tema';

@Service()
export class TemaService {
  private readonly escuroState = signal(document.documentElement.classList.contains('dark'));
  readonly escuro = this.escuroState.asReadonly();

  alternar(): void {
    const proximo = !this.escuroState();
    this.escuroState.set(proximo);
    document.documentElement.classList.toggle('dark', proximo);

    try {
      localStorage.setItem(CHAVE_TEMA, proximo ? 'dark' : 'light');
    } catch {
      /* storage unavailable: theme still applies for this session */
    }
  }
}
