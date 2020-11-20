describe('happy path', () => {
  it('show happy path', () => {
    // First register an new account successfully
    cy.visit('localhost:3000/register');
    // Use "unique" to ensure the email is special.
    // Alternatively, you can replace the email as you like
    // as long as it not been registered before.
    const unique = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    const email = `${unique}@gmail.com`;
    const password = 'car';
    const name = 'ethan';
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=name]').type(name);
    cy.get('.btn').click();

    // Second login successfully
    cy.location('pathname').should('eq', '/login');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('.btn').click();

    // Third, in Dashboard, to create a new game
    cy.location('pathname').should('eq', '/dashboard');
    const gameName = 'This is my first game';
    cy.get('.createInput').type(gameName);
    cy.get('.createIT').click();

    // Fourth, to start a game
    cy.get('[data-test-target=start]').click();
    cy.get('[data-test-target=close-window]').wait(1500).click();

    // Fifth, to end the game and then show the result
    cy.get('[data-test-target=end]').click();
    cy.on('window:confirm', (text) => {
      switch (text) {
        case 1:
          expect(text).to.eq('Are you sure to stop the game?');
          return true;
        case 2:
          expect(text).to.eq('Would you like to view the results?');
          return true;
        default:
          return true;
      }
    });

    // Sixth, log out the application
    cy.location('pathname').should('includes', '/results');
    cy.get('.logoutBTN').wait(1500).click();

    // Finally, login back
    cy.location('pathname').should('eq', '/login');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('.btn').click();
  });
});
