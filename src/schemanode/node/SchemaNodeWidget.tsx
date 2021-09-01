import * as React  from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { SchemaNodeModel } from './SchemaNodeModel';
import { SchemaPortLabel } from '../port/SchemaPortLabelWidget';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { SchemaPortModel } from '../port/SchemaPortModel';

import IconButton from '@material-ui/core/IconButton';


import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { RootState } from '../../store';
import { connect, useSelector } from 'react-redux';
import { FunctionComponent } from 'react';
import { NodeTheme } from '../../reducer/theme/theme';

	export const Node = styled.div<{ background ?: string; selected: boolean }>`
		border: solid 1px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'grey')};
		color: white;
		overflow: visible;
		font-size: 13px;
	`;

	export const Title = styled.div<{ background ?: string}>`
		background-color: ${(p) => p.background};
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

interface GetStateProp{
	nodetheme ?: NodeTheme;
}

export interface DefaultNodeProps {
	node: SchemaNodeModel;
	engine: DiagramEngine;

}

type Props = DefaultNodeProps & GetStateProp

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */

const mapStateToProps = (state: RootState) => ({
	nodetheme: state.themeReducer.nodeTheme
  })


export const SchemaNodeWidget : FunctionComponent<Props> = ({node , engine , nodetheme}) => {

	const theme = useSelector((state:RootState) => state.themeReducer.nodeTheme)

	const fireAction = (event : any) => {
		engine.getActionEventBus().fireAction({
		  event: {
			...event,
			key: '',
			preventDefault: () => {},
          stopPropagation: () => {},
		  },
		});
	  }

	 const fireDeleteEvent = () => {
		let e = { type: 'keydown', ctrlKey: true, code: 'Delete' }
		fireAction(e);
	  }

	const fireDoubleClick = () => {
		if(engine != undefined){
			engine.fireEvent({ }, 'onDoubleClick');
		}
	}

	const generatePort = (port : SchemaPortModel) => {	
		return <SchemaPortLabel engine={engine} port={port} key={port.getID()}  />;
	};


	return (
		<Node
				data-default-node-name={node.getOptions().name}
				selected={node.isSelected()}
				background={theme.bgcolor} onDoubleClick={fireDoubleClick}>
				<Title background={theme.bgcolor}>
					<TitleName>{node.getOptions().name} {nodetheme?.bgcolor}</TitleName>
					
					<IconButton  onClick={fireDeleteEvent} color="inherit" size="small">
          				<DeleteOutlineIcon/>
        			</IconButton>
				</Title>
				<Ports>
					<PortsContainer>{_.map(node.getInPorts(), generatePort)}</PortsContainer>
					<PortsContainer>{_.map(node.getOutPorts(), generatePort)}</PortsContainer>
				</Ports>
			</Node>
	)
}

export default connect(mapStateToProps)(SchemaNodeWidget)

/*
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
		if(engine != undefined){
			engine.fireEvent({ }, 'onDoubleClick');
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
*/


