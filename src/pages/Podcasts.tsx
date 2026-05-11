import { searchStreamed } from  '../utils/searchStreamed'
import { searchSimple } from '../utils/searchSimple'
import type { GetApiDummySchemasSearchSchemaResponses } from '@jimce-music/jimce-api-ts'
import { useState } from 'react'

type SongResult = GetApiDummySchemasSearchSchemaResponses[200]

export default function Podcasts() {
    const [searchResults, setSearchResults] = useState<Partial<SongResult>[]>([])
    const [query, setQuery] = useState("")

    return (
        <>
            <h1>Podcasts Page</h1>
            <input type="text" defaultValue={query} onChange={e => setQuery(e.target.value)} />
            <button
                onClick={() => searchStreamed(query, searchResults, setSearchResults)}
            >
                Test Streamed Search
            </button>
            <button
                onClick={searchSimple}
            >
                Test Simple Search
            </button>

            <p>{searchResults.map(e => `${e.name} - ${e.sound?.['yt:id']}`).join(",")}</p>
        </>
    )
}
