describe('Fetch records', () => {
    it('Fetch records', () => {
        cy.visit(Cypress.config().baseUrl); // the same as in docker-compose.yml

        for (let i = 0; i < 20; i++) {
            // fetch 100 000
            cy.get('[data-testid="fetch_records"]').click();
            cy.get('[id="fetch_records_100000"]').click();
            cy.get('[class="mat-mdc-paginator-range-label"]').contains(' 1 – 5 of 100000 ');

            // fetch 10
            cy.get('[data-testid="fetch_records"]').click();
            cy.get('[id="fetch_records_10"]').click();
            cy.get('[class="mat-mdc-paginator-range-label"]').contains(' 1 – 5 of 10 ');
        }
    })
})
