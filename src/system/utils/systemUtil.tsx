
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
}

export default SystemUtil;