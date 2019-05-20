import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { ApiGateway } from '../../services/APIGateway';

function LayoutHeader() {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item as='a' header>
                    Mockus
                </Menu.Item>

                <Menu.Item position='right'>
                    <Button size='small' color='teal' onClick={() => window.open(`${ApiGateway.getBaseAPIUrl()}/api/export`)}>Export DB</Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default LayoutHeader;
