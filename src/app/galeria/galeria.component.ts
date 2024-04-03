import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;

  public content: string = '';

  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/zdjecia.json`, {
          responseType: 'text',
        })
        .subscribe((data) => {
          // TODO parsowanie pliku i wyświetlenie galerii
          that.content = data;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
