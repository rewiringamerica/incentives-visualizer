import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

import type { paths } from '../types/api.gen';

export function createApi(baseUrl: string) {
  const fetchClient = createFetchClient<paths>({
    baseUrl,
  });

  return fetchClient;
}

export function createReactQueryApi(baseUrl: string) {
  return createClient(createApi(baseUrl));
}

export const $api = createReactQueryApi('http://localhost:3000');
