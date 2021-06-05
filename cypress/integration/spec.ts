it('Create a new list', () => {
  cy.visit('/');
  // Click 'New' button.
  // cy.get('app-content-header-button > .btn').click();
  cy.getByTestId('new').click();
  // Type in the name and add the list.
  cy.get('#listName').type('New list name');
  cy.get('.modal-footer > .btn-primary').click();
  // Open the list.
  cy.get('.d-flex > .btn-primary').click();

  // We should now see the name of the list on screen.
  cy.contains('New list name');
});
