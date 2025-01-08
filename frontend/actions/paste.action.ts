import { isAuthenticated, getAuthCookie } from './auth.action'
import { request } from '@/services/requestService';

export const getPaste = async (pasteId: string) => {
    return request.get(`/pastes/${pasteId}`, {});
}

export const createPaste = async (title: string, language: string, paste: string) => {
    let headers = {};

    if ((await isAuthenticated())) {
        headers = {
            'Authorization': `Bearer ${await getAuthCookie()}`
        }
    }

    return request.post('/pastes', JSON.stringify({title: title, language: language, content: paste}), headers);
}

export const fetchPasteData = async (pasteId: string) => {
    return request.get(`/pastes/${pasteId}`, {});
}

export const deletePaste = async (pasteId: string) => {
    let headers = {
        'Authorization': `Bearer ${await getAuthCookie()}`
    }

    return request.delete(`/pastes/${pasteId}`, headers);
}