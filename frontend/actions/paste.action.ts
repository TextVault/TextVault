import type { FetchError } from 'ofetch'
import { ofetch } from 'ofetch'
import { isAuthenticated, getAuthCookie } from './auth.action'

const baseURL = process.env.TEXTVAULT_BACKEND_URL;

export const getPaste = async (pasteId: string) => {
    try {
        const response = await ofetch(`${baseURL}/pastes/${pasteId}`, {
            method: 'GET',
        })

        return response
    } catch (error) {
        const fetchError = error as FetchError
        if (!fetchError.data) {
            throw new Error('Service unavailable')
        }

        const errorMessage = fetchError.data.error || fetchError.message || 'Paste not found'

        throw new Error(errorMessage)
    }
}

export const createPaste = async (title: string, language: string, paste: string) => {
    try {
        let headers = {};

        if (!(await isAuthenticated())) {
            headers = {
                'Authorization': `Bearer ${await getAuthCookie()}`
            }
        }
        const response = await ofetch(`${baseURL}/pastes/`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                language: language,
                content: paste
            }),
            headers: headers
        })

        return response
    } catch (error) {
        const fetchError = error as FetchError
        if (!fetchError.data) {
            throw new Error('Service unavailable')
        }

        const errorMessage = fetchError.data.error || fetchError.message || 'Paste creation failed'

        throw new Error(errorMessage)
    }
}

export const fetchPasteData = async (pasteId: string) => {
    try {
        const response = await ofetch(`${baseURL}/pastes/${pasteId}`, {
            method: 'GET',
        })
        console.log(response)
        return response
    } catch (error) {
        const fetchError = error as FetchError
        if (!fetchError.data) {
            throw new Error('Service unavailable')
        }

        const errorMessage = fetchError.data.error || fetchError.message || 'Paste not found'

        throw new Error(errorMessage)
    }
}