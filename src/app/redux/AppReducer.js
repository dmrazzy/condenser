/* eslint-disable no-case-declarations */
import { Map, OrderedMap } from 'immutable';
import tt from 'counterpart';

const STEEM_API_ERROR = 'app/STEEM_API_ERROR';
const FETCH_DATA_BEGIN = 'app/FETCH_DATA_BEGIN';
const FETCH_DATA_END = 'app/FETCH_DATA_END';
const ADD_NOTIFICATION = 'app/ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'app/REMOVE_NOTIFICATION';
const SET_FE_RENDERED = 'app/SET_FE_RENDERED';
export const ROUTE_TAG_SET = 'app/ROUTE_TAG_SET';
export const SET_USER_PREFERENCES = 'app/SET_USER_PREFERENCES';
export const TOGGLE_NIGHTMODE = 'app/TOGGLE_NIGHTMODE';
export const TOGGLE_BLOGMODE = 'app/TOGGLE_BLOGMODE';
export const RECEIVE_FEATURE_FLAGS = 'app/RECEIVE_FEATURE_FLAGS';
export const MODAL_LOADING_BEGIN = 'app/MODAL_LOADING_BEGIN';
export const MODAL_LOADING_END = 'app/MODAL_LOADING_END';

export const defaultState = Map({
    loading: false,
    error: '',
    location: {},
    notifications: null,
    user_preferences: Map({
        locale: null,
        nsfwPref: 'warn',
        nightmode: false,
        blogmode: false,
        currency: 'USD',
        defaultBlogPayout: '50%',
        defaultCommentPayout: '50%',
        selectedRpc: '',
    }),
    featureFlags: Map({}),
    modalLoading: false,
    routeTag: null,
});

export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.set('location', { pathname: action.payload.pathname });
        case STEEM_API_ERROR:
            // Until we figure out how to better handle these errors, let em slide.
            // This action is the only part of the app that marks an error in state.app.error,
            // and the only part of the app which pays attn to this part of the state is in App.jsx.
            // return  state.set('error', action.error).set('loading', false);
            // It is also worth noting that showTransactionErrorNotification in SagaShared
            // Will check state.transaction.errors and create a notification for whatever it finds there.
            // While TransactionReducer will add items to state.transaction.errors.
            console.error('SteemApiError', action.payload);
            return state;
        case FETCH_DATA_BEGIN:
            return state.set('loading', true);
        case FETCH_DATA_END:
            return state.set('loading', false);
        case ADD_NOTIFICATION: {
            const n = {
                action: tt('g.dismiss'),
                dismissAfter: 10000,
                ...action.payload,
            };
            return state.update('notifications', s => {
                return s ? s.set(n.key, n) : OrderedMap({ [n.key]: n });
            });
        }
        case REMOVE_NOTIFICATION:
            return state.update('notifications', s =>
                s.delete(action.payload.key)
            );
        case SET_USER_PREFERENCES:
            return state.set('user_preferences', Map(action.payload));
        case TOGGLE_NIGHTMODE:
            return state.setIn(
                ['user_preferences', 'nightmode'],
                !state.getIn(['user_preferences', 'nightmode'])
            );
        case TOGGLE_BLOGMODE:
            return state.setIn(
                ['user_preferences', 'blogmode'],
                !state.getIn(['user_preferences', 'blogmode'])
            );
        case RECEIVE_FEATURE_FLAGS:
            const newFlags = state.get('featureFlags')
                ? state.get('featureFlags').merge(action.flags)
                : Map(action.flags);
            return state.set('featureFlags', newFlags);
        case MODAL_LOADING_BEGIN:
            return state.set('modalLoading', true);
        case MODAL_LOADING_END:
            return state.set('modalLoading', false);
        case SET_FE_RENDERED:
            return state.set('frontend_has_rendered', true);
        case ROUTE_TAG_SET:
            return state.set('routeTag', action);
        default:
            return state;
    }
}

export const steemApiError = error => ({
    type: STEEM_API_ERROR,
    error,
});

export const fetchDataBegin = () => ({
    type: FETCH_DATA_BEGIN,
});

export const fetchDataEnd = () => ({
    type: FETCH_DATA_END,
});

export const addNotification = payload => ({
    type: ADD_NOTIFICATION,
    payload,
});

export const removeNotification = payload => ({
    type: REMOVE_NOTIFICATION,
    payload,
});

export const setUserPreferences = payload => ({
    type: SET_USER_PREFERENCES,
    payload,
});

export const toggleNightmode = () => ({
    type: TOGGLE_NIGHTMODE,
});

export const toggleBlogmode = () => ({
    type: TOGGLE_BLOGMODE,
});

export const receiveFeatureFlags = flags => ({
    type: RECEIVE_FEATURE_FLAGS,
    flags,
});

export const selectors = {
    getFeatureFlag: (state, flagName) =>
        state.getIn(['featureFlags', flagName], false),
};

export const modalLoadingBegin = payload => ({
    type: MODAL_LOADING_BEGIN,
    payload,
});

export const modalLoadingEnd = payload => ({
    type: MODAL_LOADING_END,
    payload,
});

export const setFeRendered = payload => ({
    type: SET_FE_RENDERED,
    payload,
});

export const setRouteTag = payload => ({
    type: ROUTE_TAG_SET,
    routeTag: payload.routeTag,
    params: payload.params,
});
