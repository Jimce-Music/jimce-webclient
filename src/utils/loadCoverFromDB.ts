export async function loadCoverFromDb(image: string) {
    console.log("loadCoverFromDb function working...", image)
    const savedToken = localStorage.getItem('token')
    const savedBaseUrl = localStorage.getItem('jimce_api_base_url') || `${window.location.origin}`

    const res = await fetch(`${savedBaseUrl}${image}`, {headers: {Authorization: `Bearer ${savedToken}`}})
    const imageBlob = await res.blob()
    const imageUrl = URL.createObjectURL(imageBlob)

    console.log(imageUrl)
    return (imageUrl)
}