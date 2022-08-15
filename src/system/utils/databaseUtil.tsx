import { Base64 } from "js-base64";

export namespace DatabaseUtil {

    export const API_DOMAIN = 'https://crud-server001.glitch.me/';
    // export const API_DOMAIN = 'http://localhost:4112';
    


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

    /**
     * 文字列を圧縮する
     * @param val 圧縮前の文字列
     * @returns 圧縮後の文字列
     */
    export const gZip = (val: string) => {
        return Base64.encode(val);
    }

    /**
     * 圧縮された文字列を複号する
     * @param val 圧縮された文字列
     * @returns 複号後の文字列
     */
    export const unZip = (val: string) => {
        return Base64.decode(val);
    }

    /**
     * Date型の日時を文字列に変換する
     * @param date Date型の日時
     * @returns 文字列の日時
     */
    export const getStringFromDate = (date: Date) => {

        const year_str = date.getFullYear().toString();
        //月だけ+1すること
        const month_str = (1 + date.getMonth()).toString();
        const day_str = date.getDate().toString();
        const hour_str = date.getHours().toString();
        const minute_str = date.getMinutes().toString();
        const second_str = date.getSeconds().toString();

        let format_str = 'YYYY-MM-DD hh:mm:ss';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        format_str = format_str.replace(/ss/g, second_str);

        return format_str;
    };


    export const findMasterConte = async (seq: number) => {
        const sql = `SELECT * FROM contetbl conte WHERE seq = ${seq}`;
        const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
        const results = await response.json() as any[];
        return results[0];
    };

    export const findMasterFieldList = async (seq: number) => {
        const sql = `SELECT * FROM fieldtbl conte WHERE conteseq = ${seq} ORDER BY sort_no`;
        const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
        return await response.json() as any[];
    };

    export const createUpdateQuery = (tableName: string, itemSets: { col: string, val: string | number }[], whereQuery: string) => {
        return `UPDATE ${tableName} SET ${itemSets.map(item => `${item.col} = '${item.val}'`).join(',')} WHERE ${whereQuery}`;
    }

    export const createInsertQuery = (tableName: string, itemSets: { col: string, val: string | number, isQuat?: boolean }[]) => {
        const cols = itemSets.map(item => item.col).join(',');
        const values = itemSets.map(item => (item.isQuat ?? true) ? `'${item.val}'` : `${item.val}`).join(',');
        return `INSERT INTO ${tableName}(${cols}) VALUES(${values})`;
    }
}

export default DatabaseUtil;
