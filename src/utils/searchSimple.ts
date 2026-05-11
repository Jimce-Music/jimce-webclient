const savedToken:any = localStorage.getItem('token')
const savedBaseUrl:string = localStorage.getItem('jimce_api_base_url') || `${window.location.origin}`

export async function searchSimple() {
    const query:string = "Bella Napoli"
    console.log("Query:", query)

    const url = new URL(`${savedBaseUrl}/api/search/simple/search-songs`)
    url.searchParams.set("q", query)

    console.log("Send URL:", url.toString(), {headers: {Authorization: `Bearer ${savedToken}`}})
    const srlt = await fetch(url.toString(), {headers: {Authorization: `Bearer ${savedToken}`}})

    console.log(await srlt.text())
}