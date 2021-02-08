import * as React from 'react';
import styled from '@emotion/styled';

//import { useSelector } from 'react-redux'



export interface DemoCanvasWidgetProps {
	color?: string;
	background?: string;
}

	export const Container = styled.div<{ color: string; background: string }>`

		background-color: ${(p) => p.background};
		background-size: 50px 50px;
	
		background-image: linear-gradient(
				0deg,
				transparent 24%,
				${(p) => p.color} 25%,
				${(p) => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${(p) => p.color} 75%,
				${(p) => p.color} 76%,
				transparent 77%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 24%,
				${(p) => p.color} 25%,
				${(p) => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${(p) => p.color} 75%,
				${(p) => p.color} 76%,
				transparent 77%,
				transparent
			);
	`;


export class DemoCanvasWidget extends React.Component<DemoCanvasWidgetProps> {
	//public schemax  = useSelector(getSchema)
	render() {
		//console.log(this.schemax)
		return (
			<Container
				background={this.props.background || 'rgb(60, 60, 60)'}
				color={this.props.color || 'rgba(255,255,255, 0.05)'}>
				{this.props.children}
			</Container>
		);
	}
}