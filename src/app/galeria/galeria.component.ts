import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Folder } from './folder';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit {
  private httpClient = inject(HttpClient);

  public folders: Folder[] = [];

  ngOnInit(): void {
    this.httpClient
      .get(`assets/zdjecia.json`, {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.folders = JSON.parse(data);
      });
  }
}
