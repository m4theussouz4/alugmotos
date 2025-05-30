import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-operating-range',
  imports: [CommonModule],
  templateUrl: './operating-range.component.html',
  styleUrl: './operating-range.component.scss'
})
export class OperatingRangeComponent implements AfterViewInit, OnDestroy {
  @Input() content: any;

  @ViewChild('mapContainer', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private center: L.LatLngExpression = [-22.755, -43.460];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: 7,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.content.ranges.forEach((rangeObj: any, index: number) => {
      const range = rangeObj.range;
      let color = 'green';
      if (index === 1) color = 'yellow';
      else if (index === 2) color = 'red';

      L.circle(this.center, { radius: range, color: color, fillOpacity: 0.2 }).addTo(this.map);
    });
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

  changeZoom(card: number): void {
    if (this.map) {
      if (card === 0) { this.map.setZoom(10) }
      else if (card === 1) { this.map.setZoom(9) }
      else if (card === 2) { this.map.setZoom(7) }
    }
  }

  downloadMap(card: number) {
    // pega os mapas do assets/pdfs
    if (card === 0) window.open('assets/pdfs/mapa-50km.pdf', '_blank');
    else if (card === 1) window.open('assets/pdfs/mapa-100km.pdf', '_blank');
    else if (card === 2) window.open('assets/pdfs/mapa-200km.pdf', '_blank');
  }
}
