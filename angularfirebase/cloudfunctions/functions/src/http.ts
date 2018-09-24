import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

//basicHTTP Firebase Function
export const basicHTTP = functions.https.onRequest((request, response) => {

    const name = request.query.name;

    if (!name) {
        response.status(400).send('ERROR you must supply a name =(');
    } else
        response.send(`Hello ${ name }`);

});

const auth = (request, response, next) => {
    if (!request.header.authorization) {
        response.status(400).send('user not authorized');
    }
    next();
}
const app = express();
app.use(cors({origin: true}));
app.use(auth);

app.get('/cat', (request, response) => {
    response.send('CAT');
});
app.get('/dog', (request, response) => {
    response.send('DOG');
});

//api endpoint Firebase Function
export const api = functions.https.onRequest(app);