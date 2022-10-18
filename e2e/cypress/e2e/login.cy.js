import { CONSTS } from "../../constants";

describe('Test Login flow', () => {
    it('should login user', () => {
        cy.visit(`${CONSTS.BASE_URL}/login` );
        cy.get('[formcontrolname="email"]').type(CONSTS.EMAIL);
        cy.get('[formcontrolname="password"]').type(CONSTS.PASSWORD);
        cy.get('[type="submit"]').click();
        cy.url().should('include', 'admin');
    });
});