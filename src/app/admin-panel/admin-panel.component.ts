import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  private file: File | undefined;
  private httpClient = inject(HttpClient);

  public apiKey: string = '';

  async onUpload() {
    if (!this.file) {
      return;
    }
    const owner = 'parafia-zolkiewka';
    const repo = 'parafia-zolkiewka.github.io';
    const path = encodeURIComponent(`src/assets/` + this.file.name);
    const branch = 'master';
    //The token must have the following permission set:
    // contents:write
    const token = this.apiKey;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      if (!this.file) {
        return reject();
      }
      reader.readAsDataURL(this.file);
      reader.onloadend = () => {
        const string = reader.result as string;
        resolve(string.split(',')[1]);
      };
    });

    this.httpClient
      .put(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          message: `upload file ${this.file.name}`,
          content: base64,
          branch: branch,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe({
        next(value) {
          console.log('success', value);
        },
        error(err) {
          console.error('error', err);
        },
      });
  }
  onFileChange($event: Event) {
    this.file = ($event.target as HTMLInputElement).files?.[0];
  }
}
