import './server_setup_screen.css'
import Server from '../../assets/icons/storage.svg'
import { useEffect, useMemo, useState } from 'react'
import * as api from '@jimce-music/jimce-api-ts'

export default function serverSetupScreen() {
    const defaultBaseUrl = localStorage.getItem('jimce_api_base_url') || ''

    const parsedBaseUrl = useMemo(() => {
        if (!defaultBaseUrl) return null

        try {
            return new URL(defaultBaseUrl)
        } catch {
            return null
        }
    }, [defaultBaseUrl])

    const [ip, setIp] = useState(parsedBaseUrl?.hostname || '')
    const [port, setPort] = useState(parsedBaseUrl?.port || '8080')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        document.body.classList.add('server-setup-no-scroll')

        return () => {
            document.body.classList.remove('server-setup-no-scroll')
        }
    }, [])

    function isValidHost(host: string) {
        const hostValue = host.trim()

        if (!hostValue) return false

        if (hostValue.toLowerCase() === 'localhost') return true

        const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
        const hostnamePattern = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9-]{1,63}$/

        return ipv4Pattern.test(hostValue) || hostnamePattern.test(hostValue)
    }

    function isValidPort(value: string) {
        const parsed = Number(value)
        return Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535
    }

    async function handleSave(event: React.FormEvent) {
        event.preventDefault()

        if (isLoading) return

        const trimmedIp = ip.trim()
        const trimmedPort = port.trim()

        if (!isValidHost(trimmedIp)) {
            setError('Bitte gib eine gueltige IP oder Host-Adresse ein.')
            return
        }

        if (!isValidPort(trimmedPort)) {
            setError('Bitte gib einen gueltigen Port zwischen 1 und 65535 ein.')
            return
        }

        const baseUrl = `http://${trimmedIp}:${trimmedPort}`

        // PING SERVER //
        api.setConfig({ baseUrl: baseUrl })
        setIsLoading(true)
        try {
            const ping = await api.getApiPing()

            if (ping.response.status !== 200 || ping.error) {
                setError('SERVER NOT FOUND')
                api.setConfig({ baseUrl: '' })
                return
            }
        } catch {
            setError('SERVER NOT FOUND')
            api.setConfig({ baseUrl: '' })
            return
        } finally {
            setIsLoading(false)
        }

        localStorage.setItem('jimce_api_base_url', baseUrl)

        setError('')
        window.location.hash = '/auth/login'
    }

    return(
        <div className='server-setup-screen'>
            <div className='server-setup-card'>
                <img className='server-setup-icon' src={Server} alt='Server setup' />
                <h1 className='server-setup-title'>Server verbinden</h1>
                <p className='server-setup-subtitle'>
                    Gib die IP-Adresse und den Port deines Jimce-Servers ein.
                </p>

                <form className='server-setup-form' onSubmit={handleSave}>
                    <label className='server-setup-label' htmlFor='server-ip'>
                        Server-IP / Host
                    </label>
                    <input
                        id='server-ip'
                        className='server-setup-input'
                        type='text'
                        placeholder='z.B. 192.168.xxx.xx oder localhost'
                        value={ip}
                        onChange={(event) => setIp(event.target.value)}
                        autoComplete='off'
                        disabled={isLoading}
                    />

                    <label className='server-setup-label' htmlFor='server-port'>
                        Port
                    </label>
                    <input
                        id='server-port'
                        className='server-setup-input'
                        type='number'
                        min='1'
                        max='65535'
                        placeholder='8080'
                        value={port}
                        onChange={(event) => setPort(event.target.value)}
                        autoComplete='off'
                        disabled={isLoading}
                    />

                    {error && <p className='server-setup-error'>{error}</p>}

                    <button type='submit' className='server-setup-button' disabled={isLoading} aria-busy={isLoading}>
                        {isLoading && <span className='server-setup-spinner' aria-hidden='true' />}
                        {isLoading ? 'Pruefe Server...' : 'Server speichern'}
                    </button>
                </form>
            </div>
        </div>
    )
}
