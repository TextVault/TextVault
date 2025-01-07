"use server";

import { cookies } from "next/headers";
import type { FetchError } from 'ofetch'
import { ofetch } from 'ofetch'

const baseURL = process.env.TEXTVAULT_BACKEND_URL;

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
    console.log(username, mail, password);
    try {
        const response = await ofetch(`${baseURL}/account/register`, {
            method: 'POST',
            body: {
                u: username,
                m: mail,
                p: password,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log(response)
        return response
    } catch (error) {
        const fetchError = error as FetchError
        if (!fetchError.data) {
            throw new Error('Service unavailable')
        }

        const errorMessage = fetchError.data.error || fetchError.message || 'Registration failed'
        console.log(errorMessage)

        throw new Error(errorMessage)
    }
}

export const loginUser = async (username: string, password: string) => {

    try {
        const response = await ofetch(`${baseURL}/account/login`, {
            method: 'POST',
            body: {
                u: username,
                p: password,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return response
    } catch (error) {
        const fetchError = error as FetchError
        if (!fetchError.data) {
            throw new Error('Service unavailable')
        }

        const errorMessage = fetchError.data.error || fetchError.message || 'Login failed'

        throw new Error(errorMessage)
    }
}
