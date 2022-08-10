import { Base64 } from "js-base64";
import Hashids from 'hashids';
import DatabaseUtil from "./databaseUtil";

namespace SystemUtil {
    export const MOBILE_RANGE = '(max-width: 519px)';
    export const TABLET_RANGE = '(min-width: 520px) and (max-width: 959px)';
    export const PC_RANGE = '(min-width: 960px)';

    export const HEADER_WIDTH = 40;

    export type MediaQuery = 'mobile' | 'tablet' | 'pc';

    export type Mode =
        'entrance' |
        'regulation' |
        'search' |
        'refer' |
        'account'
        ;

    export type User = {
        seq: number;
        id: string;
    }


    export const getHashedConteSeq = (conteseq: number) => {

        const hashids = new Hashids('share-admin', 12);
        const hash = hashids.encode(conteseq);
        const hashedKey = Base64.encode(hash, true);
        return hashedKey;
    }
    export const getDecryptionedConteSeq = (hashedContesSeq: string) => {
        const hashids = new Hashids('share-admin', 12);
        const decryptioned = Number(hashids.decode(Base64.decode(hashedContesSeq)));
        return decryptioned;
    }

    export const getConteURL = (conteseq: number) => {
        const hashedKey = getHashedConteSeq(conteseq);
        const url = `http://localhost:4111/#/conte?v=${hashedKey}`;
        return url;
    }
}

export default SystemUtil;