import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ogloszenia',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './ogloszenia.component.html',
  styleUrl: './ogloszenia.component.css',
})
export class OgloszeniaComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private date: string = '';
  
  public content: string = '';
  public ogloszenia: string[] = [];

  ngOnInit(): void {
    const that = this;

    that.httpClient.get('assets/ogloszenia.json').subscribe((data) => {
      const ogloszenia = data as string[];
      ogloszenia.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
      });
      that.date = ogloszenia[0];
      this.ogloszenia = ogloszenia;
      this.ogloszenia.shift();

      that.httpClient
        .get(`assets/ogloszenia/${this.date}.html`, {
          responseType: 'arraybuffer',
        })
        .subscribe((buffer) => {
          const data = new TextDecoder('windows-1250').decode(buffer);

          const parser = new DOMParser();
          const html = parser.parseFromString(data, 'text/html');

          const body = html.getElementsByTagName('body');
          if (body[0]) {
            that.content = that.sanitizer.bypassSecurityTrustHtml(
              body[0].innerHTML
            ) as string;
          }

          const dynamicStyles = document.getElementById('dynamic-styles');
          if (dynamicStyles) {
            const styles = html.getElementsByTagName('style');
            if (styles[0]) {
              dynamicStyles.innerHTML = styles[0].innerHTML;
            }
          }
        });
    });
  }

  ngOnDestroy(): void {
    const dynamicStyles = document.getElementById('dynamic-styles');
    if (dynamicStyles) {
      dynamicStyles.innerHTML = '';
    }
  }
}
