import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { file } from 'googleapis/build/src/apis/file';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  private announcementsFile: File | undefined;
  private intentionsFile: File | undefined;
  private httpClient = inject(HttpClient);
  owner = 'parafia-zolkiewka';
  repo = 'parafia-zolkiewka.github.io';
  branch = 'master';

  public apiKey: string = '';
  public date: string = '';

  async onUpload() {
    if (!this.announcementsFile && !this.intentionsFile) {
      return;
    }
    // TODO naprawić sekwencję
    this.fetchAndUpdateFile(this.announcementsFile, 'ogloszenia');
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.fetchAndUpdateFile(this.intentionsFile, 'intencje');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // TODO naprawić, bo czasami zwraca 409
    await this.onReloadContent();
  }

  private async fetchAndUpdateFile(file: File | undefined, location: string) {
    if (!file) {
      return;
    }
    const token = this.apiKey;
    const date = this.date;
    const path = encodeURIComponent(`src/assets/` + location + '/' + date + '.html');

    const observer = {
      next: (response: any) => {
        console.log('Updating existing file');
        this.updateFile(file, location, date, path, token, response.sha);
      },
      error: (error: HttpErrorResponse) => {
        console.log('Creating a new file');
        this.updateFile(file, location, date, path, token, null);
      }
    };

    this.httpClient
      .get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      .subscribe(observer);
  }

  private async updateFile(file: File, location: string, date: string, path: string, token: string, sha: string | null) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      if (!this.announcementsFile) {
        return reject();
      }
      reader.readAsDataURL(this.announcementsFile);
      reader.onloadend = () => {
        const string = reader.result as string;
        resolve(string.split(',')[1]);
      };
    });

    this.httpClient
      .put(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          message: `upload file ${location}/${date}.html [skip ci]`,
          content: base64,
          branch: this.branch,
          sha: sha
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

  async onReloadContent() {
    const path = encodeURIComponent('date.txt');
    const token = this.apiKey;
    const date = new Date().toISOString();

    const observer = {
      next: (response: any) => {
        console.log('Updating existing file');
        this.reloadContent(path, date, response.sha, token);
      },
      error: (error: HttpErrorResponse) => {
        console.log('Creating a new file');
        this.reloadContent(path, date, null, token);
      }
    };

    this.httpClient
      .get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      .subscribe(observer);
  }

  private async reloadContent(path: string, dateString: string, sha: string | null, token: string) {
    const observer = {
      next: (response: any) => {
        console.log('Content reload triggered successfully', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error triggering content reload:', error);
      }
    };

    this.httpClient
      .put(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          message: `Reload content ${dateString}`,
          content: btoa(dateString),
          branch: this.branch,
          sha: sha, // Include sha if available, otherwise it will be omitted
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe(observer);
  }

  onAnnouncementsFileChange($event: Event) {
    this.announcementsFile = ($event.target as HTMLInputElement).files?.[0];
  }

  onIntentionsFileChange($event: Event) {
    this.intentionsFile = ($event.target as HTMLInputElement).files?.[0];
  }
}
