import { ofetch } from "ofetch";
import { FetchError } from "ofetch";

const baseURL = process.env.TEXTVAULT_BACKEND_URL;

class RequestService {
    async get(endpoint: string, headers: any) {
        try {
            const response = await ofetch(`${baseURL}${endpoint}`, {
                method: 'GET',
                headers: headers,
            })
            return response
        } catch (error) {
            this.handleError(error as FetchError);
        }
    }

    async post(endpoint: string, data: any, headers: any) {
        try {
            const response = await ofetch(`${baseURL}${endpoint}`, {
                method: 'POST',
                body: data,
                headers: headers,
            })
            return response
        } catch (error) {
            this.handleError(error as FetchError);
        }
    }

    async delete(endpoint: string, headers: any) {
        try {
            const response = await ofetch(`${baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            })
            return response
        } catch (error) {
            this.handleError(error as FetchError);
        }
    }

    private handleError(error: FetchError) {
        if (!error.data) {
            throw new Error('Service unavailable')
        }
        throw new Error(error.data.error_message || error.message || 'Failed to load data')
    }
}

export const request = new RequestService();