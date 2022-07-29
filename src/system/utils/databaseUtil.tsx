

export namespace DatabaseUtil {

    // export const API_DOMAIN = 'https://vh-sqlite.glitch.me';
    export const API_DOMAIN = 'http://localhost:4112';


    export const createQueryRequestInit = (sql: string): RequestInit => {
        return {
            mode: 'cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql })
        }
    }

    export const sendQueryRequestToAPI = (queryType: 'select' | 'update', sql: string): Promise<Response> => {
        return fetch(API_DOMAIN + '/' + queryType,
            createQueryRequestInit(sql)
        );
    }
}

export default DatabaseUtil;
