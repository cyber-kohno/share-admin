import { HashRouter, Route, Switch, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

const Entry = () => {

    return (
        <HashRouter basename={process.env.PUBLIC_URL}>
            <Router />
        </HashRouter>
    );
}
const Router = () => {

    const query = new URLSearchParams(useLocation().search);
    const str = query.get('v') as string;
    console.log(process.env.PUBLIC_URL);
    return (
        <Switch>
            <Route path="/" exact>
                <_Wrap></_Wrap>
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
    );
}


export default Entry;

const _Wrap = styled.div`
    display: inline-block;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    margin: 4px 0 0 4px;
    background-color: #629b6f;
`;
const _Text = styled.div`
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: #b3b0d7;
    color: #000;
    font-size: 30px;
`;