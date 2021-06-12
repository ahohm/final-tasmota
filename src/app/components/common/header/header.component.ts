import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,  AfterContentInit {

  collapsed = true;
  auth : boolean = true;
  constructor(private tokenService: TokenStorageService, private router : Router) { }
  ngAfterContentInit(): void {
    if(this.tokenService.getToken() === null){
      this.auth = false
    }
    this.collapsed = false
  }

  ngOnInit(): void {
     
  }

  logOut(){
    window.localStorage.removeItem('auth-token')
    window.sessionStorage.removeItem('auth-token')
    this.router.navigate(["/login"])
  }

  closeMenu(){
    
  }
}
