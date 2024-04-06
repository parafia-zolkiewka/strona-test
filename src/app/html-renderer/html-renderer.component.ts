import { Component, Input, OnDestroy, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-html-renderer',
  standalone: true,
  imports: [],
  templateUrl: './html-renderer.component.html',
  styleUrl: './html-renderer.component.css',
})
export class HtmlRendererComponent implements OnDestroy {
  private sanitizer = inject(DomSanitizer);
  public content: string = '';

  @Input() set buffer(buffer: ArrayBuffer | undefined) {
    if (!buffer) {
      return;
    }
    const data = new TextDecoder('windows-1250').decode(buffer);
    const parser = new DOMParser();
    const html = parser.parseFromString(data, 'text/html');

    const body = html.getElementsByTagName('body');
    if (body[0]) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
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
  }

  ngOnDestroy(): void {
    const dynamicStyles = document.getElementById('dynamic-styles');
    if (dynamicStyles) {
      dynamicStyles.innerHTML = '';
    }
  }
}
