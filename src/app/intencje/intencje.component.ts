import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intencje',
  standalone: true,
  imports: [],
  templateUrl: './intencje.component.html',
  styleUrl: './intencje.component.css',
})
export class IntencjeComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;

  public content: string = '';

  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/intencje/${params['date']}.html`, {
          responseType: 'text',
        })
        .subscribe((data) => {
          // TODO parsowanie html, dodanie styli i wyświetlenie body
          that.content = data;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
