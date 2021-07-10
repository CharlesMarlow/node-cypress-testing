
const guid = require('guid');

describe('/user/register endpoint', () => {
    const registerEndpoint = 'http://localhost:3000/api/user/register';
    const dynamicEmail = guid.raw() + '@bar.com';
    const body = {
        name: 'testName',
        email: dynamicEmail,
        password: 'testpass1',
    }

    // Happy route
    it('returns 200 and creates user when we hit endpoint with correct body', () => {
        cy.request('POST', registerEndpoint, body)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(body.name);
                expect(response.body.email).to.eq(body.email);
                expect(response.body.password).to.not.eq(body.password);
        })
    });

    // Errors
    it('returns 400 with no body', () => {
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            failOnStatusCode: false,
        }).then((response) => {
                expect(response.status).to.eq(400);
        })
    });

    // Bad user input
    it('doesnt allow user creation with bad user body in full', () => {
        const badBody = {
            name: '1',
            email: 'foo',
            password: '1',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: badBody,
            failOnStatusCode: false,
        }).then((response) => {
                expect(response.status).to.eq(400);
        })
    });

    it('doesnt allow user creation with invalid email', () => {
        const invalidEmailBody = {
            name: 'validName',
            email: 'invalidEmail',
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidEmailBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"email" must be a valid email');
        })
    });

    it('doesnt allow user creation with invalid name', () => {
        const invalidNameBody = {
            name: '1',
            email: dynamicEmail,
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidNameBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"name" length must be at least 2 characters long');
        })
    });

    it('doesnt allow user creation with invalid password', () => {
        const invalidPasswordBody = {
            name: 'validName',
            email: dynamicEmail,
            password: '1',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidPasswordBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"password" length must be at least 8 characters long');
        })
    });

    // bad user input- types
    it('doesnt allow user creation with invalid name type', () => {
        const invalidNameType = {
            name: 1,
            email: dynamicEmail,
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidNameType,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"name" must be a string');
        })
    });

    it('doesnt allow user creation with invalid email type', () => {
        const invalidEmailType = {
            name: 'validName',
            email: 1,
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidEmailType,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"email" must be a string');
        })
    });

    it('doesnt allow user creation with invalid password type', () => {
        const invalidPasswordType = {
            name: 'validName',
            email: dynamicEmail,
            password: 1,
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: invalidPasswordType,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"password" must be a string');
        })
    });

    // bad user input- required
    it('doesnt allow user creation when no name is sent', () => {
        const nameMissingBody = {
            email: dynamicEmail,
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: nameMissingBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"name" is required');
        })
    });

    it('doesnt allow user creation when no email is sent', () => {
        const emailMissingBody = {
            name: 'validName',
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: emailMissingBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"email" is required');
        })
    });

    it('doesnt allow user creation when no password is sent', () => {
        const passwordMissingBody = {
            name: 'validName',
            email: dynamicEmail,
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: passwordMissingBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('"password" is required');
        })
    });

    // bad user input- email exists
    it('doesnt allow user creation when email already exists', () => {
        const emailExistsBody = {
            name: 'validName',
            email: 'doNotDeleteUser@email.com',
            password: 'validPassword',
        };
        cy.request({
            method: 'POST',
            url: registerEndpoint,
            body: emailExistsBody,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.eq('Conflict- Email already exists');
        })
    });
})
