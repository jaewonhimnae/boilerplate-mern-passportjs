import axios from 'axios';
import {
    AUTH_USER,
} from './types';

export function auth() {
    const request = axios.get(`/api/users/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

