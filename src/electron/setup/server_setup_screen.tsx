import './server_setup_screen.css'
import Server from '../../assets/icons/storage.svg'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '@jimce-music/jimce-api-ts'

export default function serverSetupScreen() {
    const { t } = useTranslation()
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
            setError(t('electron.serverSetup.errors.invalidHost'))
            return
        }

        if (!isValidPort(trimmedPort)) {
            setError(t('electron.serverSetup.errors.invalidPort'))
            return
        }

        const baseUrl = `http://${trimmedIp}:${trimmedPort}`

        // PING SERVER //
        api.setConfig({ baseUrl: baseUrl })
        setIsLoading(true)
        try {
            const ping = await api.getApiPing()

            if (ping.response.status !== 200 || ping.error) {
                setError(t('electron.serverSetup.errors.serverNotFound'))
                api.setConfig({ baseUrl: '' })
                return
            }
        } catch {
            setError(t('electron.serverSetup.errors.serverNotFound'))
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
                <img className='server-setup-icon' src={Server} alt={t('electron.serverSetup.alt.serverIcon')} />
                <h1 className='server-setup-title'>{t('electron.serverSetup.title')}</h1>
                <p className='server-setup-subtitle'>
                    {t('electron.serverSetup.subtitle')}
                </p>

                <form className='server-setup-form' onSubmit={handleSave}>
                    <label className='server-setup-label' htmlFor='server-ip'>
                        {t('electron.serverSetup.labels.host')}
                    </label>
                    <input
                        id='server-ip'
                        className='server-setup-input'
                        type='text'
                        placeholder={t('electron.serverSetup.placeholders.host')}
                        value={ip}
                        onChange={(event) => setIp(event.target.value)}
                        autoComplete='off'
                        disabled={isLoading}
                    />

                    <label className='server-setup-label' htmlFor='server-port'>
                        {t('electron.serverSetup.labels.port')}
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
                        {isLoading ? t('electron.serverSetup.actions.checking') : t('electron.serverSetup.actions.save')}
                    </button>
                </form>
            </div>
        </div>
    )
}
