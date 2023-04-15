describe('Fetch records', () => {
  it('Fetch 100 000 records', () => {
      cy.visit('http://localhost:5200');

      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="fetch_records"]').click();
        cy.get('[id="fetch_records_100000"]').click();
        cy.get('[class="mat-mdc-paginator-range-label"]').contains(' 1 – 5 of 100000 ');
      }
  })
})
