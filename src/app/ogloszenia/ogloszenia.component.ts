import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HtmlRendererComponent } from '../html-renderer/html-renderer.component';

@Component({
  selector: 'app-ogloszenia',
  standalone: true,
  imports: [RouterModule, HtmlRendererComponent],
  templateUrl: './ogloszenia.component.html',
  styleUrl: './ogloszenia.component.css',
})
export class OgloszeniaComponent implements OnInit {
  private httpClient = inject(HttpClient);

  public ogloszenia: string[] = [];
  public buffer: ArrayBuffer | undefined;

  ngOnInit(): void {
    const that = this;

    that.httpClient.get('assets/ogloszenia.json').subscribe((data) => {
      const [date, ...ogloszenia] = data as string[];
      that.ogloszenia = ogloszenia;

      that.httpClient
        .get(`assets/ogloszenia/${date}.html`, {
          responseType: 'arraybuffer',
        })
        .subscribe((buffer) => {
          that.buffer = buffer;
        });
    });
  }
}
