import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ogloszenia',
  standalone: true,
  imports: [],
  templateUrl: './ogloszenia.component.html',
  styleUrl: './ogloszenia.component.css',
})
export class OgloszeniaComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;

  public content: string = '';

  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/ogloszenia/${params['date']}.html`, {
          responseType: 'text',
        })
        .subscribe((data) => {
          that.content = data;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
