import SystemUtil from "../../utils/systemUtil";

/**
 * システムで使用するステート群
 */
 type Store = {
    mode: SystemUtil.Mode;
    user: SystemUtil.User | null;
}

export default Store;


export const initialStore: Store = {

    mode: 'entrance',
    user: null,
}