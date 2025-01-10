'use server';

import { request } from '@/services/requestService';

export const getPaste = async (pasteId: string) => {
    return request.get(`/pastes/${pasteId}`, {});
}

export const createPaste = async (title: string, language: string, paste: string, token?: string) => {
    let headers = {};

    if (token !== undefined) {
        headers = {
            'Authorization': `Bearer ${token}`
        }
    }

    return request.post('/pastes', JSON.stringify({title: title, language: language, content: paste}), headers);
}

export const fetchPasteData = async (pasteId: string) => {
    return request.get(`/pastes/${pasteId}`, {});
}

export const deletePaste = async (pasteId: string, token?: string) => {
    let headers = {
        'Authorization': `Bearer ${token}`
    }

    return request.delete(`/pastes/${pasteId}`, headers);
}