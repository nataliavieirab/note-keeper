import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { AuthShell } from '../shell/auth-shell';
import { RouterLink } from '@angular/router';

@Component({
  imports: [LucideArrowRight, AuthShell, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly tituloPagina = viewChild<ElementRef<HTMLHeadingElement>>('tituloPagina');

  constructor() {
    afterNextRender(() => this.tituloPagina()?.nativeElement.focus());
  }
}
