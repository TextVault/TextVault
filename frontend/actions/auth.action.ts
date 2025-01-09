"use server";

import { request } from '@/services/requestService';

export const registerUser = async (username: string, mail: string, password: string) => {
    return request.post('/account/register', JSON.stringify({u: username, m: mail, p: password}), {
        'Content-Type': 'application/json',
    });
}

export const loginUser = async (username: string, password: string) => {
    return request.post('/account/login', JSON.stringify({u: username, p: password}), {
        'Content-Type': 'application/json',
    });
}
