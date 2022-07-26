
namespace RegulationUtil {

    export type RuleProps = {
        id: string;
        name: string;
        outline: string;
        manageUsers: string;
        referAuth: ReferAuth;
        referUsers: string;
        registAuth: EditAuth;
        registUsers: string;
        searchLimit: SearchLimit;
        registLimit: RegistLimit;
        fixAuth: FixAuth;
        viewCreator: ViewCreator;
        available: Available;
        openFrom: string;
        openTo: string;
    }

    export const createInitialRuleProps = (): RuleProps => {
        return {
            id: '',
            name: '',
            outline: '',
            referAuth: 'no-login',
            referUsers: '{}',
            registAuth: 'login',
            registUsers: '',
            manageUsers: '',
            searchLimit: 'free',
            registLimit: 'unlimited',
            fixAuth: 'creator-only',
            viewCreator: 'always',
            available: 'close',
            openFrom: '',
            openTo: ''
        };
    }

    export type FieldProps = {
        fieldNo: number;
        sortNo: number;
        name: string;
        keyflg: string;
        unqflg: string;
        validate: string;
        outline: string;
        inputType: FieldInputType;
        list: string;
        chkmsg: string;
        initial: string;
        formWidth: number;
        colWidth: number;
    }

    export const createInitialField = (): FieldProps => {
        return {
            fieldNo: -1,
            sortNo: -1,
            name: '',
            keyflg: '',
            validate: JSON.stringify({
                required: false,
                eisu: false,
                useLenLimit: false,
                useNumLimit: false
            } as ValidateProps),
            unqflg: '',
            outline: '',
            inputType: 'text',
            list: JSON.stringify({
                type: 'direct',
                direct: ''
            } as ListProps),
            chkmsg: '',
            initial: '',
            formWidth: 200,
            colWidth: 200
        }
    }

    export type ListProps = {
        type: ListType;
        direct: string;
    }

    export type ListType = 'direct';
    export const ListTypeItems: {
        key: ListType;
        message: string;
    }[] = [
            { key: 'direct', message: '直接入力' },
        ];

    export type ValidateProps = {
        required: boolean;
        eisu: boolean;
        useLenLimit: boolean;
        lenMin?: number;
        lenMax?: number;
        useNumLimit: boolean;
        numMin?: number;
        numMax?: number;
    }

    export type FieldInputType = 'number' | 'text' | 'combobox' | 'check' | 'sentence' | 'image';
    export const FieldInputTypeItems: {
        key: FieldInputType;
        message: string;
    }[] = [
            { key: 'number', message: '数値' },
            { key: 'text', message: '文字列' },
            { key: 'combobox', message: '選択肢' },
            { key: 'check', message: 'チェック' },
            { key: 'sentence', message: '文章（複数行）' },
            { key: 'image', message: '画像' },
        ];

    export type ReferAuth = 'no-login' | 'login' | 'user-limit' | 'group-limit' | 'owner-only';

    export const ReferAuthItems: {
        key: ReferAuth;
        message: string;
    }[] = [
            { key: 'no-login', message: 'ログイン不要' },
            { key: 'login', message: 'ログインしている全ユーザ' },
            { key: 'user-limit', message: '許可したユーザのみ' },
            { key: 'group-limit', message: '指定したグループに属しているユーザのみ' },
            { key: 'owner-only', message: 'コンテンツ作成者のみ' },
        ];

    export type EditAuth = 'login' | 'user-limit' | 'group-limit' | 'owner-only';

    export const EditAuthItems: {
        key: EditAuth;
        message: string;
    }[] = [
            { key: 'login', message: 'ログインしている全ユーザ' },
            { key: 'user-limit', message: '許可したユーザのみ' },
            { key: 'group-limit', message: '指定したグループに属しているユーザのみ' },
            { key: 'owner-only', message: 'コンテンツ作成者のみ' },
        ];

    export type SearchLimit = 'free' | 'limit';

    export const SearchLimitItems: {
        key: SearchLimit;
        message: string;
    }[] = [
            { key: 'free', message: '検索制限をしない' },
            { key: 'limit', message: '検索制限をする' },
        ];

    export type RegistLimit = 'once' | 'unlimited';

    export const AddCountItems: {
        key: RegistLimit;
        message: string;
    }[] = [
            { key: 'once', message: '1ユーザ1件のみ入力可能（アンケート用）' },
            { key: 'unlimited', message: '制限なし' },
        ];

    export type FixAuth = 'all' | 'creator-owner' | 'creator-only';
    export const FixAuthItems: {
        key: FixAuth;
        message: string;
    }[] = [
            { key: 'all', message: '編集権限のある全ユーザ' },
            { key: 'creator-owner', message: 'データ作成者とコンテンツ作成者' },
            { key: 'creator-only', message: 'データ作成者のみ' },
        ];

    export type ViewCreator = 'always' | 'none' | 'any';
    export const ViewCreatorItems: {
        key: ViewCreator;
        message: string;
    }[] = [
            { key: 'always', message: '常に表示' },
            { key: 'none', message: '常に非表示' },
            { key: 'any', message: 'データ作成時に任意で表示' },
        ];

    export type Available = 'close' | 'open' | 'range';
    export const AvailableItems: {
        key: Available;
        message: string;
    }[] = [
            { key: 'close', message: '作成中（まだ公開しない）' },
            { key: 'open', message: '公開中' },
            { key: 'range', message: '期間を設定' }
        ];
}

export default RegulationUtil;