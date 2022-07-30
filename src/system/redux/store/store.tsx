import Entrance from "../../content/entrance/entrance";
import SystemUtil from "../../utils/systemUtil";
import TransitionManager from "./transitionManager";

/**
 * システムで使用するステート群
 */
type Store = {
    mode: SystemUtil.Mode;
    transition: TransitionManager;
    user: SystemUtil.User | null;
}

export default Store;


export const initialStore: Store = {

    mode: 'entrance',
    transition: new TransitionManager(),
    user: null,
}