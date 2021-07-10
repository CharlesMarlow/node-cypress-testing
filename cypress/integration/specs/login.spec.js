describe('/user/login endpoint', () => {
    const loginEndpoint = 'http://localhost:3000/api/user/login';
    const body = {
        email: 'doNotDeleteUser@email.com',
        password: 'validPassword',
    }

    // Happy route
    it('logs in with valid user', () => {
        cy.request({
            method: 'POST',
            url: loginEndpoint,
            body,
        })
            .then((response) => {
                expect(response.status).to.eq(200);
        })
    });
})
