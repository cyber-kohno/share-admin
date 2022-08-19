import { useContext, useState } from "react";
import styled from "styled-components";
import Styles from "../../design/styles";
import RegulationUtil from "../../utils/regulationUtil";
import ValidateUtil from "../../utils/validateUtil";
import { GlobalContext } from "../entry/entry";

const FieldDetailDialog = (props: {
    index: number;
    fieldProps: RegulationUtil.FieldProps;
    apply: (fieldCache: RegulationUtil.FieldProps) => void;
    close: () => void;
}) => {
    // const { store, setStore } = useContext(GlobalContext);

    const [fieldCache, setFieldCache] = useState({ ...props.fieldProps });

    const [errorName, setErrorName] = useState<ValidateUtil.ErrorProps | null>(null);

    const update = () => { setFieldCache({ ...fieldCache }) };


    return (
        <_Wrap>
            <_Frame>
                <_Scroll>
                    <_Record>
                        <_Title>連番</_Title>
                        <_TextLabel>{props.index + 1}</_TextLabel>
                    </_Record>
                    <_Record>
                        <_Title>項目名</_Title>
                        <_TextForm type={'text'} value={fieldCache.name} onChange={(e) => {
                            const str = e.target.value;
                            fieldCache.name = e.target.value;
                            setErrorName(ValidateUtil.executeChecks([
                                () => ValidateUtil.getEmptyChecker(str),
                                () => ValidateUtil.getLengthLimitChecker(str, 20)
                            ]));
                            update();
                        }} />
                        {/* <_Error>{errorName}</_Error> */}
                    </_Record>
                    <_Record>
                        <_Title>キー</_Title>
                        <_CheckDiv>
                            <_CheckForm type={'checkbox'} checked={fieldCache.keyflg === '1'} onChange={(e) => {
                                fieldCache.keyflg = e.target.checked ? '1' : '';
                                update();
                            }} /><_CheckText>データを特定するためのキー項目とする</_CheckText>
                        </_CheckDiv>
                    </_Record>
                    <_Record>
                        <_Title>重複許可</_Title>
                        <_CheckDiv>
                            <_CheckForm type={'checkbox'} checked={fieldCache.unqflg === '1'} onChange={(e) => {
                                fieldCache.unqflg = e.target.checked ? '1' : '';
                                update();
                            }} /><_CheckText>重複を認めない</_CheckText>
                        </_CheckDiv>
                    </_Record>
                    <_Record>
                        <_Title>項目の概要</_Title>
                        <_TextArea value={fieldCache.outline} onChange={(e) => {
                            fieldCache.outline = e.target.value;
                            update();
                        }} />
                    </_Record>
                    <_Record>
                        <_Title>入力方式</_Title>
                        <_Combobox value={fieldCache.inputType} onChange={(e) => {
                            fieldCache.inputType = e.target.value as RegulationUtil.FieldInputType;
                            update();
                        }} >
                            {RegulationUtil.FieldInputTypeItems.map((item, i) => (
                                <option key={i} value={item.key}>{item.message}</option>
                            ))}
                        </_Combobox>
                    </_Record>
                    <_Record>
                        <_Title>必須</_Title>
                        <_CheckDiv>
                            <_CheckForm type={'checkbox'} checked={fieldCache.validate === '1'} onChange={(e) => {
                                fieldCache.validate = e.target.checked ? '1' : '';
                                update();
                            }} /><_CheckText>必須項目とする</_CheckText>
                        </_CheckDiv>
                    </_Record>
                    <_Record isEnable={props.fieldProps.inputType === 'combobox'}>
                        <_Title>選択肢</_Title>
                        <_TextForm type={'text'} value={fieldCache.list} onChange={(e) => {
                            fieldCache.list = e.target.value;
                            update();
                        }} />
                    </_Record>
                    <_Record isEnable={true}>
                        <_Title>初期値</_Title>
                        <_TextForm type={'text'} value={fieldCache.default} onChange={(e) => {
                            fieldCache.default = e.target.value;
                            update();
                        }} />
                    </_Record>
                    <_Record>
                        <_Title>テーブル列幅</_Title>
                        <_TextForm type={'number'} value={fieldCache.width} onChange={(e) => {
                            fieldCache.width = Number(e.target.value);
                            update();
                        }} />
                    </_Record>
                </_Scroll>
                <_Button isEnable={true} onClick={() => {
                    props.apply(fieldCache);
                    props.close();
                }}>更新</_Button>
                <_Button isEnable={true} onClick={props.close}>キャンセル</_Button>
            </_Frame>
        </_Wrap>
    );
}

export default FieldDetailDialog;

const _Wrap = styled.div`
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #0000008b;
    text-align: center;
`;

const _Frame = styled.div`
    display: inline-block;
    /* width: calc(100% - 30px); */
    max-width: 960px;
    height: calc(100% - 30px);
    /* margin: 4px 0 0 4px; */
    background-color: #b6ccbcdd;
    border-radius: 4px;
    margin: 15px 0 0 15px;
    /* border: 1px solid #ffffffc3; */
    text-align: left;
`;

const _Scroll = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 45px);
    /* margin: 4px 0 0 4px; */
    background-color: #a7b8ac;
    border-radius: 4px;
    margin: 5px 0 0 0;
    /* border: 1px solid #ffffffc3; */
    text-align: center;
    overflow: auto;
`;


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