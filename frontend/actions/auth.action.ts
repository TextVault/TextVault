"use server";

import { cookies } from "next/headers";
import { request } from '@/services/requestService';

export const isAuthenticated = async () => {
    const isLoggedIn = (await cookies()).has("token");
    return isLoggedIn;
};

export const getUsername = async () => {
    const username = (await cookies()).get("username")?.value;
    return username;
};

export const getAuthCookie = async () => {
    const token = (await cookies()).get("token")?.value;
    return token;
};

export const deleteAuthCookie = async () => {
    (await cookies()).delete("token");
    (await cookies()).delete("username");
};

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
