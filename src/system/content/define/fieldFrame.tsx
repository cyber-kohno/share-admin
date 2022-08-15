import { useContext, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import RegulationUtil from "../../utils/regulationUtil";
import { GlobalContext } from "../entry/entry";

const FieldFrame = (props: {
    fieldList: RegulationUtil.FieldProps[];
    setFieldList: (fieldList: RegulationUtil.FieldProps[]) => void;
    openDetailDialog: () => void;
    focusIndex: number;
    setFocusIndex: (focusIndex: number) => void;
    removeList: number[];
    setRemoveList: (removeList: number[]) => void;
}) => {
    // const { store, setStore } = useContext(GlobalContext);

    return (
        <_Wrap>{
            props.fieldList.map((field, i) => {

                const edit = () => {
                    props.openDetailDialog();
                }
                const remove = () => {
                    props.fieldList.splice(i, 1);
                    props.setFieldList(props.fieldList.slice());
                    // 既存のフィールドを削除した場合
                    if(field.fieldNo != -1) {
                        props.removeList.push(field.fieldNo);
                        props.setRemoveList(props.removeList);
                    }
                    if (i > 0) {
                        props.setFocusIndex(props.focusIndex - 1);
                    }
                }
                const add = () => {
                    props.fieldList.push(RegulationUtil.createInitialField());
                    props.setFieldList(props.fieldList.slice());
                    props.setFocusIndex(props.focusIndex + 1);
                }
                const swapUp = () => {
                    const cache = props.fieldList[i];
                    props.fieldList[i] = props.fieldList[i - 1];
                    props.fieldList[i - 1] = cache;
                    props.setFieldList(props.fieldList.slice());
                    props.setFocusIndex(props.focusIndex - 1);
                }
                const swapDown = () => {
                    const cache = props.fieldList[i];
                    props.fieldList[i] = props.fieldList[i + 1];
                    props.fieldList[i + 1] = cache;
                    props.setFieldList(props.fieldList.slice());
                    props.setFocusIndex(props.focusIndex + 1);
                }
                const select = () => {
                    props.setFocusIndex(i);
                }

                const isFocus = props.focusIndex === i;
                let operationJsx = <></>;
                if (isFocus) {
                    operationJsx = (
                        <_Record>
                            <_Button isEnable={true} onClick={edit}>編集</_Button>
                            <_Button isEnable={props.fieldList.length > 1} onClick={remove}>削除</_Button>
                            <_Button isEnable={true} onClick={add}>追加</_Button>
                            <_Button isEnable={i > 0} onClick={swapUp}>上へ</_Button>
                            <_Button isEnable={i < props.fieldList.length - 1} onClick={swapDown}>下へ</_Button>
                        </_Record>
                    );
                }
                const fieldNoJsx = field.fieldNo === -1 ? <></> : <_No> [{field.fieldNo}]</_No>;
                const itemList: string[] = [];
                if(field.keyflg === '1') itemList.push('主キー');
                if(field.required === '1') itemList.push('必須');
                if(field.contUnique === '1') itemList.push('ユニーク');
                const inputType = RegulationUtil.FieldInputTypeItems.find(item => item.key === field.inputType);
                return (<div key={i}>
                    <_ItemFrame isFocus={isFocus} onClick={select}>
                        <_Text><_Index>{(i + 1) + '.'}</_Index><_Name>{field.name}</_Name>{fieldNoJsx}</_Text>
                        <_Text>{itemList.map((item, j) => <span key={j}>[<_Check>{item}</_Check>]</span>)} 入力方式[<_Item>{inputType?.message}</_Item>]</_Text>
                    </_ItemFrame>
                    {operationJsx}
                </div>);
            })
        }</_Wrap>
    );
}

export default FieldFrame;


const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: left;
`;

const _ItemFrame = styled.div<{
    isFocus: boolean;
}>`
    display: inline-block;
    width: calc(100% - 10px);
    /* height: 140px; */
    background-color: #ffffff28;
    ${props => !props.isFocus ? '' : css`
        background-color: #00ffff28;
    `}
    text-align: left;
    box-sizing: border-box;
    /* border: 1px solid #ffffff61; */
    border-radius: 4px;
    margin: 5px 0 0 5px;
`;

const _Text = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 24px;
    padding: 0 0 0 10px;
    box-sizing: border-box;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #e5e8fa63;
`;

const _Index = styled.span<{
}>`
    color: #ffffff;
`;
const _Name = styled.span<{
}>`
    color: #dfd000;
`;
const _No = styled.span<{
}>`
    color: #ffffff76;
`;
const _Check = styled.span<{
}>`
    color: #da2121;
`;
const _Item = styled.span<{
}>`
    color: #a5cee9;
`;

const _Record = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
    /* background-color: #0011ff28; */
    text-align: left;
`;

const _Button = styled.div<{
    isEnable: boolean;
}>`
    display: inline-block;
    width: 100px;
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
    margin: 5px 0 5px 5px;
    ${props => props.isEnable ? '' : Styles.CSS_BUTTON_DISABLE}
    &: hover{
        background-color: #ffffff96;
    }
`;