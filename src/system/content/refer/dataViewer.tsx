import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import RegulationUtil from "../../utils/regulationUtil";
import { GlobalContext } from "../entry/entry";
import { ConteProps } from "../seach/searchContents";
import DataEditDialog from "./dataEditDialog";

export type FieldProps = {
    no: number
    name: string,
    inputType: RegulationUtil.FieldInputType;
    list: string;
    width: number;
};

const DataViewer = (props: {
    conte: ConteProps;
}) => {
    const { store, setStore } = useContext(GlobalContext);

    const [fieldList, setFieldList] = useState<FieldProps[]>([]);
    const [dataRecordList, setDataRecordList] = useState<string[][]>([]);
    const [isDispDialog, setDispDialog] = useState(false);
    const [focusIndex, setFocusIndex] = useState(-1);

    const headerRef = useRef<HTMLDivElement>({} as HTMLDivElement);
    const tableRef = useRef<HTMLDivElement>({} as HTMLDivElement);

    useEffect(() => {
        findFieldList(props.conte.seq).then((res) => {
            setFieldList(res);
            findDataRecordList(props.conte.seq, res).then((resList) => {
                console.log(resList);
                setDataRecordList(resList.map((record) => res.map((field, j) => record[`val${j}`])));
            });
        });
    }, []);

    const openDetailDialog = () => {
        setDispDialog(true);
    }

    const columnJsxList = fieldList.map((field, i) => {
        return (
            <_Column key={i} width={field.width}>{field.name}</_Column>
        );
    });

    const dataRecordJsxList = useMemo(() => {
        return dataRecordList.map((record, i) => {
            return (
                <_Record key={i} onClick={()=>{
                    setFocusIndex(i);
                }}>
                    {record.map((col, j) => (
                        <_Cell key={j} width={fieldList[j].width} isFocus={focusIndex === i}>{col}</_Cell>
                    ))}
                </_Record>
            );
        });
    }, [dataRecordList, focusIndex]);

    return (
        <_Wrap>
            <_Button isEnable={true} onClick={() => {
                store.transition.backFrame();
                setStore({ ...store });
            }}>戻る</_Button>
            <_MessageFrame><_Message>{props.conte.outline}</_Message></_MessageFrame>
            <_OperationRecord>
                <_Switch isFocus={false}>テーブル</_Switch>
                <_Switch isFocus={false}>統計</_Switch>
                <_Switch isFocus={false}>ツリー</_Switch>
            </_OperationRecord>
            <_TableFrame>
                <_Header ref={headerRef}>
                    <_Record>{columnJsxList}</_Record>
                </_Header>
                <_Body ref={tableRef} onScroll={() => {
                    headerRef.current.scrollTo({ left: tableRef.current.scrollLeft })
                }}>
                    {dataRecordJsxList}
                </_Body>
            </_TableFrame>
            <_OperationRecord>
                <_Button isEnable={true} onClick={openDetailDialog}>レコード追加</_Button>
                <_Button isEnable={focusIndex !== -1}>編集</_Button>
            </_OperationRecord>
            {!isDispDialog ? <></> : <DataEditDialog
                fieldList={fieldList}
                regist={(forms: string[]) => {
                    const rowQuery = `(select max(row) from rcmsttbl WHERE conteseq = '${props.conte.seq}')`;
                    const nextRow = `(case when ${rowQuery} is null then -1 else ${rowQuery} end) + 1`;
                    const insertRcmstQuery = `INSERT INTO rcmsttbl(conteseq, row, user) VALUES('${props.conte.seq}', ${nextRow}, '${store.user?.seq}')`;
                    const insertRcvalQuery = `INSERT INTO rcvaltbl(conteseq, row, field_no, data) VALUES ${forms.map((form, i) => (
                        `('${props.conte.seq}', ${rowQuery}, ${i}, '${form}')`
                    )).join(',')}`;
                    DatabaseUtil.sendQueryRequestToAPI('update', [insertRcmstQuery, insertRcvalQuery].join(';')).then(() => {
                        alert('登録成功');
                        // レコードの更新
                        findDataRecordList(props.conte.seq, fieldList).then((resList) => {
                            console.log(resList);
                            setDataRecordList(resList.map((record) => fieldList.map((field, j) => record[`val${j}`])));
                        });
                    });
                }}
                close={() => { setDispDialog(false) }}
            />}
        </_Wrap>
    );
}

export default DataViewer;


const findFieldList = async (conteseq: number) => {
    const sql = `SELECT no, name, input_type as inputType, list, width FROM fieldtbl WHERE contents = ${conteseq} ORDER BY no`;
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as FieldProps[];
};
const findDataRecordList = async (conteseq: number, fieldList: FieldProps[]) => {
    const sql = `
        SELECT user, ${fieldList.map((field, i) => `(select data from rcvaltbl where conteseq = ${conteseq} and row = rcmst.row and field_no = ${i}) as val${i}`).join(',')}
        FROM rcmsttbl rcmst
        WHERE conteseq = ${conteseq}
        GROUP BY row
    `;
    console.log(sql);
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as any[];
};

const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;

const _TableFrame = styled.div`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - 200px);
    background-color: #a0a0a0;
    text-align: left;
`;
const _Header = styled.div`
    display: inline-block;
    width: 100%;
    /* height: calc(100% - 200px); */
    background-color: #cc6565;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
`;
const _Body = styled.div`
    display: inline-block;
    width: 100%;
    height: calc(100% - 60px);
    /* background-color: #c9d1e4; */
    text-align: left;
    overflow: auto;
`;

const _Record = styled.div<{
}>`
    display: block;
    min-width: 100%;
    height: 30px;
    background-color: #e7e7e7;
    white-space: nowrap;
`;

const _Column = styled.div<{
    width: number;
}>`
    display: inline-block;
    width: ${props => props.width}px;
    height: 30px;
    background-color: #bacfbd;
    border: solid 1px #0000006f;
    box-sizing: border-box;
    font-size: 18px;
    color: #474747;
    padding: 0 0 0 10px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    vertical-align: top;
    text-align: center;
`;
const _Cell = styled.div<{
    width: number;
    isFocus: boolean;
}>`
    display: inline-block;
    width: ${props => props.width}px;
    height: 30px;
    background-color: #d9dbda71;
    ${props => !props.isFocus ? '' : css`
        background-color: #ebda8c7d;
    `}
    border: solid 1px #0000006f;
    box-sizing: border-box;
    font-size: 18px;
    color: #474747;
    padding: 0 0 0 10px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    vertical-align: top;
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

const _Switch = styled.div<{
    isFocus: boolean;
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
    ${props => !props.isFocus ? '' : css`
        background-color: #f3f162e8;
    `}
    &: hover{
        background-color: #ffffff96;
        ${props => !props.isFocus ? '' : css`
            background-color: #f3f162e8;
        `}
    }
`;

const _MessageFrame = styled.div`
    display: inline-block;
    width: 100%;
    height: 80px;
    background-color: #9b8f8f28;
    text-align: left;
    margin: 5px 0 0 0;
`;

const _Message = styled.div<{
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

const _OperationRecord = styled.div<{
}>`
    display: inline-block;
    min-width: 100%;
    height: 40px;
    /* background-color: #a5d1ac; */
    white-space: nowrap;
`;