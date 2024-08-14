import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfService } from 'src/app/conf/conf.service';

type WelcomeView = {
  title: string,
  subtitle: string,
  description: string,
  subtitle2?: string,
  description2?: string
}

@Component({
  selector: 'app-welcome-view',
  templateUrl: './welcome-view.component.html',
  standalone: true,
  styleUrls: ['./welcome-view.component.scss'],
  imports: [CommonModule, JsonPipe]
})
export class WelcomeViewComponent implements OnInit{

  conf!: WelcomeView 
  constructor(public confService: ConfService){

  }

  ngOnInit(): void {
   this.confService.conf.subscribe(conf => {
    this.conf = conf
   })
  }
}
