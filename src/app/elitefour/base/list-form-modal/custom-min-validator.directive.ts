import {Directive, Input} from '@angular/core';
import {FormControl, NG_VALIDATORS, Validator} from "@angular/forms";

// The built-in min didn't really work properly, so I made this.
@Directive({
  selector: '[customMin][formControlName],[customMin][formControl],[customMin][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMinValidatorDirective, multi: true}]
})
export class CustomMinValidatorDirective implements Validator {
  @Input() customMin: number;

  validate(c: FormControl): {[key: string]: any} {
    let v = c.value;
    return ( v < this.customMin)? {"customMin": true} : null;
  }
}
