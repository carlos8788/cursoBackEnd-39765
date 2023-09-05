export const sessionTests = (expect, request) => {
    
    describe('API Endpoints - Session Operations', function () {
        
        let sessionCookie;
        
        it('Debe registrar un nuevo usuario', async function() {
            const newUser = {
                first_name: "Test",
                last_name: "Luis",
                email: "luis@test.com",
                age: 30,
                role: "user",
                password: "testPassword123"
            };

            const registerResponse = await request.post('/api/session/register').send(newUser);

            expect(registerResponse.status).to.be.eql(201);  

        });

        it('Debe loguearse con email y password', async function () {
            const userTest = {
                email: "luis@test.com",
                password: "testPassword123"
            }
            const loginResponse = await request.post('/api/session/login').send(userTest);


            sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
            const cookieName = sessionCookie.split('=')[0];
            const cookieValue = sessionCookie.split('=')[1];

            expect(loginResponse.status).to.be.eql(200);
            expect(cookieName).to.be.eql('authToken');
            expect(cookieValue).to.be.ok;
        });

        it('Debe comprobar la sesion del usuario', async function () {
            const checkSessionResponse = await request.get('/api/session/current').set('Cookie', sessionCookie);
            
            expect(checkSessionResponse.status).to.be.eql(200);  
            expect(checkSessionResponse._body.payload).to.have.property('id');  
            expect(checkSessionResponse._body.payload).not.to.have.property('password');  

        });
    });

}
