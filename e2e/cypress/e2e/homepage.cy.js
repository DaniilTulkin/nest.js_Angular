import { CONSTS } from "../../constants";

describe('Homepage', () => {
    it('should load successfully', () => {
        cy.visit(CONSTS.BASE_URL);
    });

    it('should contain right spelled tet', () => {
        cy.contains("Users");
        cy.contains("Admin");
        cy.contains("Login");

        cy.get('mat-select').click()
        cy.contains("Register");
    });
});