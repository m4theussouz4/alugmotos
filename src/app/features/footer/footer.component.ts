import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Subject } from 'rxjs';
import { AdminModalComponent } from '../../shared/components/admin-modal/admin-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [AdminModalComponent, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() content: any;
  @Input() fullContent: any;

  user$: Subject<any>;
  showModal = false;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  } 

  async login() {
    const email = window.prompt('Digite o seu email:');
    if (!email) return;

    const password = window.prompt('Digite a sua senha:');
    if (!password) return;

    try {
      await this.authService.login(email, password);
      this.showModal = true;
    } catch (error) {
      alert('Erro no login. Verifique o email e a senha.');
    }
  }
}
