import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intencje.wybrane',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './intencje.wybrane.component.html',
  styleUrl: './intencje.wybrane.component.css'
})
export class IntencjeWybraneComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private sub: Subscription | undefined;
  
  public content: string = '';
  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/intencje/${params['date']}.html`, {
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
    this.sub?.unsubscribe();

    const dynamicStyles = document.getElementById('dynamic-styles');
    if (dynamicStyles) {
      dynamicStyles.innerHTML = '';
    }
  }
}
