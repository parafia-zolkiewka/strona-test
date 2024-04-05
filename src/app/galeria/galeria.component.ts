import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Folder } from './folder';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit, OnDestroy {
  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private sub: Subscription | undefined;

  public folders: Folder[] = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const that = this;
    that.sub = that.route.params.subscribe((params) => {
      that.httpClient
        .get(`assets/zdjecia.json`, {
          responseType: 'text',
        })
        .subscribe((data) => {
          this.folders = JSON.parse(data);
        });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onOpenFolder(folder: Folder) {
    this.router.navigate(['/galeria', folder.name], { state: { selectedFolder: folder } });
  }
}
