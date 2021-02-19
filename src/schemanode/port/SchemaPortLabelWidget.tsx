import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { SchemaPortModel } from './SchemaPortModel';
import styled from '@emotion/styled';

import { MenuProvider  } from 'react-contexify';


export interface DefaultPortLabelProps {
	port: SchemaPortModel;
	engine: DiagramEngine;

}


	export const PortLabel = styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
		&:hover {
			background: rgb(192, 255, 0);
		}
	`;

	export const Label = styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`;

	export const Port = styled.div`
		width: 16px;
		height: 21px;
		background: rgba(255, 255, 244, 0.1);
		&:hover {
			background: rgb(192, 255, 0);
		}
	`;


export class SchemaPortLabel extends React.Component<DefaultPortLabelProps> {
	render() {
		const port = (
			<PortWidget engine={this.props.engine} port={this.props.port}>
				<Port />
			</PortWidget>
		);
		const label = <Label>{this.props.port.getOptions().label}</Label>;

		return (
			<MenuProvider id="nodeedit" storeRef={false} >
				<PortLabel>
				{this.props.port.getOptions().in ? port : label}
				{this.props.port.getOptions().in ? label : port}
				</PortLabel>
			</MenuProvider>
			
		);
	}
}