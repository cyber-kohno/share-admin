import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Styles from "../../design/styles";
import DatabaseUtil from "../../utils/databaseUtil";
import SystemUtil from "../../utils/systemUtil";
import MenuCard from "../entrance/menuCard";
import { GlobalContext } from "../entry/entry";

const AccountManage = () => {
    const { store, setStore } = useContext(GlobalContext);
    const { user } = useAuth0();

    const [userList, setUserList] = useState<string[] | null>(null);
    const [userId, setUserId] = useState('');
    useEffect(() => {
        if (store.user != null) {
            setUserId(store.user.id);
        }
        findUserList().then((userList) => {
            setUserList(userList);
            console.log(userList);
        });
    }, []);

    const isFirstCreate = store.user == null;

    const isInputOK = () => {
        return userList != null && !userList.includes(userId);
    }

    const message = isFirstCreate ? <>{[
        'ユーザIDを登録して下さい。',
        'まだアカウントの作成は完了していません。',
    ].map((str, i) => <span key={i}>{str}<br /></span>)}</> : <>{[
        'ユーザIDを変更できます。',
    ].map((str, i) => <span key={i}>{str}<br /></span>)}</>;

    return (
        <_Wrap>
            <_Button
                isEnable={!isFirstCreate}
                onClick={() => {
                    store.transition.backFrame();
                    setStore({ ...store });
                }}
            >戻る</_Button>
            <_MessageFrame><_Message>{message}</_Message></_MessageFrame>
            <_Record>
                <_Title>登録メールアドレス</_Title>
                <_TextLabel>{user?.email}</_TextLabel>
            </_Record>
            <_Record>
                <_Title>ユーザID</_Title>
                <_TextForm type={'text'} value={userId} onChange={(e) => {
                    setUserId(e.target.value);
                }} />
            </_Record>
            <_Button
                isEnable={isInputOK()}
                onClick={() => {
                    if(store.user != null) {
                        DatabaseUtil.sendQueryRequestToAPI('update', `UPDATE user_tbl SET id = '${userId}' where seq = ${store.user.seq}`).then(() => {
                            store.mode = 'entrance';
                            (store.user as SystemUtil.User).id = userId;
                            setStore({ ...store });
                        })
                    } else {
                        if (user != null) {
                            DatabaseUtil.sendQueryRequestToAPI('update', `INSERT INTO user_tbl(email, id) VALUES('${user.email}', '${userId}')`).then(() => {
                                window.location.reload();
                            });
                        }
                    }
                }}
            >{isFirstCreate ? '登録' : '更新'}</_Button>
        </_Wrap>
    );
}

export default AccountManage;


const findUserList = async () => {
    const response = await DatabaseUtil.sendQueryRequestToAPI('select', `SELECT id FROM user_tbl`);
    const results = await response.json();
    return (results as { id: string }[]).map(res => res.id);
};


const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;

const _Record = styled.div`
    display: inline-block;
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
