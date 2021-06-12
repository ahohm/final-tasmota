import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  auth: any;

  constructor(private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    
  }

}
