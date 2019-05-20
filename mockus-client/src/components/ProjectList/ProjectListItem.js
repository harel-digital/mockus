import React from 'react';
import { Card, Grid, Label } from 'semantic-ui-react';

export default function ProjectListItem(props) {
    const { path, method } = props.object;
    return (
        <Card.Content onClick={props.onClick}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={12} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {path}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Label size='mini' color='green'>
                            {method}
                        </Label>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Card.Content>
    );
}