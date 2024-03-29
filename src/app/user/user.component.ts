import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
 
  constructor() { }

  ngOnInit() {
  }


}
