import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../design/styles";

namespace ListManager {

    export type TargetSet = {
        seq: number;
        id: string;
    };
    export const Component = (props: {
        userList: string[];
        setUserList: (userList: string[]) => void;
        targetList: TargetSet[];
    }) => {
        const [userId, setUserId] = useState('');

        const getSeq = (userId: string) => {
            const target = props.targetList.find(target => target.id === userId);
            return target == undefined ? null : target.seq;
        }
        const getUserId = (seq: number) => {
            const target = props.targetList.find(target => target.seq === seq);
            return target == undefined ? null : target.id;
        }
        const userIdList = useMemo(() => {
            return props.userList.map(user => {
                const userId = getUserId(Number(user));
                // alert(userId);
                return userId ?? '?';
            });
        }, [props.userList]);

        return (<>
            <_TextForm type={'text'} value={userId} onChange={(e) => {
                setUserId(e.target.value);
            }} />
            <_Button
                isEnable={true}
                onClick={() => {
                    const result = props.targetList.find(target => target.id === userId);
                    if (result != undefined) {
                        const seq = getSeq(userId);
                        if (seq != null && !props.userList.includes(seq.toString())) {
                            props.userList.push(seq.toString());
                        }
                        props.setUserList(props.userList.slice());
                    }
                    setUserId('');
                }}
            >追加</_Button>
            <_ListFrame>
                {userIdList.map((item, i) => (
                    <_ListItem key={i}>{item}<_ItemDelete onClick={()=>{
                        props.userList.splice(i, 1);
                        props.setUserList(props.userList.slice());
                    }}>×</_ItemDelete></_ListItem>
                ))}
            </_ListFrame>
        </>);
    }
}

export default ListManager;


const _TextForm = styled.input<{
    width?: number;
}>`
    display: inline-block;
    width: 250px;
    vertical-align: top;
    ${props => props.width == undefined ? '' : css`
        width: ${props.width}px;
    `}
    height: 30px;
    font-size: 18px;
    margin: 5px 2px 0 10px;
    padding: 0 0 0 4px;
    box-sizing: border-box;
    color: #330f00;
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
    vertical-align: top;
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


const _ListFrame = styled.div<{
}>`
    display: inline-block;
    width: calc(100% - 8px);
    height: 100px;
    background-color: #5f816c;
    height: 80px;
    margin: 4px 0 0 4px;
    box-sizing: border-box;
    border: solid 1px #b6cebc;
    padding: 4px;
`;
const _ListItem = styled.div<{
}>`
    display: inline-block;
    background-color: #ffffff52;
    padding: 0 10px;
    margin: 2px 2px;
    box-sizing: border-box;
    height: 30px;
    font-size: 18px;
    color: #230b8d;
    border-radius: 4px;
    vertical-align: top;
`;
const _ItemDelete = styled.div<{
}>`
    display: inline-block;
    background-color: #ffffff24;
    width: 20px;
    height: 20px;
    margin: 5px 0 0 8px;
    font-size: 18px;
    color: #11034ecf;
    border: solid 1px #000000a0;
    padding-left: 2px;
    box-sizing: border-box;
    line-height: 16px;
    border-radius: 8px;
    vertical-align: top;
    &:hover {
        background-color: #ffffff68;
    }
`;