import React, { Component, Fragment } from 'react';
import { Grid, Icon, Button, Segment } from 'semantic-ui-react';
import { truncate } from 'lodash';
import WithLayout from '../../HOC/WithLayout';
import ProjectList from '../../components/ProjectList/ProjectList';
import APIGateway, { ApiGateway } from '../../services/APIGateway';
import RouteFormComponent from '../../components/RouteFormComponent';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class HomePage extends Component {

    state = {
        tempExtraGroups: [],
        projects: [],
        endpointData : this.getEmptyEndpointDataObject()
    }

    async componentDidMount() {
        this.setState({ projects : await APIGateway.getAllProjects() });
    }

    getProjectsGroups() {
        const currentProjects = this.state.projects;
        let groups = [];
        if(!currentProjects.length) return groups;

        currentProjects.forEach(project => {
            let groupName = project.group;
            if(groupName !== undefined && !groups.includes(groupName)) {
                if(groupName === "") {
                    groupName = "None";
                }
                groups.push(groupName);
            }
        });
        
        groups = groups.concat(this.state.tempExtraGroups);

        return groups.sort();
    }

    getEmptyEndpointDataObject() {
        return {
            group: 'None',
            path: "/",
            method: "GET",
            responseObjectType: "JSON",
            responseCode: 200,
            delay: 0,
            responseBody: "{}",
            headers: [{key: "Access-Control-Allow-Origin", value: "*"}]
        };
    }

    onAddExtraGroupitem = (groupName) => {
        const currentExtraGroups = this.state.tempExtraGroups;
        currentExtraGroups.push(groupName);
        this.setState({ tempExtraGroups : currentExtraGroups });
    };

    onSaveButtonClicked = () => {
        const currentEndpoint = this.state.endpointData;
        const action = currentEndpoint._id ? "updateProject" : "insertNewProject";

        APIGateway[action](currentEndpoint).then(res => res.json()).then(res => {
            this.setState({
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
        this.setState({ endpointData: routeObject })
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
                                <Button size='mini' color='green' onClick={this.onSaveButtonClicked} icon='save'/>
                                <Button size='mini' color='orange' onClick={this.onResetButtonClicked}>Reset</Button>
                                {activeObj._id ? (
                                    <Fragment>
                                        <Button onClick={this.onDeleteButtonClicked(activeObj._id)} size='mini' color='red' icon='delete'/>
                                        <Button onClick={this.onGoToButtonClick} size='mini' color='blue' floated='right' icon labelPosition='left'>
                                            <Icon name='paper plane' />{truncate(activeObj.path, { length: 15 })}
                                        </Button>
                                    </Fragment>
                                ) : ''}
                            </Segment>
                            <Segment stacked>
                                <RouteFormComponent
                                    groups={this.getProjectsGroups()}
                                    onAddExtraGroupItem={this.onAddExtraGroupitem}
                                    onChange={this.onRouteFormChanged}
                                    routeObject={activeObj}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default WithLayout(HomePage);