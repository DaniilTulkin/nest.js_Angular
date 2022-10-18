import { CONSTS } from "../../constants";

describe('Users page', () => {
    it('should load user table', () => {
        cy.visit(`${CONSTS.BASE_URL}` );
        cy.get('[ng-reflect-router-link="users"]').click();
        cy.get('mat-table');
    });

    it('should display right column names', () => {
        cy.contains('Id');
        cy.contains('Name');
        cy.contains('User name');
        cy.contains('Email');
        cy.contains('Role');
    });

    it('should navigate to the next page', () => {
        cy.get('[aria-label="Next page"]').click();
    });

    it('should filter users by username', () => {
        cy.get('[placeholder="Search Username"]').type('test1');
        cy.get('mat-table').find('mat-row').should('have.length', 10);
    });
});