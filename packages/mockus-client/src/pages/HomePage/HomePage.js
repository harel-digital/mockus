import React, { Component, Fragment } from 'react';
import { Grid, Card, Icon, Button, Segment } from 'semantic-ui-react';
import WithLayout from '../../HOC/WithLayout';
import ProjectList from '../../components/ProjectList/ProjectList';
import APIGateway, { ApiGateway } from '../../services/APIGateway';
import RouteFormComponent from '../../components/RouteFormComponent';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class HomePage extends Component {

    state = {
        isLoading: true,
        projects: [],
        currentProjectId: 0,
        endpointData : this.getEmptyEndpointDataObject()
    }

    async componentDidMount() {
        this.setState({ projects : await APIGateway.getAllProjects() });
    }

    getEmptyEndpointDataObject() {
        return {
            path: "/",
            method: "GET",
            responseObjectType: "JSON",
            responseCode: 200,
            delay: 0,
            responseBody: "{}",
            headers: [{key: "Access-Control-Allow-Origin", value: "*"}]
        };
    }

    onSaveButtonClicked = () => {
        this.setState({ isLoading: true });

        const currentEndpoint = this.state.endpointData;
        const action = currentEndpoint._id ? "updateProject" : "insertNewProject";

        APIGateway[action](currentEndpoint).then(res => res.json()).then(res => {
            this.setState({
                isLoading: false,
                projects : res,
                endpointData: this.getEmptyEndpointDataObject()
            });  
        })
    }

    onResetButtonClicked = () => {
        this.setState({ endpointData : this.getEmptyEndpointDataObject() })
    }

    onDeleteButtonClicked = (id) => {
        return () => {
            APIGateway.deleteProject(id).then(res => res.json()).then(res => {
                this.setState({
                    projects : res,
                    endpointData: this.getEmptyEndpointDataObject()
                });  
            });
        }
    }

    onProjectItemClick = (item) => {
        this.setState({ endpointData: item });
    }

    onGoToButtonClick = () => {
        let { path } = this.state.endpointData;

        path = path.trim();

        if(path && path !== "/") {
            window.open(`${ApiGateway.getBaseAPIUrl()}${path}`);   
        }
    }

    onRouteFormChanged = (routeObject) => {

    }

    render() {
        const activeObj = this.state.endpointData;
        return (
            <div>
                <Grid style={{ marginTop: 62 }}>                    
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <ProjectList
                                onProjectItemClick={this.onProjectItemClick}
                                items={this.state.projects}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment>
                                <Button size='mini' color='green' onClick={this.onSaveButtonClicked}>Save</Button>
                                <Button size='mini' color='orange' onClick={this.onResetButtonClicked}>Reset</Button>
                                {activeObj._id ? (
                                    <Fragment>
                                        <Button onClick={this.onDeleteButtonClicked(activeObj._id)} size='mini' color='red'>Delete</Button>
                                        <Button onClick={this.onGoToButtonClick} size='mini' color='blue' floated='right'>Go to: {activeObj.path}</Button>
                                    </Fragment>
                                ) : ''}
                            </Segment>
                            <Card fluid>
                                <Card.Content>
                                    <RouteFormComponent
                                        onChange={this.onRouteFormChanged}
                                        routeObject={this.state.endpointData}/>
                                </Card.Content>
                                <Card.Content extra>
                                    <Icon name='exclamation circle'/>
                                    Configure your http endpoint here.
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default WithLayout(HomePage);