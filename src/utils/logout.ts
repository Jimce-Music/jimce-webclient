export default async function logout() {
    const token = localStorage.getItem('token')
    console.log(token)

    if (token) {
        localStorage.removeItem('token')
    }
    location.reload()
}
