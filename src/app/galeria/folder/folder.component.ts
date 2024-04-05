import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from '../folder';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;

  public folder: Folder | undefined;
  public currentIndex = 0;

  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/zdjecia.json`, {
          responseType: 'text',
        })
        .subscribe((text) => {
          const folders = JSON.parse(text);
          that.folder = folders.find((folder: Folder) => folder.name === params['name']);
        });
    });
  }

  moveRight() {
    if (this.folder) {
      if (this.currentIndex < this.folder.fileIds.length - 1) {
        this.currentIndex++;
      }
    }
  }

  moveLeft() {
    if (this.folder) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
