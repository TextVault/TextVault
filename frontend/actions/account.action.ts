"use server";

import { getAuthCookie } from './auth.action';
import { request } from '@/services/requestService';

export const fetchUserPastes = async () => {
    return request.get('/account/pastes', { 'Authorization': `Bearer ${await getAuthCookie()}` });
}
