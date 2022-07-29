import { useContext } from "react";
import styled from "styled-components";
import { MediaQueryContext } from "../entry/manageFrame";

const MenuCard = (props: {
    title: string;
    detail: JSX.Element;
    callback: () => void;
}) => {
    return (
        <_Wrap
            isWide={false}
            onClick={props.callback}
        >
            <_Title>{props.title}</_Title>
            <_DetailFrame>
                <_Detail>{props.detail}</_Detail>
            </_DetailFrame>
        </_Wrap>
    );
}

export default MenuCard;

const _Wrap = styled.div<{
    isWide: boolean;
}>`
    display: inline-block;
    width: calc(100% - 22px);
    height: 160px;
    background-color: white;
    background: radial-gradient(ellipse at top, #a1f0c2, #b6b6b6);
    border-radius: 10px;
    border: solid 2px #d1d1d1;
    box-sizing: border-box;
    margin: 5px;
    &:hover {
        opacity: 0.6;
    }
`;

const _Title = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 34px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #a89891;
`;

const _DetailFrame = styled.div<{
}>`
    display: inline-block;
    width: 100%;
    height: calc(100% - 40px);
    text-align: left;
`;

const _Detail = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    margin: 5px 0 0 5px;
    font-size: 18px;
    /* font-weight: 600; */
    font-family: 'Noto Serif JP', serif;
    background-color: #0000001d;
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
    color: #ffffff;
    text-align: left;
`;
