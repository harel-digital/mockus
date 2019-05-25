import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Grid, Dropdown, GridColumn } from 'semantic-ui-react';
import { isEqual } from 'lodash';
import AceEditor from 'react-ace';

import ResponseHeadersTable from './ResponseHeadersTable';

import { statusCodes } from '../StaticData/StatusCodes.json';
import { responseTypes } from '../StaticData/ResponseTypes.json';
import { httpMethods} from '../StaticData/HTTPMethods.json';

import "brace/ext/language_tools";

const languages = [
    'json',
    'javascript',
    'html',
    'xml'
];

const themes = [
    "monokai",
    "github",
    "tomorrow",
    "kuroir",
    "twilight",
    "xcode",
    "textmate",
    "solarized_dark",
    "solarized_light",
    "terminal"
];

themes.forEach(theme => {
    require(`brace/theme/${theme}`);
});

languages.forEach(lang => {
    require(`brace/mode/${lang}`);
    require(`brace/snippets/${lang}`);
});

export default class RouteFormComponent extends Component {
    static propTypes = {
        routeObject: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired,
        groups: PropTypes.arrayOf(PropTypes.string).isRequired,
        onAddExtraGroupItem: PropTypes.func
    };
    
    constructor(props) {
        super(props);

        this.state = {
            routeObject: props.routeObject,
            theme: 'monokai',
            syntaxLanguage: 'json'
        }
    }

    componentDidUpdate(prevProps) {
        if(!isEqual(this.props.routeObject,prevProps.routeObject))  {
            this.setState({routeObject: this.props.routeObject});
        }
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
                value={this.props.routeObject.method.toUpperCase()}
                onChange={this.onFormItemChange('method')}
                placeholder='Method'
                options={options}/>
        );
    }

    renderResponseCodeDropdown() {
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
                value={this.props.routeObject.responseCode}
                onChange={this.onFormItemChange('responseCode')}
                placeholder='Status Code'
                options={options}/>
        );
    }

    onAddGroupitem = (e, {value}) => {
        if(this.props.onAddExtraGroupItem) {
            this.props.onAddExtraGroupItem(value);
        }
    }

    renderGroupDropdown() {
        let options = this.props.groups.length ? this.props.groups.map(group => {
            return {
                key: group,
                value: group,
                text: group
            }
        }) : [];

        return (
            <Dropdown
                fluid
                search
                selection
                allowAdditions
                value={this.props.routeObject.group}
                onChange={this.onFormItemChange('group')}
                placeholder='Group'
                onAddItem={this.onAddGroupitem}
                options={options} />
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
                value={this.props.routeObject.responseObjectType.toUpperCase()}
                onChange={this.onFormItemChange('responseObjectType')}
                placeholder='Response Type'
                options={options} />
        );
    }

    onFormItemChange = (propertyName) => {
        return (e, { value }) => {
            switch(propertyName) {
                case "path":
                    if(!value.trim()) value = "/";
                    if(!value.startsWith("/")) value = `/${value}`;
                    break;
                
                default:
                    break;
            }

            const currentRouteObject = this.state.routeObject;
            currentRouteObject[propertyName] = value || e.value || e;
            this.setState({ routeObject: currentRouteObject });
            this.props.onChange(currentRouteObject);
        }
    }

    onHeadersChanged = (newHeaders) => {
        const currentRouteObject = this.state.routeObject;
        currentRouteObject.headers = newHeaders;
        this.setState({ routeObject: currentRouteObject });
    }

    render() {
        const { routeObject } = this.props;
        return (
            <Form as={Grid} size='tiny' padded>
                <Form.Group as={Grid.Row}>
                    <Form.Field as={Grid.Column} width={10}>
                        <label>Route</label>
                        <Input
                            onChange={this.onFormItemChange('path')}
                            value={routeObject.path}
                            fluid
                            placeholder='/example-url'/>
                    </Form.Field>
                    <Form.Field as={Grid.Column} width={6}>
                        <label>Method</label>
                        {this.renderHTTPMethodDropdown()}
                    </Form.Field>
                </Form.Group>
                <Form.Group as={Grid.Row}>
                    <Form.Field as={Grid.Column} width={4}>
                        <label>Group</label>
                        {this.renderGroupDropdown()}
                    </Form.Field>
                    <Form.Field as={Grid.Column} width={4}>
                        <label>Response code</label>
                        {this.renderResponseCodeDropdown()}
                    </Form.Field>
                    <Form.Field as={Grid.Column} width={4}>
                        <label>Response type</label>
                        {this.renderResponseTypeDropdown()}
                    </Form.Field>
                    <Form.Field as={Grid.Column} width={4}>
                        <label>Delay</label>
                        <Input
                            fluid
                            value={routeObject.delay}
                            onChange={this.onFormItemChange('delay')}
                            placeholder='Delay'
                            type='number'/>
                    </Form.Field>
                </Form.Group>
                <Form.Group as={Grid.Row}>
                    <Form.Field as={Grid.Column} width={16}>
                        <label>Headers</label>
                        <ResponseHeadersTable onHeadersChanged={this.onHeadersChanged} headers={routeObject.headers}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group as={Grid.Row}>
                    <Form.Field as={Grid.Column} width={16}>
                        <label>Response object</label>
                        <AceEditor
                            mode={this.state.syntaxLanguage}
                            theme={this.state.theme}
                            onChange={this.onFormItemChange('responseBody')}
                            value={routeObject.responseBody}
                            width="100%"
                            name="Editor"
                            showPrintMargin={false}
                            editorProps={{$blockScrolling: true}}/>
                    </Form.Field>
                </Form.Group>

                <Form.Group as={Grid.Row}>
                    <Form.Field as={GridColumn} width={8}>
                        <label>Theme</label>
                        <Dropdown
                            onChange={(e, { value }) => this.setState({theme: value})}
                            selection
                            options={themes.map(theme => ({text: theme, value: theme, key: theme}))}/>
                    </Form.Field>
                    <Form.Field as={GridColumn} width={8}>
                        <label>Language</label>
                        <Dropdown
                            onChange={(e, { value }) => this.setState({syntaxLanguage: value})}
                            selection
                            options={languages.map(lang => ({text: lang, value: lang, key: lang}))}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}