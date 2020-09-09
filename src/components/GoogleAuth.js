import React from 'react'
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions'

class GoogleAuth extends React.Component {

    // onSigneInClick()　or　onSignOutClick()がクリックされた後に走る
    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '351731750636-e20mqgpr5f7imo8h889p7e2ftdnep61r.apps.googleusercontent.com',
                scope: 'email'
            }).then(() => {
                // isSignedInにアクセスするために、this.authに代入　簡略化
                this.auth = window.gapi.auth2.getAuthInstance();

                // ()の中はtrueかfalseが返ってくる↓　それをonAuthChangeの引数に渡す
                this.onAuthChange(this.auth.isSignedIn.get())
                // ユーザーが承認中(login logout)の時にすぐに呼び出される　onAuthChangeを呼び出している
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    }

    onAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            // isSignedIn===trueであれば、サインインしてユーザーIDを所得
            this.props.signIn(this.auth.currentUser.get().getId());
            // そうでなければログアウト
        } else {
            this.props.signOut();
        }
    }

    onSigneInClick = () => {
        this.auth.signIn()
    }

    onSignOutClick = () => {
        this.auth.signOut()
    }

    renderAuthButton() {
        if (this.props.isSignedIn === null) {
            return null
        } else if (this.props.isSignedIn) {
            return (
                <button className="ui red google button" onClick={this.onSignOutClick}>
                    <i className="google icon" />
                Sign Out
                </button>
            )
        } else {
            return (
                <button className="ui blue google button" onClick={this.onSigneInClick}>
                    <i className="google icon" />
                Sign In with Google
                </button>
            )
        }
    }



    render() {
        return <div>{this.renderAuthButton()}</div>
    }
}

const mapStateToProps = state => {
    return { isSignedIn: state.auth.isSignedIn }
}

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth)