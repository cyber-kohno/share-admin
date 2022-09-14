import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../design/styles";
import ValidateUtil from "./validateUtil";

namespace FormUtil {

    export type InputManager = {
        normal: boolean;
        validators: ValidateUtil.Validator[];
    }

    export const ItemFrame = (props: {
        title: string;
        isEnable?: boolean;
        innerJsx: JSX.Element;
    }) => {
        const isEnable = props.isEnable ?? true;

        return (
            <_Record isEnable={isEnable}>
                <_Title>{props.title}</_Title>
                {props.innerJsx}
            </_Record>
        );
    }

    export const InputItem = (props: {
        title: string;
        formValue: string;
        formWidth?: number;
        isEnable?: boolean;
        isVisible?: boolean;
        setFormValue: (formValue: string) => void;
        inputType: 'text' | 'number' | 'combobox' | 'checkbox' | 'sentence';
        validators?: ValidateUtil.Validator[];
        setAcceptForm?: (isAccept: boolean) => void;
        relationForms?: string[];
        listItems?: { value: string, message: string }[];
        checkMessage?: string;
        extChangeProc?: () => void;
        resetValue?: string;
        extend?: JSX.Element;
    }) => {

        const isEnable = props.isEnable ?? true;
        const isVisible = props.isVisible ?? true;
        const [errors, setErrors] = useState<ValidateUtil.ErrorProps[]>([]);

        useEffect(() => {
            if (!isEnable) {
                // 非活性時の処理
                setErrors([]);
                if (props.setAcceptForm != undefined) {
                    props.setAcceptForm(true);
                }
                if (props.resetValue != undefined) {
                    props.setFormValue(props.resetValue);
                }
            } else {
                // 非活性解除時の処理
                errorCheck(props.formValue);
            }
        }, [isEnable]);

        const errorCheck = (value: string) => {
            if (props.validators == undefined || !isEnable) return;
            const errors = ValidateUtil.executeChecks(value, props.validators);
            setErrors(errors);

            if (props.setAcceptForm != undefined) {
                props.setAcceptForm(errors.length === 0);
            }
        }

        const changeAction = (value: string) => {
            props.setFormValue(value);
            if (props.extChangeProc != undefined) {
                props.extChangeProc();
            }
            errorCheck(value);
        }

        // 生成時にエラーチェックを行う
        let checkTrgArr = [props.formValue];
        if (props.relationForms != undefined) checkTrgArr = checkTrgArr.concat(props.relationForms);
        useEffect(() => {
            errorCheck(props.formValue);
        }, checkTrgArr);

        const errorTypes = errors.map(error => error.type);

        const getFormJsx = () => {
            switch (props.inputType) {
                case 'text': return (<>
                    <_TextForm
                        type={'text'}
                        value={props.formValue}
                        width={props.formWidth}
                        isEmptyError={errorTypes.includes('required')}
                        isValueError={errorTypes.includes('value')}
                        isRelationError={errorTypes.includes('relation')}
                        onChange={(e) => {
                            changeAction(e.target.value);
                        }}
                    />
                    {props.extend}
                </>);
                case 'number': return (
                    <_TextForm
                        type={props.formValue !== '' ? 'number' : 'text'}
                        value={props.formValue}
                        width={props.formWidth}
                        isEmptyError={errorTypes.includes('required')}
                        isValueError={errorTypes.includes('value')}
                        isRelationError={errorTypes.includes('relation')}
                        onChange={(e) => {
                            changeAction(e.target.value);
                        }}
                    />
                );
                case 'combobox': return (
                    <_Combobox
                        value={props.formValue}
                        width={props.formWidth}
                        onChange={(e) => {
                            changeAction(e.target.value);
                        }}
                    >
                        {props.listItems == undefined ? <></> : props.listItems.map((item, i) => (
                            <option key={i} value={item.value}>{item.message}</option>
                        ))}
                    </_Combobox>
                );
                case 'checkbox': return (
                    <_CheckDiv>
                        <_CheckForm
                            type={'checkbox'}
                            checked={props.formValue === '1'}
                            onChange={(e) => {
                                changeAction(e.target.checked ? '1' : '');
                            }} /><_CheckText>{props.checkMessage}</_CheckText>
                    </_CheckDiv>
                );
                case 'sentence': return (
                    <_TextArea
                        value={props.formValue} onChange={(e) => {
                            changeAction(e.target.value);
                        }}
                        isEmptyError={errorTypes.includes('required')}
                        isValueError={errorTypes.includes('value')}
                        isRelationError={errorTypes.includes('relation')}
                    />
                )
            }
        }

        const errorJsxList = errors.map((error, i) => (
            <_Error key={i}>{error.message}</_Error>
        ));
        return (
            <_Record isEnable={isEnable}>
                <_Title>{props.title}</_Title>
                {getFormJsx()}
                {errorJsxList}
            </_Record>
        );
    }
}

export default FormUtil;

const _Record = styled.div<{
    isEnable?: boolean;
}>`
    display: inline-block;
    ${props => (props.isEnable == undefined || props.isEnable) ? '' : Styles.CSS_BUTTON_DISABLE}
    width: 100%;
    min-height: 140px;
    background-color: #9b8f8f28;
    text-align: left;
    margin: 5px 0 0 0;
    padding: 0 0 5px 0;
    box-sizing: border-box;
`;

const _Title = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 24px;
    padding: 0 0 0 10px;
    box-sizing: border-box;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #330f00;
`;

const _TextForm = styled.input<{
    width?: number;
    isEmptyError: boolean;
    isValueError: boolean;
    isRelationError: boolean;
}>`
    display: inline-block;
    width: calc(100% - 22px);
    ${props => props.width == undefined ? '' : css`
        width: ${props.width}px;
    `}
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
    ${props => !props.isRelationError ? '' : css`
        background-color: #75f591;
    `}
    ${props => !props.isValueError ? '' : css`
        background-color: #fa6e6e;
    `}
    ${props => !props.isEmptyError ? '' : css`
        background-color: #ece367;
    `}
`;

const _CheckDiv = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    /* background-color: #ffd90028; */
`;
const _CheckText = styled.span<{
}>`
    color: #330f00;
    /* background-color: #9b8f8f28; */
`;
const _CheckForm = styled.input<{
}>`
    /* width: 30px;
    height: 30px; */
    /* background-color: #e6424228; */
`;

const _TextArea = styled.textarea<{
    isEmptyError: boolean;
    isValueError: boolean;
    isRelationError: boolean;
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 60px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
    resize: none;
    ${props => !props.isRelationError ? '' : css`
        background-color: #75f591;
    `}
    ${props => !props.isValueError ? '' : css`
        background-color: #fa6e6e;
    `}
    ${props => !props.isEmptyError ? '' : css`
        background-color: #ece367;
    `}
`;

const _TextLabel = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #3529a0;
    background-color: #ffffff78;
    border: solid 1px #000;
`;

const _Combobox = styled.select<{
    width?: number;
}>`
    display: inline-block;
    width: calc(100% - 22px);
    ${props => props.width == undefined ? '' : css`
        width: ${props.width}px;
    `}
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #3529a0;
    background-color: #ffffff78;
    border: solid 1px #000;
`;

const _Error = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    /* background-color: #ffd90028; */
    color: red;
`;