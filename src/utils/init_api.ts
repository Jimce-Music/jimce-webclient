import * as api from '@jimce-music/jimce-api-ts'

const savedToken = localStorage.getItem('token')
const savedBaseUrl = localStorage.getItem('jimce_api_base_url') || `${window.location.origin}/api`

// Set config
api.setConfig({
    baseUrl: savedBaseUrl,
    // You could also set default headers (maybe after the auth)
    headers: {
        Authorization: 'Bearer ' + savedToken
    }
})

if (savedBaseUrl) {
    const pingRequest = api.getApiPing()
    console.log(pingRequest)
}
