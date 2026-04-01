import { Component } from '@angular/core';

@Component({
selector:'app-register',
templateUrl:'./register.component.html',
styleUrls:['./register.component.scss']
})
export class RegisterComponent{

nom='';
email='';
password='';

register(){
console.log(this.nom,this.email,this.password);
}

}