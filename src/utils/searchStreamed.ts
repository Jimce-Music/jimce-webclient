import { StreamableResultList } from "streamed-result-list"
import "@jimce-music/jimce-api-ts"
import type { GetApiDummySchemasSearchSchemaResponses } from "@jimce-music/jimce-api-ts"

const savedToken:string = localStorage.getItem('token') ?? ""
const savedBaseUrl:string = localStorage.getItem('jimce_api_base_url') || `${window.location.origin}`

type SongResult = GetApiDummySchemasSearchSchemaResponses[200]

export async function searchStreamed(query:string, getter: Partial<SongResult>[], setter: React.Dispatch<React.SetStateAction<Partial<SongResult>[]>>) {
    console.log("Query:", query)

    const url = new URL(`${savedBaseUrl}/api/search/streamed/search-songs`)
    url.searchParams.set("q", query)

    const srl = new StreamableResultList<SongResult>()
    srl.hookToState(getter, setter)

    console.log("Send URL:", url.toString(), {headers: {Authorization: `Bearer ${savedToken}`}})
    const res = await fetch(url.toString(), {headers: {Authorization: `Bearer ${savedToken}`}})

     if (!res.ok) throw new Error('Network error')
     if (!res.body) throw new Error('Empty Body')

        const decoder = new TextDecoder()  
        let buffer = ""

        for await (const chunk of res.body) {
            buffer += decoder.decode(chunk, { stream: true });
            let lineEnd;
            while ((lineEnd = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);
            if (line) srl.handlePacket(JSON.parse(line));
            }
        }

        console.log(srl.asArray())

    // console.log(await res.text())
}
