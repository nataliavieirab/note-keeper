import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideNotebookPen } from '@lucide/angular';
import { NotesCollage } from '../../shared/ui/notes-collage';

@Component({
  imports: [LucideNotebookPen, NotesCollage, RouterLink, RouterOutlet],
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.html',
})
export class AuthShell {}
