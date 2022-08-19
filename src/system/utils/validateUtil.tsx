
namespace ValidateUtil {

    export type ErrorType = 'required' | 'value' | 'relation'
    export type ErrorProps = {
        type: ErrorType;
        message: string;
    }

    export type Checker = (str: string) => ErrorProps | null;
    
    export const executeChecks = (str: string, checkerList: Checker[]) => {
        const list: ErrorProps[] = [];
        for (let i = 0; i < checkerList.length; i++) {
            const check = checkerList[i];
            const result = check(str);
            if (result != null) list.push(result);
        }
        return list;
    }


    export const getHalfEisuChecker = (): Checker => {
        const target = 'abcdefghijklmnopqrstuvwxyzABCDEFGHYJKLMNOPQRSTUVWXYZ0123456789_-';
        const error: ErrorProps = { type: 'value', message: '半角英数ではありません。' };
        return (str: string) => checkStr(str, target) ? null : error;
    }

    export const getEmptyChecker = (): Checker => {
        return (str: string) => str !== '' ? null : { type: 'required', message: '必須項目です。' };
    }

    export const getLengthRangeChecker = (minLen: number, maxLen: number): Checker => {
        return (str: string) => str.length >= minLen && str.length <= maxLen ? null :
            { type: 'value', message: `${minLen}～${maxLen}文字の範囲内で入力して下さい。` };
    }

    export const getLengthLimitChecker = (maxLen: number): Checker => {
        return (str: string) => str.length <= maxLen ? null : { type: 'value', message: `${maxLen}文字以内で入力して下さい。` };
    }

    const checkStr = (str: string, target: string) => {
        for (let i = 0; i < str.length; i++) {
            let exist = false;
            for (let j = 0; j < target.length; j++) {
                if (str.charAt(i) === target.charAt(j)) {
                    exist = true;
                    break;
                }
            }
            if (!exist) return false;
        }
        return true;
    }
}

export default ValidateUtil;