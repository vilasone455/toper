import React, { FunctionComponent, useEffect , useState } from 'react'


import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { DemoCanvasWidget } from './components/CanvasDiagram';


import { Toolbar } from './components/Toolbar'
import { AppToolbar } from './components/AppToolbar'
import {  DiagramModel } from "@projectstorm/react-diagrams";

import { ExportEditor } from './components/ExportEditor'
import { FileMenu } from './components/FileMenu'

import { ContextMenus } from './components/ContextMenus/ContextMenus'
import { Menu, MenuProvider } from 'react-contexify';

import { DiagramController } from './DiagramController/DiagramCtr'
import { TableEditor } from './components/TableEditor'

import SimpleContext from './components/ContextMenus/SimpleContext'
import * as htmlToImage from 'html-to-image';

export const App: FunctionComponent = () => {

	const [update, setupdate] = useState(false)

	const [diagram, setDiagram] = useState(new DiagramController())

	const [isExportOpen, setisExportOpen] = useState(false)

	const [saveData, setsaveData] = useState("")

	const [isEdit, setEdit] = useState(false)

	useEffect(() => {
		console.log('start app')
		diagram.getEngine().registerListener({
			onDoubleClick: () => ToggleEditor()
		})
	}, [])

	function exportPng() {

		let node = document.getElementById('diagramcv');
		if (node == null) return
		htmlToImage.toPng(node)
			.then(function (dataUrl) {
				var img = new Image();
				img.src = dataUrl;
				var a = document.createElement('a');
				// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
				a.href = dataUrl
				a.download = 'somefilename.png';
				a.click();
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	function exportPdf() {

		let node = document.getElementById('diagramcv');
		if (node == null) return
		htmlToImage.toPng(node)
			.then(function (dataUrl) {
				var img = new Image();
				img.src = dataUrl;
				var a = document.createElement('a');
				// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
				a.href = dataUrl
				a.download = 'somefilename.png';
				a.click();
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	function openExport() { setisExportOpen(true) }

	function ToggleEditor() {
		setEdit(!isEdit)
	}

	function onZoomIn() {
		alert('zoom in ')
		//diagram.zoomIn({})
		//diagram.getEngine().
	}

	function onZoomOut() {
		alert('zoom out ')

		//diagram.zoomIn({})
	}

	function onZoomFit() {
		alert('zoom fit ')
		diagram.getEngine().zoomToFit()
	}

	function newTable() {
		diagram.newNode()
	}

	function saveSerial() {
		let modelJson = diagram.getEngine().getModel().serialize()

		let modelStr = JSON.stringify(modelJson)

		setsaveData(modelStr)

		console.log(modelJson)

		var a = document.createElement('a');
		// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
		a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(modelStr));
		a.setAttribute('download', "myer.er");

		a.style.display = 'none';
		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	}



	function testLink() {
		diagram.linktest()
	}

	function loadOpenFile() {
		var elem = document.getElementById("fileinput");
		if (elem && document.createEvent) {
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, false);
			elem.dispatchEvent(evt);
		}
	}

	function onLoadFile(e: any) {
		alert("select")
		var input = e.target;
		console.log(e)
		var reader = new FileReader();
		reader.onload = (es) => {
			var text: any = reader.result;

			console.log(text)
			let model2 = new DiagramModel()
			let obj: ReturnType<DiagramModel['serialize']> = JSON.parse(text);
			model2.deserializeModel(obj, diagram.engine)
			if (model2 == null) {
				console.log("model null")
				return
			}
			e.target.value = null
			diagram.getEngine().setModel(model2)

		};
		reader.readAsText(input.files[0]);
	}

	function loadSerial() {

		if (saveData == "") return
		let str = saveData
		let model2 = new DiagramModel()
		let obj: ReturnType<DiagramModel['serialize']> = JSON.parse(str);
		model2.deserializeModel(obj, diagram.engine)
		if (model2 == null) {
			console.log("model null")
			return
		}

		diagram.getEngine().setModel(model2)
		togglePropUpdate()
		console.log("load sucess")
	}

	function togglePropUpdate() {
		setupdate(!update)
	}

	function zoomIn() {diagram.doZoom(20)}

	function zoomOut() {diagram.doZoom(-20)}

	return (
		<React.Fragment>

			<AppToolbar onExport={openExport}></AppToolbar>
			<Toolbar onZoomIn={zoomIn}
				onZoomOut={zoomOut} onZoomFit={loadOpenFile} newTable={newTable} onSave={saveSerial} 
				onLoad={loadOpenFile} />
			<ExportEditor isOpen={isExportOpen}
				onclose={() => setisExportOpen(false)}
				exportPng={exportPng} exportPdf={exportPdf}></ExportEditor>
			<input type="file" id="fileinput" style={{ display: "none" }} onChange={onLoadFile}></input>
			<FileMenu isOpen={true}></FileMenu>
			<TableEditor isOpen={isEdit} diagramctr={diagram} onclose={ToggleEditor}
				forceUpdate={update}></TableEditor>

			<MenuProvider id="diagram" storeRef={false} >
				<DemoCanvasWidget background="#E9E9E9" color="#808080" >
					<CanvasWidget engine={diagram.engine} className="canvas" />
				</DemoCanvasWidget>
			</MenuProvider>

			<SimpleContext  />

			<ContextMenus copyFunc={diagram.copySelected} pasteFunc={diagram.pasteSelected} deleteFunc={diagram.deleteSelected}
				duplicateFunc={diagram.duplicateSelected} cutFunc={diagram.cutSelected} 
				zoomIn={zoomIn} zoomOut={zoomOut}></ContextMenus>

		</React.Fragment>

	);

}



