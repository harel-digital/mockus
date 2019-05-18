import React, { Component } from 'react';
import { Table, Icon, Input } from 'semantic-ui-react';

export default class ResponseHeadersTable extends Component {
    insertNewLine() {
        const { headers } = this.props;
        headers.push({});
        this.props.onHeadersChanged(headers);
    }

    onCellInputFocus = (index) => {
        return () => {
            const { headers } = this.props;

            if(index+1 === headers.length && (headers[index].key || headers[index].value)) {
                this.insertNewLine();
            }
        }
    }

    onRemoveHeaderButtonClick = (index) => {
        return () => {
            const { headers } = Object.assign({}, this.props);
            headers.splice(index, 1);
            if(!headers.length) {
                headers.push({ key: "", value: ""});
            }
            this.props.onHeadersChanged(headers);
        }
    }

    onCellInputChange = (part, index) => {
        return (e, { value }) => {
            const { headers, onHeadersChanged } = this.props;

            headers[index][part] = value;

            if(onHeadersChanged) {
                this.props.onHeadersChanged(headers);
            }
        }
    }

    render() {
        return (
            <Table celled striped selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={3}>Response Headers</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.props.headers.map((header, index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell width={6}>
                                    <Input
                                        fluid
                                        transparent
                                        onFocus={this.onCellInputFocus(index)}
                                        onChange={this.onCellInputChange("key", index)}
                                        value={header.key}/>
                                </Table.Cell>
                                <Table.Cell width={6}>
                                    <Input
                                        fluid
                                        transparent
                                        onFocus={this.onCellInputFocus(index)}
                                        onChange={this.onCellInputChange("value", index)}
                                        value={header.value}/>
                                </Table.Cell>
                                <Table.Cell width={4}>
                                    <Icon style={{ cursor: "pointer" }} name='x' onClick={this.onRemoveHeaderButtonClick(index)}/>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        );
    }
}