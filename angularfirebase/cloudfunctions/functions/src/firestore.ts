import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const gameCount = functions.firestore
    .document('games/{gameId}')
    .onCreate(async(snapshot, context) => {
        //snapshot: snapshot del documento en la base de datos
        const data = snapshot.data();
        const userRef = db.doc(`users/${data.uid}`);
        const userSnap = await userRef.get();
        const userData = userSnap.data();

        return userRef.update({
            gameCount: userData.gameCount + 1
        });
    });

export const userTrend = functions.firestore
    .document('games/{gameId}')
    .onUpdate(async(snapshot, context) => {

        const before = snapshot.before.data();
        const after = snapshot.after.data();

        let trend;

        if (after.score >= before.score) {
            trend = 'you are improving';
        } else {
            trend = 'you are decline =(';
        }

        const userRef = db.doc(`users/${after.uid}`);

        return userRef.update({
            trend: trend
        });
    });