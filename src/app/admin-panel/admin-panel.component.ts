import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  private file: File | undefined;
  private httpClient = inject(HttpClient);

  async onUpload() {
    if (!this.file) {
      return;
    }
    const owner = 'winterberryice';
    const repo = 'api-test';
    const path = encodeURIComponent(this.file.name);
    const branch = 'main';
    //The token must have the following permission set:
    // contents:write
    const token = '';

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
