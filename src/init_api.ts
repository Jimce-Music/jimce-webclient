import * as api from '@jimce-music/jimce-api-ts'

// Set config
api.setConfig({
    baseUrl: 'http://localhost:8080',
    // You could also set default headers (maybe after the auth)
    // headers: {
    //     Authorization: 'Bearer <token>'
    // }
})

// Then make a request (fictional routes used here):
const req = await api.getApiPing()

console.log(req.error)
console.log(req.data)