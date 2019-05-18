import React, { Component, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import LayoutHeader from './LayoutHeader';

export default class Layout extends Component {
    render() {
        return (
            <Fragment>
                <LayoutHeader/>

                <Container style={{ marginTop: '40px' }}>
                    {this.props.children}
                </Container>
            </Fragment>
        );
    }
}