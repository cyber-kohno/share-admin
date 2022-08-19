import { useState } from "react";
import styled from "styled-components";
import Styles from "../design/styles";
import ValidateUtil from "./validateUtil";

namespace FormUtil {

    export const InputItem = (props: {
        title: string;
        formValue: string;
        setFormValue: (formValue: string) => void;
        inputType: 'text' | 'combobox' | 'checkbox' | 'long';
        validators: ValidateUtil.Checker[];
        listItems: {value: string, message: string}[];
        checkMessage: string;
    }) => {
        const [errors, setErrors] = useState<ValidateUtil.ErrorProps[]>([]);

        const changeAction = (value: string) => {
            props.setFormValue(value);
            const errors = ValidateUtil.executeChecks(value, props.validators);
            setErrors(errors);
            if(errors.length > 0) {
                
            }
        }

        const getFormJsx = () => {
            switch (props.inputType) {
                case 'text': return (
                    <_TextForm type={'text'} value={props.formValue} onChange={(e) => {
                        changeAction(e.target.value);
                    }} />
                );
                case 'combobox': return (
                    <_Combobox value={props.formValue} onChange={(e) => {
                        changeAction(e.target.value);
                    }} >
                        {props.listItems.map((item, i) => (
                            <option key={i} value={item.value}>{item.message}</option>
                        ))}
                    </_Combobox>
                );
                case 'checkbox': return (<>
                    <_CheckForm
                        type={'checkbox'}
                        checked={props.formValue === '1'}
                        onChange={(e) => {
                            changeAction(e.target.checked ? '1' : '');
                        }} /><_CheckText>{props.checkMessage}</_CheckText>
                </>);
            }
        }

        const errorJsxList = errors.map((error, i) => (
            <_Error key={i}>{error.message}</_Error>
        ));
        return (
            <_Record>
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
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
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
    background-color: #ffd90028;
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