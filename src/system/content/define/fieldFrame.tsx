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
}) => {
    const { store, setStore } = useContext(GlobalContext);

    return (
        <_Wrap>{
            props.fieldList.map((field, i) => {

                const edit = () => {
                    props.openDetailDialog();
                }
                const remove = () => {
                    props.fieldList.splice(i, 1);
                    props.setFieldList(props.fieldList.slice());
                    if (i > 0) {
                        props.setFocusIndex(props.focusIndex - 1);
                    }
                }
                const add = () => {
                    props.fieldList.push(RegulationUtil.createInitialField(i + 1));
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
                        </_Record>
                    );
                }
                return (<div key={i}>
                    <_ItemFrame isFocus={isFocus} onClick={select}>
                        <_Title><_Index>{(i + 1) + '.'}</_Index><_Name>{field.name}</_Name></_Title>
                        <_Title>商品ID</_Title>
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
    color: #df0000;
`;

const _Index = styled.span<{
}>`
    color: #ffffff;
`;
const _Name = styled.span<{
}>`
    color: #dfd000;
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