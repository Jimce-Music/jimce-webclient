import * as api from '@jimce-music/jimce-api-ts'

// Set config
api.setConfig({
    baseUrl: 'http://192.168.188.27:8080',
    // You could also set default headers (maybe after the auth)
    // headers: {
    //     Authorization: 'Bearer <token>'
    // }
    headers: {
        Authorization: 'Bearer '
    }
})

const pingRequest = api.getApiPing()

console.log(pingRequest)