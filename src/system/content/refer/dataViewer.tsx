import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import RegulationUtil from "../../utils/regulationUtil";
import SystemUtil from "../../utils/systemUtil";
import { GlobalContext } from "../entry/entry";
import { ConteProps } from "../seach/searchContents";
import DataEditDialog, { DataEditDialogProps } from "./dataEditDialog";

// export type FieldProps = {
//     no: number
//     name: string,
//     inputType: RegulationUtil.FieldInputType;
//     list: string;
//     width: number;
// };

const DataViewer = (props: {
    conte: ConteProps;
}) => {
    const { store, setStore } = useContext(GlobalContext);

    const [fieldList, setFieldList] = useState<RegulationUtil.FieldProps[]>([]);
    const [dataRecordList, setDataRecordList] = useState<string[][]>([]);
    const [isFullScreen, setFullScreen] = useState(false);
    const [responseList, setResponseList] = useState<any[]>([]);
    const [dataEditDialogProps, setDataEditDialogProps] = useState<null | DataEditDialogProps>(null);
    const [focusIndex, setFocusIndex] = useState(-1);

    const headerRef = useRef<HTMLDivElement>({} as HTMLDivElement);
    const tableRef = useRef<HTMLDivElement>({} as HTMLDivElement);

    const updateDataRecordList = (fieldList: RegulationUtil.FieldProps[]) => {

        findDataRecordList(props.conte.seq, fieldList).then((resList) => {
            console.log(resList);
            setResponseList(resList);
            setDataRecordList(resList.map((record) => {
                return fieldList.map((field, j) => {
                    const columnValue = record[`val${j}`];
                    return columnValue ?? '';
                });
            }));
        });
    }

    useEffect(() => {
        // findFieldList(props.conte.seq).then((res) => {
        //     setFieldList(res);
        //     updateDataRecordList(res);
        // });
        DatabaseUtil.findMasterFieldList(props.conte.seq).then((resFields) => {
            const masterFieldList: RegulationUtil.FieldProps[] = [];
            resFields.forEach((field) => {
                const fieldProps = RegulationUtil.createInitialField();
                Object.keys(field).forEach((key) => {
                    if (!['conteseq'].includes(key)) {
                        const camelKey = SystemUtil.toCamelCase(key);
                        const value = field[key] ?? '';
                        // console.log(`key: [${key}], value: [${value}]`);
                        (fieldProps as any)[camelKey] = value;
                    }
                });
                masterFieldList.push(fieldProps);
            });
            setFieldList(masterFieldList);
            updateDataRecordList(masterFieldList);
        });
    }, []);

    const openDetailDialog = (isCreate: boolean) => {
        const curRecord = dataRecordList[focusIndex];
        const curResponse = responseList[focusIndex];
        const initialForms = isCreate ? new Array<string>(fieldList.length).fill('') : curRecord.slice();
        setDataEditDialogProps({
            fieldList,
            forms: initialForms,
            regist: (forms: string[]) => {
                if (isCreate) {
                    const rowQuery = `(select max(row) from rcmsttbl WHERE conteseq = '${props.conte.seq}')`;
                    const nextRow = `(case when ${rowQuery} is null then -1 else ${rowQuery} end) + 1`;
                    const insertRcmstQuery = `INSERT INTO rcmsttbl(conteseq, row, user) VALUES('${props.conte.seq}', ${nextRow}, '${store.user?.seq}')`;
                    const insertRcvalQuery = `INSERT INTO rcvaltbl(conteseq, row, field_no, data) VALUES ${forms.map((form, i) => (
                        `('${props.conte.seq}', ${rowQuery}, ${i}, '${form}')`
                    )).join(',')}`;
                    DatabaseUtil.sendQueryRequestToAPI('update', [insertRcmstQuery, insertRcvalQuery].join(';')).then(() => {
                        alert('登録成功');
                        // レコードの更新
                        updateDataRecordList(fieldList);
                    });
                } else {
                    const updateRcmstQuery = `UPDATE rcmsttbl SET updatedy = datetime('now', 'localtime')
                        WHERE conteseq = ${props.conte.seq} AND row = ${curResponse.row}`;
                    const queryList: string[] = [];
                    queryList.push(updateRcmstQuery);
                    fieldList.forEach((field, i) => {
                        const baseData = curResponse[`val${i}`];
                        const newData = forms[i];
                        if (baseData !== newData) {
                            const query = `UPDATE rcvaltbl SET data = '${newData}'
                            WHERE conteseq = ${props.conte.seq} AND row = ${curResponse.row} AND field_no = ${i}`;
                            queryList.push(query);
                        }
                    });
                    DatabaseUtil.sendQueryRequestToAPI('update', queryList.join(';')).then(() => {
                        alert('更新成功');
                        // レコードの更新
                        updateDataRecordList(fieldList);
                    });
                }
            },
            close: () => { setDataEditDialogProps(null) }
        });
    }

    const editRecord = () => { openDetailDialog(false) };
    const createRecord = () => { openDetailDialog(true) };
    const removeRecord = () => { 
        const list: string[] = [];
        list.push(`DELETE FROM rcvaltbl where conteseq = ${props.conte.seq} and row = ${focusIndex}`);
        list.push(`DELETE FROM rcmsttbl where conteseq = ${props.conte.seq} and row = ${focusIndex}`);
        DatabaseUtil.sendQueryRequestToAPI('update', list.join(';')).then(() => {
            alert('削除成功');
            updateDataRecordList(fieldList);
        });
     };

    const columnJsxList = fieldList.map((field, i) => {
        return (
            <_Column key={i} width={field.width}>{field.name}</_Column>
        );
    });

    const dataRecordJsxList = useMemo(() => {
        return dataRecordList.map((record, i) => {
            return (
                <_Record key={i} onClick={() => {
                    setFocusIndex(i);
                }}>
                    {record.map((col, j) => (
                        <_Cell key={j} width={fieldList[j].width} isFocus={focusIndex === i}>{col}</_Cell>
                    ))}
                </_Record>
            );
        });
    }, [dataRecordList, focusIndex]);

    const url = SystemUtil.getConteURL(props.conte.seq);
    return (
        <_Wrap>
            <_HideArea isDisable={isFullScreen}>
                <_Button isEnable={true} onClick={() => {
                    store.transition.backFrame();
                    setStore({ ...store });
                }}>戻る</_Button>
                {/* <_MessageFrame><_Message>{props.conte.outline}</_Message></_MessageFrame> */}
                <_MessageFrame><_Message>{url}</_Message></_MessageFrame>
                <_OperationRecord>
                    <_Switch isFocus={false}>テーブル</_Switch>
                    {/* <_Switch isFocus={false}>統計</_Switch>
                    <_Switch isFocus={false}>ツリー</_Switch> */}
                </_OperationRecord>
            </_HideArea>
            <_OperationRecord>
                <_Button isEnable={true} onClick={createRecord}>レコード追加</_Button>
                <_Switch isFocus={false} onClick={() => {
                    setFullScreen(!isFullScreen);
                }}>全体表示</_Switch>
            </_OperationRecord>
            <_TableFrame isFullScreen={isFullScreen}>
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
                <_Button isEnable={focusIndex !== -1} onClick={editRecord}>編集</_Button>
                <_Button isEnable={focusIndex !== -1} onClick={removeRecord}>削除</_Button>
            </_OperationRecord>
            {dataEditDialogProps == null ? <></> : <DataEditDialog
                fieldList={dataEditDialogProps.fieldList}
                forms={dataEditDialogProps.forms}
                regist={dataEditDialogProps.regist}
                close={dataEditDialogProps.close}
            />}
        </_Wrap>
    );
}

export default DataViewer;

/**
 * フィールドの定義情報を検索する
 * @param conteseq コンテンツ連番
 * @returns Promise[フィールド情報の配列]
 */
const findFieldList = async (conteseq: number) => {
    const sql = `SELECT * FROM fieldtbl WHERE conteseq = ${conteseq} ORDER BY sort_no`;
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as any[];
};

const findDataRecordList = async (conteseq: number, fieldList: RegulationUtil.FieldProps[]) => {
    const subQuery = fieldList.map((field, i) => (
        `(select data from rcvaltbl where conteseq = ${conteseq} and row = rcmst.row and field_no = ${i}) as val${i}`
    )).join(',');
    const sql = `
        SELECT user, row, ${subQuery}
        FROM rcmsttbl rcmst
        WHERE conteseq = ${conteseq}
        GROUP BY row
    `;
    // console.log(sql);
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

const _HideArea = styled.div<{
    isDisable: boolean;
}>`
    ${props => !props.isDisable ? '' : css`
        display: none;
    `}
`;

const _TableFrame = styled.div<{
    isFullScreen: boolean;
}>`
    display: inline-block;
    width: calc(100% - 10px);
    height: calc(100% - ${props => !props.isFullScreen ? 240 : 80}px);
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
    /* background-color: #e7e7e7; */
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
    background-color: #ffffff;
    ${props => !props.isFocus ? '' : css`
        background-color: #ffeea3dc;
    `}
    border: solid 1px #0000006f;
    box-sizing: border-box;
    font-size: 18px;
    color: #474747;
    padding: 0 0 0 10px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    vertical-align: top;
    overflow: hidden;
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
    user-select: text;
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