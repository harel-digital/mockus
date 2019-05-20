import React, { Component } from 'react';
import Layout from '../components/Layout/Layout';

function WithLayout(WrappedComponent) {
    return class extends Component {
        render() {
            return (
                <Layout>
                    <WrappedComponent {...this.props}/>
                </Layout>
            )
        }
    }
}

export default WithLayout;
