// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// tslint:disable-next-line:no-namespace
declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByTestId(param: string): Chainable<Element>;
  }
}

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});
