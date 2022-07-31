import { useContext } from "react";
import styled from "styled-components";
import Styles from "../../design/styles";
import RegulationUtil from "../../utils/regulationUtil";
import { GlobalContext } from "../entry/entry";

const FieldDetailDialog = (props: {
    index: number;
    fieldProps: RegulationUtil.FieldProps;
    update: () => void;
    close: () => void;
}) => {
    const { store, setStore } = useContext(GlobalContext);

    return (
        <_Wrap>
            <_Frame>
                <_Record>
                    <_Title>連番</_Title>
                    <_TextLabel>{props.index + 1}</_TextLabel>
                </_Record>
                <_Record>
                    <_Title>項目名</_Title>
                    <_TextForm type={'text'} value={props.fieldProps.name} onChange={(e) => {
                        props.fieldProps.name = e.target.value;
                        props.update();
                    }} />
                </_Record>
                <_Record>
                    <_Title>項目の概要</_Title>
                    <_TextArea value={props.fieldProps.outline} onChange={(e) => {
                        props.fieldProps.outline = e.target.value;
                        props.update();
                    }} />
                </_Record>
                <_Record>
                    <_Title>入力方式</_Title>
                    <_Combobox value={props.fieldProps.inputType} onChange={(e) => {
                        props.fieldProps.inputType = e.target.value as RegulationUtil.FieldInputType;
                        props.update();
                    }} >
                        {RegulationUtil.FieldInputTypeItems.map((item, i) => (
                            <option key={i} value={item.key}>{item.message}</option>
                        ))}
                    </_Combobox>
                </_Record>
                <_Record isEnable={props.fieldProps.inputType === 'combobox'}>
                    <_Title>選択肢</_Title>
                    <_TextForm type={'text'} value={props.fieldProps.list} onChange={(e) => {
                        props.fieldProps.list = e.target.value;
                        props.update();
                    }} />
                </_Record>
                <_Record>
                    <_Title>テーブル列幅</_Title>
                    <_TextForm type={'number'} value={props.fieldProps.width} onChange={(e) => {
                        props.fieldProps.width = Number(e.target.value);
                        props.update();
                    }} />
                </_Record>
                <_Button isEnable={true} onClick={() => {
                    props.update();
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

const _Record = styled.div<{
    isEnable?: boolean;
}>`
    display: inline-block;
    ${props => (props.isEnable == undefined || props.isEnable) ? '' : Styles.CSS_BUTTON_DISABLE}
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