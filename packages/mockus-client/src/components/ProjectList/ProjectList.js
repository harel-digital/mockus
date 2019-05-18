import React, { Component } from 'react';
import { Card, Input, Icon } from 'semantic-ui-react';
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
        
        return filteredItems.length ? 
            filteredItems.map(singleEntry => {
                return (
                    <ProjectListItem
                        onClick={() => this.props.onProjectItemClick(singleEntry)}
                        object={singleEntry}
                        key={singleEntry._id}/>
                );
            })
            : this.renderItemsEmpty();
    }

    onSearchChange = (e) => {
        const { value } = e.target;
        this.setState({ searchQuery: value });
    }

    render() {
        return (
            <Card fluid>
                <Card.Content key="0">
                    <Input fluid icon placeholder='Search...'>
                        <input onChange={this.onSearchChange} />
                        <Icon name='search' />
                    </Input>
                </Card.Content>
                {this.renderItems()}
            </Card>
        );
    }
}