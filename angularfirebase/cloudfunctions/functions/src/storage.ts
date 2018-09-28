import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Storage from '@google-cloud/storage';
import * as fs from 'fs-extra';
import { tmpdir } from 'os'
import { join, dirname } from 'path'

const gcs = Storage();

export const resizeAvatar = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = gcs.bucket(object.bucket);
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const tmpFilePath = join(tmpdir(), object.name);
        const avatarFileName = `avatar_${fileName}`
        const tmpAvatarFilePath = join(tmpdir(), avatarFileName);

        //esta parte es importante para evitar un loop infinito en la function
        if (fileName.includes('avatar_')) {
            console.log('exiting function');
            return false;
        }

        //una vez que se subio el archivo original, lo descargamos en una carpeta temporal
        await bucket.file(filePath).download({
            destination: tmpFilePath
        });

        await sharp(tmpFilePath)
            .resize(100, 100)
            .toFile(tmpAvatarFilePath);

        return bucket.upload(tmpAvatarFilePath, {
            destination: join(dirname(filePath), avatarFileName)
        });
    });