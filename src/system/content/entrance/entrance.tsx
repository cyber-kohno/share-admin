import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import styled from "styled-components";
import useMedia from "use-media";
import SystemUtil from "../../utils/systemUtil";
import AccountManage from "../account/accountManage";
import Regulation from "../define/defineManage";
import { GlobalContext } from "../entry/entry";
import { MediaQueryContext } from "../entry/manageFrame";
import SearchContents from "../seach/searchContents";
import MenuCard from "./menuCard";

const Entrance = () => {
    const { store, setStore } = useContext(GlobalContext);
    // const mediaQuery = useContext(MediaQueryContext);

    return (
        <_Wrap>
            <MenuCard
                title={'コンテンツ作成'}
                detail={<>コンテンツの参照・編集権限の設定を行い、<br />データの定義を行います。</>}
                callback={() => {
                    // store.mode = 'regulation';
                    store.transition.setNextFrame(<Regulation />);
                    setStore({ ...store });
                }}
            />
            <MenuCard
                title={'コンテンツ検索'}
                detail={<>公開されたコンテンツを検索します。</>}
                callback={() => {
                    // store.mode = 'search';
                    store.transition.setNextFrame(<SearchContents />);
                    setStore({ ...store });
                }}
            />
            <MenuCard
                title={'グループ作成'}
                detail={<>{[
                    '自身がオーナーのグループを作成います。',
                    'グループの参加者に権限を制御することが可能です。',
                    'グループ参加のURLを発行することができます。'
                ].map((str, i) => <span key={i}>{str}<br /></span>)}</>}
                callback={() => {
                    // store.mode = 'regulation';
                    setStore({ ...store });
                }}
            />
            <MenuCard
                title={'アカウント管理'}
                detail={<>{[
                    'ユーザIDを変更することができます。',
                ].map((str, i) => <span key={i}>{str}<br /></span>)}</>}
                callback={() => {
                    // store.mode = 'account';
                    store.transition.setNextFrame(<AccountManage />);
                    setStore({ ...store });
                }}
            />
        </_Wrap>
    );
}

export default Entrance;

const _Wrap = styled.div`
    display: inline-block;
    width: 100%;
    max-width: 960px;
    height: 100%;
    background-color: #f3f3f328;
    text-align: center;
`;