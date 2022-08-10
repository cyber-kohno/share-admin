
namespace RegulationUtil {

    export type RuleProps = {
        name: string;
        id: string;
        outline: string;
        referAuth: ReferAuth;
        editAuth: EditAuth;
        searchLimit: SearchLimit;
        addCount: AddCount;
        fixAuth: FixAuth;
        viewCreator: ViewCreator;
        available: Available;
        openFrom: string;
        openTo: string;
    }

    export type FieldProps = {
        name: string;
        outline: string;
        isUnique: boolean;
        inputType: FieldInputType;
        list: string;
        min?: number;
        max?: number;
        default: string;
        width: number;
    }

    export const createInitialField = (index: number): FieldProps => {
        return {
            name: `項目${index + 1}`,
            outline: '',
            inputType: 'text',
            isUnique: false,
            list: '',
            default: '',
            width: 200
        }
    }

    export type FieldInputType = 'number' | 'text' | 'combobox' | 'sentence';
    export const FieldInputTypeItems: {
        key: FieldInputType;
        message: string;
    }[] = [
            { key: 'number', message: '数値' },
            { key: 'text', message: '文字列' },
            { key: 'combobox', message: '選択肢' },
            { key: 'sentence', message: '文章（複数行）' },
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

    export type AddCount = 'once' | 'unlimited';

    export const AddCountItems: {
        key: AddCount;
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