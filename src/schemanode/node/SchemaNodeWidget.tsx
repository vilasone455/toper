import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { SchemaNodeModel } from './SchemaNodeModel';
import { SchemaPortLabel } from '../port/SchemaPortLabelWidget';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { SchemaPortModel } from '../port/SchemaPortModel';

import IconButton from '@material-ui/core/IconButton';


import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

	export const Node = styled.div<{ background ?: string; selected: boolean }>`
	
	

		border-style: solid;

		border-color : grey;

		border-width: thin;

		color: white;
		
		overflow: visible;
		font-size: 13px;
		
	`;

	export const Title = styled.div`
		background-color: #005AA0;
		display: flex;
		font-weight: 600;
		white-space: nowrap;
		justify-items: center;
	`;

	export const TitleName = styled.div`
		margin-left : 10px;
		flex-grow: 1;
		padding: 10px 5px;
	`;

	export const Ports = styled.div`
		display: flex;
		color : #5E666E;
		font-weight: 600;
		background-color: white;
	`;

	export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		&:first-of-type {
			margin-right: 10px;
		}
		&:only-child {
			margin-right: 0px;
		}
	`;


export interface DefaultNodeProps {
	node: SchemaNodeModel;
	engine: DiagramEngine;
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */


export class SchemaNodeWidget extends React.Component<DefaultNodeProps> {


	  fireAction (event : any) {
		this.props.engine.getActionEventBus().fireAction({
		  event: {
			...event,
			key: '',
			preventDefault: () => {},
          stopPropagation: () => {},
		  },
		});
	  }

	  fireDeleteEvent(engine : DiagramEngine){
		let e = { type: 'keydown', ctrlKey: true, code: 'Delete' }
		this.fireAction(e);
	  }

	fireDoubleClick(engine : DiagramEngine){
		console.log("double click")
		if(engine != undefined){
	
			engine.fireEvent({ }, 'onDoubleClick');
		}else{
			console.log("unid")
		}
		
	}


	generatePort = (port : SchemaPortModel) => {
	
		return <SchemaPortLabel engine={this.props.engine} port={port} key={port.getID()}  />;
	};



	render() {
		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color} onDoubleClick={() => this.fireDoubleClick(this.props.engine)}>
				<Title>
					<TitleName>{this.props.node.getOptions().name}</TitleName>
					<IconButton  onClick={()=> this.fireDeleteEvent(this.props.engine)} color="inherit" size="small">
          				<DeleteOutlineIcon/>
        			</IconButton>

				</Title>
				<Ports>
					<PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</PortsContainer>
					<PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}