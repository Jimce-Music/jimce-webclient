import * as api from '@jimce-music/jimce-api-ts'

// Set config
api.setConfig({
    baseUrl: 'http://localhost:8080',
    // You could also set default headers (maybe after the auth)
    // headers: {
    //     Authorization: 'Bearer <token>'
    // }
})