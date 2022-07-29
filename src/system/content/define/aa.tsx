import { useContext } from "react";
import styled from "styled-components";
import { GlobalContext } from "../entry/entry";

const RegFormItem = (props: {
    label: string
    type?: 'text' | 'combobox'
}) => {
    const { store, setStore } = useContext(GlobalContext);

    return (
        <_Wrap>
            <_Label>{props.label}</_Label>
        </_Wrap>
    );
}

export default RegFormItem;

const LABEL_WIDTH = 250;

const _Wrap = styled.div`
    display: inline-block;
    width: calc(100% - 2px);
    height: 50px;
    /* margin: 4px 0 0 4px; */
    background-color: #e6e6e6cf;
    margin: 0 0 10px 0;
    /* border-left: 1px solid #000000c3;
    border-top: 1px solid #000000c3;
    border-right: 1px solid #000000c3; */
    text-align: left;
`;

const _Label = styled.div`
    display: inline-block;
    width: 250px;
    height: 40px;
    /* margin: 4px 0 0 4px; */
    background-color: #43b6da44;
    margin: 5px 0 0 10px;
    /* border-left: 1px solid #000000c3;
    border-top: 1px solid #000000c3;
    border-right: 1px solid #000000c3; */
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #00308f;
`;