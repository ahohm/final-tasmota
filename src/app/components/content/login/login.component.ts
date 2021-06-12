import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { DeviceService } from 'src/app/_services/device.service';
import { TokenStorageService } from 'src/app/_services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  list!: any[];

  constructor(private authService: AuthService, private tokenService : TokenStorageService, private router : Router, private deviceService : DeviceService) { }

  ngOnInit(): void {
  }

  onSubmit(f: any): void {
    const {username , password} = f.value 
    console.log(f)
    console.log(username)
    console.log(password)
    this.authService.login(username, password).pipe().subscribe(
      data => {
        console.log(data.jwt);
        this.tokenService.saveToken(data.jwt);
        this.deviceService.getAllDevice().pipe().subscribe(e => {
          console.log(e);
          console.log(e.length);
          if(e.length > 0){
            this.router.navigate(['/device-list'])
          }else{
            this.router.navigate(['/search'])
          }
  
        })        
      },
      err => {
        console.log(err.error.message)
      })
  }
}
