import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'
import { User } from 'src/app/interfaces/user.interface';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private authService: AuthenticationService,
              private formBuider: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuider.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(3)]],
      passwordConfirm: [null, Validators.required]
    }, {
      
    })
  }

  onSubmit() {
    this.authService.register(<unknown>this.registerForm as User).pipe(
      map(user => this.router.navigate(['login']))
    ).subscribe();
  }
}
