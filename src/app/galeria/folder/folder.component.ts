import { Component, OnInit } from '@angular/core';
import { Folder } from '../folder';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit {
  public folder: Folder | undefined;
  public currentIndex = 0;

constructor(private router: Router) {
}

  ngOnInit(): void {
    const navigationState = window.history.state;
    if (navigationState && navigationState.selectedFolder) {
      this.folder = navigationState.selectedFolder;
    }
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

  goBack() {
    this.router.navigate(['/galeria']);
  }
}
