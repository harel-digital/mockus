import React, { Component, Fragment } from 'react';
import AceEditor from 'react-ace';
import { Grid, Card, Icon, Input, Select, Button, Segment } from 'semantic-ui-react';
import WithLayout from '../../HOC/WithLayout';
import ProjectList from '../../components/ProjectList/ProjectList';
import APIGateway, { ApiGateway } from '../../services/APIGateway';

import { statusCodes } from '../../StaticData/StatusCodes.json';
import { responseTypes } from '../../StaticData/ResponseTypes.json';
import { httpMethods} from '../../StaticData/HTTPMethods.json';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import ResponseHeadersTable from '../../components/ResponseHeadersTable';

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

    renderStatusCodeDropdown() {
        const options = statusCodes.map(stCode => {
            return {
                key: stCode.code,
                value: stCode.code,
                text: `${stCode.code} - ${stCode.text}`
            }
        });

        return (
            <Select
                fluid
                value={this.state.endpointData.responseCode}
                onChange={this.onFormItemChange('responseCode')}
                placeholder='Status Code'
                options={options}/>
        );
    }

    renderResponseTypeDropdown() {
        const options = responseTypes.map(rt => {
            return {
                key: rt.value,
                value: rt.value,
                text: rt.text
            }
        });

        return (
            <Select
                fluid
                value={this.state.endpointData.responseObjectType.toUpperCase()}
                onChange={this.onFormItemChange('responseObjectType')}
                placeholder='Response Type'
                options={options} />
        );
    }

    renderHTTPMethodDropdown() {
        const options = httpMethods.map(method => {
            return {
                key: method,
                value: method,
                text: method
            }
        });
        return (
            <Select
                value={this.state.endpointData.method.toUpperCase()}
                onChange={this.onFormItemChange('method')}
                placeholder='Method'
                options={options}/>
        );
    }

    onNewEndpointButtonClicked = () => {
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

    onDeleteEndpointButtonClicked = (id) => {
        return () => {
            APIGateway.deleteProject(id).then(res => res.json()).then(res => {
                this.setState({
                    projects : res,
                    endpointData: this.getEmptyEndpointDataObject()
                });  
            });
        }
    }

    onFormItemChange = (propertyName) => {
        return (e, { value }) => {
            
            //eslint-disable-next-line default-case
            switch(propertyName) {
                case "path":
                    if(!value.trim()) {
                        value = "/";
                    }
                    
                    if(!value.startsWith("/")) {
                        value = `/${value}`;
                    }
                    break;
            }

            const currentEndpointObject = this.state.endpointData;
            currentEndpointObject[propertyName] = value || e.value || e;
            this.setState({ endpointData: currentEndpointObject });
        }
    }

    onProjectItemClick = (item) => {
        this.setState({ endpointData: item });
    }

    onHeadersChanged = (newHeaders) => {
        const currentEndpointObject = this.state.endpointData;
        currentEndpointObject.headers = newHeaders;
        this.setState({ endpointData: currentEndpointObject });
    }

    onGoToButtonClick = () => {
        let { path } = this.state.endpointData;

        path = path.trim();

        if(path && path !== "/") {
            window.open(`${ApiGateway.getBaseAPIUrl()}${path}`);   
        }
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
                                <Button size='mini' color='green' onClick={this.onNewEndpointButtonClicked}>Save</Button>
                                <Button size='mini' color='orange' onClick={this.onResetButtonClicked}>Reset</Button>
                                {activeObj._id ? (
                                    <Fragment>
                                        <Button onClick={this.onDeleteEndpointButtonClicked(activeObj._id)} size='mini' color='red'>Delete</Button>
                                        <Button onClick={this.onGoToButtonClick} size='mini' color='blue' floated='right'>Go to: {activeObj.path}</Button>
                                    </Fragment>
                                ) : ''}
                            </Segment>
                            <Card fluid>
                                <Card.Content>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Input
                                                    onChange={this.onFormItemChange('path')}
                                                    value={activeObj.path}
                                                    fluid
                                                    placeholder='/example-url'
                                                    labelPosition='right'
                                                    label={this.renderHTTPMethodDropdown()}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={6}>
                                                {this.renderStatusCodeDropdown()}
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                {this.renderResponseTypeDropdown()}
                                            </Grid.Column>
                                            <Grid.Column floated='right' width={4}>
                                                <Input
                                                    fluid
                                                    value={activeObj.delay}
                                                    onChange={this.onFormItemChange('delay')}
                                                    placeholder='Delay'
                                                    type='number'/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <ResponseHeadersTable onHeadersChanged={this.onHeadersChanged} headers={activeObj.headers}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <AceEditor
                                                    mode="javascript"
                                                    theme="monokai"
                                                    onChange={this.onFormItemChange('responseBody')}
                                                    value={activeObj.responseBody}
                                                    width="100%"
                                                    name="Editor"
                                                    showPrintMargin={false}
                                                    editorProps={{$blockScrolling: true}}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>

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