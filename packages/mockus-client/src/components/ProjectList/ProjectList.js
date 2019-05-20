import React, { Component, Fragment } from 'react';
import { Card, Input, Icon } from 'semantic-ui-react';
import { groupBy } from 'lodash';
import ProjectListItem from './ProjectListItem';

export default class ProjectList extends Component {

    state = {
        searchQuery : ''
    }
    renderItemsEmpty() {
        return <Card.Content key="empty">No items yet</Card.Content>;
    }

    renderItems() {
        const { items } = this.props;
        let filteredItems = items.filter(singleEntry => singleEntry.path.toLowerCase().includes(this.state.searchQuery.toLowerCase()));

        if(!filteredItems.length) {
            return this.renderItemsEmpty();
        }

        let groupedItems = groupBy(filteredItems, 'group');

        return Object.keys(groupedItems)
            .map(key => {
                if(key === "undefined") return '';
                const group = groupedItems[key];
                const groupName = key || 'None';

                return (
                    <Card fluid key={groupName}>
                        <Card.Content>
                            {groupName}
                        </Card.Content>
                        {group.map(singleEntry => {
                            return (
                                <ProjectListItem
                                    onClick={() => this.props.onProjectItemClick(singleEntry)}
                                    object={singleEntry}
                                    key={singleEntry._id}/>
                            );
                        })}
                    </Card>
                );
            });
    }

    onSearchChange = (e) => {
        const { value } = e.target;
        this.setState({ searchQuery: value });
    }

    render() {
        return (
            <Fragment>
                <Card fluid>
                    <Card.Content key="0">
                        <Input fluid icon placeholder='Search...'>
                            <input onChange={this.onSearchChange} />
                            <Icon name='search' />
                        </Input>
                    </Card.Content>
                </Card>
                {this.renderItems()}
            </Fragment>
        );
    }
}