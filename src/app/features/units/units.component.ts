import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-units',
  imports: [],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {
  @Input() content: any;

  openWpp(phone: string) {
    const telefone ='55' + phone.replace(/\D/g, '');
    const link = `https://wa.me/${telefone}?text=Olá! quero reservar uma moto.`;
    window.open(link, '_blank');
  }
}
