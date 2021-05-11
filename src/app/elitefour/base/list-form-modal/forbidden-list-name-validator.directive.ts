import {Directive, Input} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";
import {FavoriteListApi} from "../../backend/favorite-list-api";
import {FavoriteList} from "../../backend/favorite-list-interfaces";

@Directive({
  selector: '[appForbiddenListName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenListNameValidatorDirective, multi: true }]
})
export class ForbiddenListNameValidatorDirective implements Validator {
  @Input('appForbiddenListName') forbiddenName: string[] = [];
  favoriteLists: FavoriteList[]

  constructor(private favoriteListApi: FavoriteListApi) {
    favoriteListApi.getFavoriteLists().subscribe((list) => this.favoriteLists = list)
  }

  validate(formGroup: FormGroup): ValidationErrors | null {
    return !!this.favoriteLists ? this.checkForbiddenName(this.forbiddenName[0], this.forbiddenName[1])(formGroup)
      : null;
  }

  private checkForbiddenName(inputListName: string, inputExceptionListName: string) {
    return (formGroup: FormGroup) => {
      const listNameControl = formGroup.controls[inputListName];
      const exceptionListNameControl = formGroup.controls[inputExceptionListName];

      if (!listNameControl || !exceptionListNameControl) {
        return null;
      }

      if (listNameControl.errors && !listNameControl.errors.forbiddenName) {
        return null;
      }

      // Set error if the value is different than the exception and occurs in the list.
      if (listNameControl.value !== exceptionListNameControl.value &&
        !!this.favoriteLists.find((list) => list.name == listNameControl.value)) {
        listNameControl.setErrors({ forbiddenName: true });
        return {forbiddenName: true}
      } else {
        listNameControl.setErrors(null);
      }
    }
  }
}
