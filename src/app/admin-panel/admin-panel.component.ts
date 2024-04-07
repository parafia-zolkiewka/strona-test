import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

const TOKEN_STORAGE_KEY = 'token';

function salt() {
  return `salt=${new Date().getTime()}`;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  private announcementsFile: File | undefined;
  private intentionsFile: File | undefined;
  private httpClient = inject(HttpClient);
  owner = 'parafia-zolkiewka';
  repo = 'parafia-zolkiewka.github.io';
  branch = 'master';

  public apiKey: string = '';
  public date: string = '';

  ngOnInit(): void {
    this.apiKey = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  }

  private saveTokenToStorage(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  async onUpload() {
    console.log('date', this.date); // TODO check date format, alert if not valid

    // error/success message

    if (!this.announcementsFile && !this.intentionsFile) {
      return;
    }
    try {
      await this.fetchAndUpdateFile(this.announcementsFile, 'ogloszenia');
      await this.fetchAndUpdateFile(this.intentionsFile, 'intencje');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    await this.onReloadContent();
  }

  private async fetchAndUpdateFile(file: File | undefined, location: string) {
    if (!file) {
      return;
    }
    const token = this.apiKey;
    const date = this.date;
    const path = `src/assets/${location}/${date}.html`;

    try {
      const response = await firstValueFrom(
        this.httpClient.get<{ sha: string }>(
          `https://api.github.com/repos/${this.owner}/${
            this.repo
          }/contents/${path}?ref=${this.branch}&${salt()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      console.log('Updating existing file');
      await this.updateFile(file, location, date, path, token, response.sha);
    } catch (error) {
      console.log('Creating a new file');
      await this.updateFile(file, location, date, path, token, null);
    }
  }

  private async base64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      if (!file) {
        return reject();
      }
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const string = reader.result as string;
        resolve(string.split(',')[1]);
      };
    });
  }

  private async updateFile(
    file: File,
    location: string,
    date: string,
    path: string,
    token: string,
    sha: string | null
  ) {
    this.saveTokenToStorage(token);
    try {
      const value = await firstValueFrom(
        this.httpClient.put(
          `https://api.github.com/repos/${this.owner}/${
            this.repo
          }/contents/${path}?${salt()}`,
          {
            message: `upload file ${location}/${date}.html [skip ci]`,
            content: await this.base64(file),
            branch: this.branch,
            sha: sha,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      console.log('success', value);
    } catch (error) {
      console.error('error', error);
    }
  }

  async onReloadContent() {
    const path = 'date.txt';
    const token = this.apiKey;
    const date = new Date().toISOString();

    try {
      const response = await firstValueFrom(
        this.httpClient.get<{ sha: string }>(
          `https://api.github.com/repos/${this.owner}/${
            this.repo
          }/contents/${path}?ref=${this.branch}&${salt()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      console.log('Updating existing file');
      await this.reloadContent(path, date, response.sha, token);
    } catch (error) {
      console.log('Creating a new file');
      await this.reloadContent(path, date, null, token);
    }
  }

  private async reloadContent(
    path: string,
    dateString: string,
    sha: string | null,
    token: string
  ) {
    this.saveTokenToStorage(token);
    try {
      const response = await firstValueFrom(
        this.httpClient.put(
          `https://api.github.com/repos/${this.owner}/${
            this.repo
          }/contents/${path}?${salt()}`,
          {
            message: `Reload content ${dateString}`,
            content: await this.base64(new File([dateString], 'date.txt')),
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
      );
      console.log('Content reload triggered successfully', response);
    } catch (error) {
      console.error('Error triggering content reload:', error);
    }
  }

  onAnnouncementsFileChange($event: Event) {
    this.announcementsFile = ($event.target as HTMLInputElement).files?.[0];
  }

  onIntentionsFileChange($event: Event) {
    this.intentionsFile = ($event.target as HTMLInputElement).files?.[0];
  }
}
