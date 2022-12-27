import {Directive, Input} from '@angular/core';
import {UntypedFormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {FavoriteList} from '../../backend/favorite-list-interfaces';
import {FavoriteListsRepository} from '../../backend/favorite-lists-repository';

@Directive({
  selector: '[appForbiddenListName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenListNameValidatorDirective, multi: true }]
})
export class ForbiddenListNameValidatorDirective implements Validator {
  @Input('appForbiddenListName') forbiddenName: string[] = [];
  favoriteLists: FavoriteList[];

  constructor(private favoriteListsRepository: FavoriteListsRepository) {
    favoriteListsRepository.getFavoriteLists().subscribe((list) => this.favoriteLists = list);
  }

  validate(formGroup: UntypedFormGroup): ValidationErrors | null {
    return !!this.favoriteLists ? this.checkForbiddenName(this.forbiddenName[0], this.forbiddenName[1])(formGroup)
      : null;
  }

  // tslint:disable-next-line:typedef
  private checkForbiddenName(inputListName: string, inputExceptionListName: string) {
    return (formGroup: UntypedFormGroup) => {
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
        !!this.favoriteLists.find((list) => list.name === listNameControl.value)) {
        listNameControl.setErrors({ forbiddenName: true });
        return {forbiddenName: true};
      } else {
        listNameControl.setErrors(null);
      }
    };
  }
}
