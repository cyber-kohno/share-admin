import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Styles from "../../design/styles";
import RegulationUtil from "../../utils/regulationUtil";
import { GlobalContext } from "../entry/entry";
import { FieldProps } from "./dataViewer";

const DataEditDialog = (props: {
    fieldList: FieldProps[];
    regist: (forms: string[]) => void;
    close: () => void;
}) => {
    const { store, setStore } = useContext(GlobalContext);

    const [forms, setForms] = useState<string[]>([]);

    useEffect(() => {
        setForms(new Array<string>(props.fieldList.length).fill(''));
    }, []);

    const fieldJsxList = forms.map((form, i) => {
        const field = props.fieldList[i];
        const getFormJsx = () => {
            switch (field.inputType) {
                case 'text': return (
                    <_TextForm value={form} onChange={(e) => {
                        forms[i] = e.target.value;
                        setForms(forms.slice());
                    }} />
                );
                case 'number': return (
                    <_NumberForm type={'number'} value={form} onChange={(e) => {
                        forms[i] = e.target.value;
                        setForms(forms.slice());
                    }} />
                );
                case 'combobox': return (
                    <_Combobox value={form} onChange={(e) => {
                        forms[i] = e.target.value;
                        setForms(forms.slice());
                    }} >{field.list.split(',').map((value, j) => {
                        return <option key={j} value={value}>{value}</option>;
                    })}</_Combobox>
                );
                case 'sentence': return (
                    <_TextArea value={form} onChange={(e) => {
                        forms[i] = e.target.value;
                        setForms(forms.slice());
                    }} />
                );
            }
        }
        return (
            <_Record key={i}>
                <_Title>{field.no + 1}.{field.name}</_Title>
                {getFormJsx()}
            </_Record>
        );
    }, []);
    return (
        <_Wrap>
            <_Frame>
                {fieldJsxList}
                <_Button isEnable={true} onClick={() => {
                    props.regist(forms);
                    props.close();
                }}>更新</_Button>
                <_Button isEnable={true} onClick={props.close}>キャンセル</_Button>
            </_Frame>
        </_Wrap>
    );
}

export default DataEditDialog;

const _Wrap = styled.div`
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #0000008b;
    text-align: left;
`;

const _Frame = styled.div`
    display: inline-block;
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    /* margin: 4px 0 0 4px; */
    background-color: #b6ccbcdd;
    border-radius: 4px;
    margin: 15px 0 0 15px;
    /* border: 1px solid #ffffffc3; */
    text-align: left;
`;

const _Record = styled.div`
    display: inline-block;
    width: 100%;
    height: 140px;
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

const _NumberForm = styled.input<{
}>`
    display: inline-block;
    width: 200px;
    height: 30px;
    font-size: 18px;
    margin: 0 0 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
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

const _Button = styled.div<{
    isEnable: boolean;
}>`
    display: inline-block;
    width: 150px;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #5f5856;
    background-color: #ffffff78;
    border: 1px solid #00000084;
    border-radius: 6px;
    text-align: center;
    box-sizing: border-box;
    margin: 5px 0 0 0;
    ${props => props.isEnable ? '' : Styles.CSS_BUTTON_DISABLE}
    &: hover{
        background-color: #ffffff96;
    }
`;