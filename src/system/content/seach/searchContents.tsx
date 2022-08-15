import { useContext, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import RegulationUtil from "../../utils/regulationUtil";
import SystemUtil from "../../utils/systemUtil";
import Regulation from "../define/defineManage";
import { GlobalContext } from "../entry/entry";
import DataViewer from "../refer/dataViewer";


export type ConteProps = {
    seq: number;
    owner: number;
    id: string;
    name: string;
    outline: string;
    cnt: number;
};

const SearchContents = (props: {
}) => {
    const { store, setStore } = useContext(GlobalContext);

    const user = store.user as SystemUtil.User;

    const [conteList, setConteList] = useState<ConteProps[]>([]);
    const [focusIndex, setFocusIndex] = useState(0);

    const updateConteList = () => {
        findContentsList().then((res) => {
            setConteList(res);
        });
    }
    useEffect(() => {
        updateConteList();
    }, []);

    return (
        <_Wrap>
            <_Button
                isEnable={true}
                onClick={() => {
                    // store.mode = 'entrance';
                    store.transition.backFrame();
                    setStore({ ...store });
                }}
            >戻る</_Button>
            {/* <_MessageFrame><_Message>{'aa'}</_Message></_MessageFrame> */}
            <_Frame>{
                conteList.map((conte, i) => {

                    const select = () => {
                        setFocusIndex(i);
                    }

                    const defineUpdate = () => {
                        // store.mode = 'refer';
                        store.transition.setNextFrame(<Regulation masterConteSeq={conte.seq} />);
                        setStore({ ...store });
                    }

                    const referData = () => {
                        // store.mode = 'refer';
                        store.transition.setNextFrame(<DataViewer conte={conte} />);
                        setStore({ ...store });
                    }

                    const remove = () => {
                        // store.mode = 'refer';
                        const list: string[] = [];
                        list.push(`DELETE FROM rcmsttbl where conteseq = ${conte.seq}`);
                        list.push(`DELETE FROM rcvaltbl where conteseq = ${conte.seq}`);
                        list.push(`DELETE FROM fieldtbl where conteseq = ${conte.seq}`);
                        list.push(`DELETE FROM contetbl where seq = ${conte.seq}`);
                        DatabaseUtil.sendQueryRequestToAPI('update', list.join(';')).then(() => {
                            updateConteList();
                        });
                    }
                    const isFocus = focusIndex === i;
                    let operationJsx = <></>;
                    if (isFocus) {
                        operationJsx = (
                            <_Record>
                                <_Button isEnable={conte.owner === user.seq} onClick={defineUpdate}>定義変更</_Button>
                                <_Button isEnable={true} onClick={referData}>データ</_Button>
                                <_Button isEnable={conte.owner === user.seq} onClick={remove}>削除</_Button>
                            </_Record>
                        );
                    }
                    return (
                        <div key={i}>
                            <_ItemFrame isFocus={isFocus} onClick={select}>
                                <_Title>{conte.id}</_Title>
                                <_Title>{conte.name}</_Title>
                                <_Title>{conte.cnt}</_Title>
                            </_ItemFrame>
                            {operationJsx}
                        </div>
                    );
                })
            }</_Frame>
        </_Wrap>
    );
}

export default SearchContents;


const findContentsList = async () => {
    const subQuery = `(SELECT count(*) from fieldtbl WHERE conteseq = conte.seq) as cnt`;
    const sql = `SELECT seq, owner, id, name, outline, ${subQuery} FROM contetbl conte`;
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as ConteProps[];
};

const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;

const _Frame = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 200px);
    background-color: #728f78;
    text-align: left;
    margin: 5px 0 0 0;
    overflow-y: auto;
    box-sizing: border-box;
    /* border: solid 1px #333; */
    border-radius: 8px;
    
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #1959A8;
    }
    &::-webkit-scrollbar-track {
        border-radius: 5px;
        box-shadow: 0 0 4px #aaa inset;
    }
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