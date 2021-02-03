/* eslint-disable react/style-prop-object */
/* eslint-disable arrow-parens */
/* eslint-disable no-undef */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseButton from 'app/components/elements/CloseButton';
import Reveal from 'app/components/elements/Reveal';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import tt from 'counterpart';
import * as userActions from 'app/redux/UserReducer';
import * as appActions from 'app/redux/AppReducer';
import * as transactionActions from 'app/redux/TransactionReducer';
import LoginForm from 'app/components/modules/LoginForm';
import ConfirmTransactionForm from 'app/components/modules/ConfirmTransactionForm';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import TermsAgree from 'app/components/modules/TermsAgree';
import PostAdvancedSettings from 'app/components/modules/PostAdvancedSettings';
import TronCreateOne from 'app/components/modules/TronCreateOne';
import TronCreateTwo from 'app/components/modules/TronCreateTwo';

class Modals extends React.Component {
    static propTypes = {
        show_tron_create_modal: PropTypes.bool,
        show_tron_create_success_modal: PropTypes.bool,
        show_login_modal: PropTypes.bool,
        show_confirm_modal: PropTypes.bool,
        show_bandwidth_error_modal: PropTypes.bool,
        show_promote_post_modal: PropTypes.bool,
        show_post_advanced_settings_modal: PropTypes.string,
        hideLogin: PropTypes.func.isRequired,
        username: PropTypes.string,
        hideConfirm: PropTypes.func.isRequired,
        hidePromotePost: PropTypes.func.isRequired,
        hideBandwidthError: PropTypes.func.isRequired,
        hidePostAdvancedSettings: PropTypes.func.isRequired,
        notifications: PropTypes.object,
        show_terms_modal: PropTypes.bool,
        removeNotification: PropTypes.func,
        loginBroadcastOperation: PropTypes.shape({
            type: PropTypes.string,
            username: PropTypes.string,
            successCallback: PropTypes.func,
            errorCallback: PropTypes.func,
        }),
        loading: PropTypes.bool,
    };

    static defaultProps = {
        username: '',
        notifications: undefined,
        removeNotification: () => {},
        show_terms_modal: false,
        show_promote_post_modal: false,
        show_bandwidth_error_modal: false,
        show_confirm_modal: false,
        show_login_modal: false,
        show_post_advanced_settings_modal: '',
        loginBroadcastOperation: undefined,
        show_tron_create_modal: false,
        show_tron_create_success_modal: false,
        loading: false,
    };

    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Modals');
    }

    render() {
        const {
            show_tron_create_modal,
            show_tron_create_success_modal,
            show_login_modal,
            show_confirm_modal,
            show_bandwidth_error_modal,
            show_post_advanced_settings_modal,
            hideLogin,
            hideConfirm,
            show_terms_modal,
            notifications,
            removeNotification,
            hidePromotePost,
            show_promote_post_modal,
            hideBandwidthError,
            hidePostAdvancedSettings,
            username,
            loginBroadcastOperation,
            hideTronCreate,
            hideTronCreateSuccess,
        } = this.props;

        const notifications_array = notifications
            ? notifications.toArray().map(n => {
                  n.onClick = () => removeNotification(n.key);
                  return n;
              })
            : [];

        const buySteemPower = e => {
            if (e && e.preventDefault) e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location = 'https://poloniex.com/exchange#trx_steem';
        };
        return (
            <div>
                {show_tron_create_modal && (
                    <Reveal
                        onHide={() => {
                            if (this.props.loading === false) hideTronCreate();
                        }}
                        show={show_tron_create_modal}
                    >
                        <CloseButton onClick={hideTronCreate} />
                        <TronCreateOne />
                    </Reveal>
                )}
                {show_tron_create_success_modal && (
                    <Reveal
                        onHide={() => {
                            if (this.props.loading === false)
                                hideTronCreateSuccess();
                        }}
                        show={show_tron_create_success_modal}
                    >
                        <CloseButton onClick={hideTronCreateSuccess} />
                        <TronCreateTwo />
                    </Reveal>
                )}
                {show_login_modal && (
                    <Reveal
                        onHide={() => {
                            hideLogin();
                        }}
                        show={show_login_modal}
                    >
                        <CloseButton onClick={() => hideLogin()} />
                        <LoginForm onCancel={hideLogin} />
                    </Reveal>
                )}
                {show_confirm_modal && (
                    <Reveal onHide={hideConfirm} show={show_confirm_modal}>
                        <CloseButton onClick={hideConfirm} />
                        <ConfirmTransactionForm onCancel={hideConfirm} />
                    </Reveal>
                )}
                {show_terms_modal && (
                    <Reveal show={show_terms_modal}>
                        <TermsAgree onCancel={hideLogin} />
                    </Reveal>
                )}
                {show_bandwidth_error_modal && (
                    <Reveal
                        onHide={hideBandwidthError}
                        show={show_bandwidth_error_modal}
                    >
                        <div>
                            <CloseButton onClick={hideBandwidthError} />
                            <h4>{tt('modals_jsx.your_transaction_failed')}</h4>
                            <hr />
                            <h5>{tt('modals_jsx.out_of_bandwidth_title')}</h5>
                            <p>{tt('modals_jsx.out_of_bandwidth_reason')}</p>
                            <p>{tt('modals_jsx.out_of_bandwidth_reason_2')}</p>
                            <p>
                                {tt('modals_jsx.out_of_bandwidth_option_title')}
                            </p>
                            <ol>
                                <li>
                                    {tt('modals_jsx.out_of_bandwidth_option_4')}
                                </li>
                                <li>
                                    {tt('modals_jsx.out_of_bandwidth_option_1')}
                                </li>
                                <li>
                                    {tt('modals_jsx.out_of_bandwidth_option_2')}
                                </li>
                                <li>
                                    {tt('modals_jsx.out_of_bandwidth_option_3')}
                                </li>
                            </ol>
                            <button className="button" onClick={buySteemPower}>
                                {tt('g.buy_steem_power')}
                            </button>
                        </div>
                    </Reveal>
                )}
                {show_post_advanced_settings_modal && (
                    <Reveal
                        onHide={hidePostAdvancedSettings}
                        show={show_post_advanced_settings_modal ? true : false}
                    >
                        <CloseButton onClick={hidePostAdvancedSettings} />
                        <PostAdvancedSettings
                            formId={show_post_advanced_settings_modal}
                        />
                    </Reveal>
                )}
                <NotificationStack
                    style={false}
                    notifications={notifications_array}
                    onDismiss={n => removeNotification(n.key)}
                />
            </div>
        );
    }
}

export default connect(
    state => {
        const rcErr = state.transaction.getIn(['errors', 'bandwidthError']);
        // get the onErrorCB and call it on cancel
        const show_login_modal = state.user.get('show_login_modal');
        let loginBroadcastOperation = {};
        if (
            show_login_modal &&
            state.user &&
            state.user.getIn(['loginBroadcastOperation'])
        ) {
            loginBroadcastOperation = state.user
                .getIn(['loginBroadcastOperation'])
                .toJS();
        }

        return {
            username: state.user.getIn(['current', 'username']),
            show_login_modal,
            show_confirm_modal: state.transaction.get('show_confirm_modal'),
            show_promote_post_modal: state.user.get('show_promote_post_modal'),
            notifications: state.app.get('notifications'),
            show_terms_modal:
                state.user.get('show_terms_modal') &&
                state.routing.locationBeforeTransitions.pathname !==
                    '/tos.html' &&
                state.routing.locationBeforeTransitions.pathname !==
                    '/privacy.html',
            show_bandwidth_error_modal: rcErr,
            show_post_advanced_settings_modal: state.user.get(
                'show_post_advanced_settings_modal'
            ),
            loginBroadcastOperation,
            show_tron_create_modal: state.user.get('show_tron_create_modal'),
            show_tron_create_success_modal: state.user.get(
                'show_tron_create_success_modal'
            ),
            loading: state.app.get('modalLoading'),
        };
    },
    dispatch => ({
        hideTronCreate: e => {
            if (e) e.preventDefault();
            dispatch(userActions.hideTronCreate());
        },
        hideTronCreateSuccess: e => {
            if (e) e.preventDefault();
            dispatch(userActions.hideTronCreateSuccess());
        },
        hideLogin: e => {
            if (e) e.preventDefault();
            dispatch(userActions.hideLogin());
        },
        hideConfirm: e => {
            if (e) e.preventDefault();
            dispatch(transactionActions.hideConfirm());
        },
        hidePromotePost: e => {
            if (e) e.preventDefault();
            dispatch(userActions.hidePromotePost());
        },
        hideBandwidthError: e => {
            if (e) e.preventDefault();
            dispatch(
                transactionActions.dismissError({ key: 'bandwidthError' })
            );
        },
        hidePostAdvancedSettings: e => {
            if (e) e.preventDefault();
            dispatch(userActions.hidePostAdvancedSettings());
        },
        // example: addNotification: ({key, message}) => dispatch({type: 'ADD_NOTIFICATION', payload: {key, message}}),
        removeNotification: key =>
            dispatch(appActions.removeNotification({ key })),
    })
)(Modals);
