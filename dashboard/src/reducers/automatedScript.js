import {
    FETCH_AUTOMATED_SCRIPT_SUCCESS,
    CREATE_AUTOMATED_SCRIPT_SUCCESS,
    CREATE_AUTOMATED_SCRIPT_FAILURE,
    CREATE_AUTOMATED_SCRIPT_REQUEST,
    RESET_AUTOMATED_SCRIPT,
    FETCH_SINGLE_SCRIPT_SUCCESS,
    FETCH_SINGLE_SCRIPT_REQUEST,
    FETCH_SINGLE_SCRIPT_FAILURE,
} from '../constants/automatedScript';

const INITIAL_STATE = {
    addScripts: {
        requesting: false,
        success: false,
        error: null,
    },
    fetchScripts: {
        scripts: [],
        requesting: false,
        success: false,
        error: null,
    },
    individualScript: {
        data: {},
        requesting: false,
        success: false,
        error: null,
    },
};

export default function component(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET_AUTOMATED_SCRIPT:
            return Object.assign({}, state, {
                addScripts: {
                    ...state.addScripts,
                    requesting: false,
                    error: null,
                    success: false,
                },
            });
        case CREATE_AUTOMATED_SCRIPT_FAILURE:
            return Object.assign({}, state, {
                addScripts: {
                    ...state.addScripts,
                    requesting: false,
                    error: action.payload,
                    success: false,
                },
            });
        case CREATE_AUTOMATED_SCRIPT_REQUEST:
            return Object.assign({}, state, {
                addScripts: {
                    ...state.addScripts,
                    requesting: true,
                    error: null,
                    success: false,
                },
            });

        case CREATE_AUTOMATED_SCRIPT_SUCCESS:
            return Object.assign({}, state, {
                addScripts: {
                    ...state.addScripts,
                    requesting: false,
                    error: null,
                    success: true,
                },
            });

        case FETCH_AUTOMATED_SCRIPT_SUCCESS:
            return Object.assign({}, state, {
                fetchScripts: {
                    ...state.fetchScripts,
                    scripts: action.payload.data,
                    count: action.payload.count,
                    skip: action.payload.skip,
                    limit: action.payload.limit,
                    requesting: false,
                    error: null,
                    success: true,
                },
            });

        case FETCH_SINGLE_SCRIPT_SUCCESS:
            return Object.assign({}, state, {
                individualScript: {
                    data: action.payload,
                    requesting: false,
                    success: true,
                    error: null,
                },
            });

        case FETCH_SINGLE_SCRIPT_FAILURE:
            return Object.assign({}, state, {
                individualScript: {
                    data: {},
                    requesting: false,
                    success: false,
                    error: action.payload,
                },
            });

        case FETCH_SINGLE_SCRIPT_REQUEST:
            return Object.assign({}, state, {
                individualScript: {
                    data: {},
                    requesting: true,
                    success: false,
                    error: null,
                },
            });

        default:
            return state;
    }
}
