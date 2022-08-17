
namespace ValidateUtil {

    export type ErrorType = 'required' | 'value' | 'relation'
    export type ErrorProps = {
        type: ErrorType;
        message: string;
    }

    export const executeChecks = (checkList: (() => null | ErrorProps)[]): null | ErrorProps => {
        for (let i = 0; i < checkList.length; i++) {
            const check = checkList[i];
            const result = check();
            if (result != null) return result;
        }
        return null;
    }

    export const checkHalfEisu = (str: string): ErrorProps | null => {
        const target = 'abcdefghijklmnopqrstuvwxyzABCDEFGHYJKLMNOPQRSTUVWXYZ0123456789_-';
        return checkStr(str, target) ? null : { type: 'value', message: '半角英数ではありません。' };
    }

    export const checkEmpty = (str: string): ErrorProps | null => {
        return str !== '' ? null : { type: 'required', message: '必須項目です。' };
    }

    export const checkLengthRange = (str: string, minLen: number, maxLen: number): ErrorProps | null => {
        return str.length >= minLen && str.length <= maxLen ? null :
            { type: 'value', message: `${minLen}～${maxLen}文字の範囲内で入力して下さい。` };
    }

    export const checkLengthLimit = (str: string, maxLen: number): ErrorProps | null => {
        return str.length <= maxLen ? null : { type: 'value', message: `${maxLen}文字以内で入力して下さい。` };
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