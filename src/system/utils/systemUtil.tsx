import { Base64 } from "js-base64";
import Hashids from 'hashids';
import DatabaseUtil from "./databaseUtil";

namespace SystemUtil {
    export const MOBILE_RANGE = '(max-width: 519px)';
    export const TABLET_RANGE = '(min-width: 520px) and (max-width: 959px)';
    export const PC_RANGE = '(min-width: 960px)';

    export const APP_URL = 'http://localhost:4111';

    export const HEADER_WIDTH = 40;
    const hashids = new Hashids('share-admin', 8);

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
        const hash = hashids.encode(conteseq);
        const hashedKey = Base64.encode(hash, true);
        return hashedKey;
    }
    export const getDecryptionedConteSeq = (hashedContesSeq: string) => {
        const decryptioned = Number(hashids.decode(Base64.decode(hashedContesSeq)));
        return decryptioned;
    }

    export const getConteURL = (conteseq: number) => {
        const hashedKey = getHashedConteSeq(conteseq);
        const url = `${APP_URL}/#/conte?v=${hashedKey}`;
        return url;
    }

    export const toCamelCase = (str: string) => {
        return str.split('_').map(function(word,index){
          if (index === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
      }
}

export default SystemUtil;