import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export function crearToken(payload) {
   return new Promise((resolve, reject) => {
     jwt.sign(
        payload,
        TOKEN_SECRET,
        {
            expiresIn: 86400, //24 horas
        },
        (err, token) => {
            if(err) reject(err)
            resolve(token)
        }
    );
   });
    
}
