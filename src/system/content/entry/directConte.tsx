import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import DatabaseUtil from "../../utils/databaseUtil";
import SystemUtil from "../../utils/systemUtil";
import DataViewer from "../refer/dataViewer";
import { ConteProps } from "../seach/searchContents";
import { GlobalContext } from "./entry";


const DirectConte = (props: {
    hashKey: string;
}) => {
    const { store, setStore } = useContext(GlobalContext);
    const conteseq = SystemUtil.getDecryptionedConteSeq(props.hashKey);
    console.log(conteseq);
    useEffect(() => {
        findContentsList(conteseq).then(contList => {
            if (contList.length > 0) {
                console.log(contList[0]);
                store.transition.setNextFrame(<DataViewer conte={contList[0]} />);
                setStore({ ...store });
            }
        });
    }, []);
    return <Redirect to="/" />;
}

const findContentsList = async (conteseq: number) => {
    const subQuery = `(SELECT count(*) from fieldtbl WHERE conteseq = conte.seq) as cnt`;
    const sql = `SELECT seq, id, name, outline, ${subQuery} FROM contetbl conte WHERE seq = ${conteseq}`;
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', sql);
    const results = await response.json();
    return results as ConteProps[];
};

export default DirectConte;