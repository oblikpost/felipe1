import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule, FormsModule] 
})

export class CursosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
