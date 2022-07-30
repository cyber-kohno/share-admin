import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useEffect, useState } from "react";
import { HashRouter, Route, Switch, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import ReactLoading from 'react-loading';
import Store, { initialStore } from "../../redux/store/store";
import DatabaseUtil from "../../utils/databaseUtil";
import SystemUtil from "../../utils/systemUtil";
import ManageFrame from "./manageFrame";

const Entry = () => {

    useEffect(() => {
        if (window === undefined) return;

        const state = window.history.state;
        if (!state) {
          window.history.replaceState({ isExit: true }, '');
          window.history.pushState({ isExit: false }, '');
        }

        const exit = () => {
            alert('ブラウザバック');
        }
    
        window.addEventListener('popstate', exit);
        return () => {
          window.removeEventListener('popstate', exit);
        }
    }, []);

    return (
        <HashRouter basename={process.env.PUBLIC_URL}>
            <Router />
        </HashRouter>
    );

}
type GlobalContextType = {
    store: Store;
    setStore: Function;
}

export const GlobalContext = createContext({} as GlobalContextType);

const Router = () => {

    const [store, setStore] = useState<Store>(initialStore);

    const { user, isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const query = new URLSearchParams(useLocation().search);
    const str = query.get('v') as string;

    useEffect(() => {
        if (!isLoading && isAuthenticated && store.user == null && user != undefined) {
            (async () => {
                const response = await DatabaseUtil.sendQueryRequestToAPI('select', `SELECT * FROM user_tbl where email = '${user.email}'`);
                const results = await response.json();
                console.log(JSON.stringify(results));
                if (results.length > 0) {
                    const res = results[0];
                    store.user = {
                        seq: res.seq,
                        id: res.id
                    };
                    setStore({ ...store });
                } else {
                    // await DatabaseUtil.sendQueryRequestToAPI('update', `INSERT INTO user_tbl(email, id) VALUES('${user.email}', '${'hoge'}')`);
                    store.mode = 'account';
                    setStore({ ...store });
                }
                // setLoading(false);
            })();
        }
    }, [isLoading]);

    const getUserId = () => {
        return store.user != null ? '@' + store.user.id : '未設定';
    }

    if (isLoading) return (
        <_LoadFrame>
            <ReactLoading type='spinningBubbles' />
        </_LoadFrame>
    );

    return (
        <GlobalContext.Provider value={{ store, setStore }}>
            <_Wrap>
                <_Header>
                    <_Logo>share-admin</_Logo>
                    {!isAuthenticated ? <_Button onClick={() => {
                        loginWithRedirect();
                    }}>ログイン</_Button> : <>
                        <_Text>{getUserId()}</_Text>
                        <_Button onClick={() => {
                            logout({ returnTo: window.location.origin });
                        }}>ログアウト</_Button>
                    </>
                    }
                </_Header>
                <_Main>
                    <Switch>
                        <Route path="/" exact>
                            <ManageFrame />
                        </Route>
                        <Route path="/test" exact >
                            <_Wrap>
                                <_Text>aas</_Text>
                            </_Wrap>
                        </Route>
                        <Route path="/viewer" exact >
                            <_Wrap>
                                <_Text>{str}</_Text>
                            </_Wrap>
                        </Route>
                    </Switch>
                </_Main>
            </_Wrap>
        </GlobalContext.Provider>
    );
}

export default Entry;


const _LoadFrame = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
`;

const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #629b6f;
`;
const _Header = styled.div`
    display: inline-block;
    position: fixed;
    width: 100%;
    height: ${SystemUtil.HEADER_WIDTH}px;
    background-color: #a6c2b6;
    text-align: right;
`;

const _Main = styled.div`
    display: inline-block;
    position: absolute;
    top: ${SystemUtil.HEADER_WIDTH}px;
    width: 100%;
    height: calc(100% - ${SystemUtil.HEADER_WIDTH}px);
    background-color: #7dac96;
    text-align: center;
`;

const _Button = styled.div`
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
    margin: 5px 10px 0 0;
    &: hover{
    background-color: #ffffff96;
    }
`;

const _Text = styled.div`
    display: inline-block;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    color: #353469;
    /* background-color: #ffffff78; */
    margin: 5px 10px 0 0;
`;

const _Logo = styled.div`
    display: inline-block;
    position: absolute;
    top: 0;
    left: 10px;
    /* height: 30px; */
    font-size: 28px;
    font-weight: 600;
    font-family: 'Noto Serif JP', serif;
    font-style: italic;
    color: #f4fff2;
    /* background-color: #ffffff78; */
`;