import React, { FunctionComponent, useEffect, useState } from 'react'

import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { DemoCanvasWidget } from '../components/CanvasDiagram';


import { Toolbar } from '../components/Toolbar'
import { AppToolbar } from '../components/AppToolbar'

import { ContextMenus } from '../components/ContextMenus/ContextMenus'
import { MenuProvider } from 'react-contexify';

import { DiagramController } from '../DiagramController/DiagramCtr'
import { TableData, TableEditor } from '../components/TableEditor'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import SimpleContext from '../components/ContextMenus/SimpleContext'
import * as htmlToImage from 'html-to-image';
import BaseGenerate from '../api/export/BaseGenerate';
import MySqlGenerate from '../api/export/MySqlGenerate';
import {TypeOrmGenerate} from '../api/code-template-export/TypeOrmGenerate';
import { getAllTable } from '../libs/tableUtil'
import { v4 as uuidv4 } from 'uuid';

import Cookies from 'js-cookie'

import axios from 'axios'

import { Project, projectToJson } from '../interface/project'
import { useHistory, useParams } from 'react-router';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleLoading } from '../reducer/share/action';

import { initApp } from '../reducer/loadapp';
import { saveProjectLocal, UpdateProjectProp } from '../reducer/project/thunkaction';

import { ShortCutMenu } from '../components/modal/ShortCutMenu';

import { toast } from "react-toastify";
import { ShareModal } from '../components/modal/ShareModal';
import JSZip from 'jszip';
import {saveAs} from 'file-saver'
import { BaseCodeTemplate } from '../api/code-template-export/BaseCodeTemplate';
import { SeedGenerator } from '../api/seed-generator/SeedGenerator';
import { Relation } from '../interface/Relation';
import { SeedGeneratorModal } from '../components/modal/SeedGeneratorModal';
import { defaultFakerForTable } from '../libs/fakerUtil';



enum VisibleStatus {
	Public,
	Private,
	Protected
}

export interface EditorParamType {
	projectId: string
}

export const Editor: FunctionComponent = () => {

	let { projectId } = useParams<EditorParamType>();

	const user = useSelector((state: RootState) => state.AuthReducer.user)

	const projectSaveType = useSelector((state: RootState) => state.ProjectReducer.projectSaveType)

	const isFetch = useSelector((state: RootState) => state.ShareReducer.isFetch)

	const darkState = useSelector((state: RootState) => state.themeReducer.darkMode)

	const [seedModal, setseedModal] = useState(false)

	const palletType = darkState ? "dark" : "light";

	const dispatch = useDispatch()

	const history = useHistory()

	const [isOnSelectNode, setisOnSelectNode] = useState(true)

	const [update, setupdate] = useState(false)

	const [exportDbModal, setexportDbModal] = useState(false)

	const [diagram, setDiagram] = useState(new DiagramController())

	const [currentProject, setcurrentProject] = useState(initProject())

	const [saveData, setsaveData] = useState("")

	const [isShareProject, setisShareProject] = useState(false)

	const [imageModal, setimageModal] = useState(false)

	const [isEdit, setEdit] = useState(false)

	const [shortcutModal, setshortcutModal] = useState(false)

	const [shareModal, setshareModal] = useState(false)

	const [linkUrl, setlinkUrl] = useState("")

	const [tables, settables] = useState<TableData[]>([])

	const [relations, setrelations] = useState<Relation[]>([])

	const darkTheme = createMuiTheme({
		palette: {
			type: palletType,
			primary: {
				main: "#5661B3",
				dark: "#333333"
			},
			secondary: {
				main: "#333333",
				dark: "#333333"
			}
		}
	});


	useEffect(() => {
		diagram.getEngine().registerListener({
			onDoubleClick: () => ToggleEditor(),
		})
		isLogger()

	}, [])



	function isLogger() {

		let pathname = history.location.pathname
		let pathsplit = pathname.split("/")

		let edittype = pathsplit[1]

		let token = Cookies.get("ertoken")
		if (token === undefined || token === "" ) {
			if (edittype === "share") {
				setisShareProject(true)
				loaduserAndProject()
			}else{
				history.push("/login")
			}
			
		} else {
			axios.defaults.headers.common['Authorization'] = "Bearer " + token
			if (!isFetch) {
				dispatch(initApp())
			}

			let pathname = history.location.pathname
			let pathsplit = pathname.split("/")

			let edittype = pathsplit[1]

			if (edittype === "editor") loaduserAndProject()
			if (edittype === "localeditor") loadLocalProject()

		}
	}

	function addOnSelectListener() {

		diagram.getEngine().getModel().getModels().forEach(item => {
			item.registerListener({
				selectionChanged: (e: any) => onSelectNode(e)
			})
		});

	}

	function loadLocalProject() {
		let projectstr = localStorage.getItem("projects")
		if (projectstr === null) return
		const projects: any[] = JSON.parse(projectstr)
		let projectRs = projects.find(p => p.Id === projectId)
		if (projectRs === undefined) return
		let clonep = currentProject
		clonep.ProjectName = projectRs.ProjectName
		clonep.ProjectDescription = projectRs.ProjectDescription
		diagram.saveDataByString(projectRs.ProjectDetail)
		setcurrentProject(clonep)
		addOnSelectListener()
	}

	function onSelectNode(e: any) {
		let isSelectData: boolean = e.isSelected
		setisOnSelectNode(isSelectData)
	}

	const loaduserAndProject = () => {
		let baseUrl = "https://toperbackend.herokuapp.com/"
		let urlSelect = (!isShareProject) ? "shareproject" : "loadproject"
		let loadProjectDataApi = `project/${urlSelect}/` + projectId
		axios.get(baseUrl + loadProjectDataApi).then(rs => {
			console.log(rs)
			currentProject.UserId = rs.data.user
			currentProject.ProjectName = rs.data.projectName
			currentProject.ProjectDescription = rs.data.projectDescription
			
			diagram.saveDataByString(rs.data.projectDetail)
			addOnSelectListener()
		})
	}

	function onSaveProject() {

		if(isShareProject){
			toast.error("You are not Permission for Edit this Diagram")
			return
		}

		if (projectSaveType === "cloud") {
			saveProject()
		} else if (projectSaveType === "device") {
			const model = diagram.getEngine().getModel().serialize()
			let update: UpdateProjectProp = {
				id: projectId,
				data: JSON.stringify(model)
			}
			dispatch(saveProjectLocal(update))
			toast.success("Save Project Sucess")
		}

	}

	async function saveProject() {
		const newproject = currentProject
		let baseUrl = "https://toperbackend.herokuapp.com/"
		let api = "project/update/" + projectId
		
		const model = diagram.getEngine().getModel().serialize()
		const modelstr = JSON.stringify(model)

		newproject.ProjectDetail = modelstr
		let data = projectToJson(newproject)

		dispatch(ToggleLoading(true))
		const rs = await axios.put(baseUrl + api, data)
		dispatch(ToggleLoading(false))
		toast.success("Save Project Sucess")
	}

	function exportPng(filename: string) {
		let node = document.getElementById('diagramcv');
		if (node == null) return
		htmlToImage.toPng(node)
			.then(function (dataUrl) {
				var img = new Image();
				img.src = dataUrl;
				var a = document.createElement('a');
				// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
				a.href = dataUrl
				a.download = filename;
				a.click();
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	function initProject(): Project {
		let pid = uuidv4()
		let project: Project = {
			ProjectName: "Projecttyu",
			ProjectDescription: "hello world",
			ProjectDetail: "",
			VisibleStatus: VisibleStatus.Private,
			UserId: user._id,
			ShareUrl: "xff"

		}

		return project
	}

	function openExport(id: string) {

		switch (id) {
			case "png-ex":
				exportPng(currentProject.ProjectName + ".png")
				break;
			case "json-ex":
				saveSerial()
				break;
			case "mysql-ex":
				exportSelect(currentProject.ProjectName+".sql" , new MySqlGenerate())
				break;
			case "pos-ex":
				alert("coming soon")
				break;
			case "sqlserver-ex":
				alert("coming soon")
				break;
			case "typeorm-ex":
				generateSchema(currentProject.ProjectName , new TypeOrmGenerate())
				break;

			default:
				break;
		}

		if (id === "dbexportmenu") {
			//db export
			setexportDbModal(true)
			//exportSelect(currentProject.ProjectName + ".sql", new MySqlGenerate())
		} else if (id === "imageexportmenu") {
			setimageModal(true)

		}
	}

	function generateSchema(filename:string , generate : BaseCodeTemplate){

		let tbs = getAllTable(diagram)
		let relationData = diagram.getRelationData()

		generate.generateCodeToZip(tbs , relationData , filename)
		
	}

	function generateSeedScript(){

		let tbs = getAllTable(diagram)
		let relationData = diagram.getRelationData()

		let seedGen = new SeedGenerator()
		let str = seedGen.generate(tbs , relationData)
		downloadFile(currentProject.ProjectName + "-seed.txt" , str)
	}

	function ToggleEditor() {
		setEdit(!isEdit)
	}

	function onZoomFit() {
		diagram.getEngine().zoomToFit()
	}

	function newTable() {
		diagram.newNode()
		addOnSelectListener()
	}

	function saveSerial() {
		let modelJson = diagram.getEngine().getModel().serialize()
		let modelStr = JSON.stringify(modelJson)
		setsaveData(modelStr)
		downloadFile(currentProject.ProjectName + ".er", modelStr)
	}

	const onChangeFile = (e: any) => {
		console.log(e)
	}


	function loadOpenFile() {
		var elem = document.getElementById("importjson");
		if (elem && document.createEvent) {
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, false);
			elem.dispatchEvent(evt);
		}
	}

	function onLoadFile(e: any) {
		console.log("on load")
		/*
		var input = e.target;
		var reader = new FileReader();
		reader.onload = (es) => {
			var text: any = reader.result;
			let model2 = new DiagramModel()
			let obj: ReturnType<DiagramModel['serialize']> = JSON.parse(text);
			model2.deserializeModel(obj, diagram.engine)
			if (model2 == null) {
				return
			}
			e.target.value = null
			diagram.getEngine().setModel(model2)

		};
		reader.readAsText(input.files[0]);
		*/
	}

	/*

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

	*/

	function togglePropUpdate() {
		setupdate(!update)
	}

	function downloadFile(fileName: string, content: string) {
		var a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		a.setAttribute('download', fileName);

		a.style.display = 'none';
		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	}

	function exportSelect(filename: string, codeGen: BaseGenerate) {
		let tbs = getAllTable(diagram)
		let relationData = diagram.getRelationData()
		let str = codeGen.export(tbs, relationData)
		downloadFile(filename, str)
	}

	function resetDiagram() {
		diagram.clearDiagram()
	}

	function exportSql(filename: string) { exportSelect(filename, new MySqlGenerate()) }

	function zoomIn() { diagram.doZoom(25) }

	function zoomOut() { diagram.doZoom(-25) }


	function onDownloadImage(filename: string) {
		setimageModal(false)
		if (filename !== "") exportPng(filename + ".png")

	}

	function onCloseDbExport(name: string) {
		setexportDbModal(false)
		alert(name)
		switch (name) {
			case "Mysql":
				exportSql(currentProject.ProjectName + ".sql")
				break;
			case "sqlserver":
				alert("coming soon")
				break;
			case "postresql":
				alert("coming soon")
				break;
			case "oracle":
				alert("coming soon")
				break;
			case "Laravel":
				alert("test export ")
				
				break;
			case "Image":
				exportPng(currentProject.ProjectName + ".png")
				break;
			case "Json":
				saveSerial()
				break;
			case "TypeOrm":
				exportSelect(currentProject.ProjectName + ".txt" , new TypeOrmGenerate())
				break;
			default:
				break;
		}
	}

	function openSeedMenu(){
		let tbs = getAllTable(diagram)
		let newtbs = defaultFakerForTable(tbs)
		settables(newtbs)
		setrelations(diagram.getRelationData())
		setseedModal(true)

	}

	function closeSeedMenu(){

		settables([])
		setrelations([])
		setseedModal(false)
	}

	function onMenuName(menuname: string) {
	
		switch (menuname) {
			case "shortcutmenu":
				setshortcutModal(true)
				break;
			case "exportmenu":
				setexportDbModal(true)
				break;
			case "importmenu":
				loadOpenFile()
				break;
			case "seedmenu":
				//generateSeedScript()
				openSeedMenu()
				break;	
			case "sharemenu":
				let link = history.location.pathname
				let linksplit = link.split("/")
				link = "https://toper.netlify.app" + "/share/" + linksplit[2]
				setlinkUrl(link)
				setshareModal(true)
				break;
			default:
				break;
		}
	}

	function handleZoomEvent(name:string){
		if(name === "Reset View") {
			diagram.zoomFit()
			return
		}
		let zoommap : any = {
			"100%" : 100,
			"75%" : 75,
			"50%" : 50
		}
		diagram.zoomPercent(zoommap[name])
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<AppToolbar diagram={diagram} onExport={openExport} isDark={darkState}
				onSave={onSaveProject} onSelectChange={isOnSelectNode} onOpenMenu={onMenuName} />
			<Toolbar onZoomIn={zoomIn} isRender={false} isDark={darkState} onRedo={diagram.redo}
				onZoomOut={zoomOut} onZoomFit={diagram.zoomFit} newTable={newTable} onUndo={diagram.undo}
				onCut={diagram.cutSelected} onDel={diagram.deleteSelected} onZoomSelectChange={handleZoomEvent}
				onDup={diagram.duplicateSelected} isNodeSelect={isOnSelectNode} onCopy={diagram.copySelected} />

			<SeedGeneratorModal isOpen={seedModal} tables={tables} relations={relations} onClose={()=>closeSeedMenu()} />
			
			<ShortCutMenu isOpen={shortcutModal} onClose={() => setshortcutModal(false)} />

			<ShareModal isOpen={shareModal} linkUrl={linkUrl} onClose={()=>setshareModal(false)}/>

			<input type="file" style={{ display: "none" }} id="jsonimport" onChange={() => onLoadFile} />

			<input type="file" style={{ display: "none" }} id="importjson" onChange={onChangeFile} />

			<TableEditor isOpen={isEdit} diagramctr={diagram}
				onclose={ToggleEditor} forceUpdate={update} />

			<MenuProvider id="diagram" storeRef={false} >
				<DemoCanvasWidget background="#FFFF" color="#808080" isDark={darkState} >
					<CanvasWidget engine={diagram.engine} className="canvas" />
				</DemoCanvasWidget>
			</MenuProvider>

			<SimpleContext />

			<ContextMenus copyFunc={diagram.copySelected} pasteFunc={diagram.pasteSelected} deleteFunc={diagram.deleteSelected}
				duplicateFunc={diagram.duplicateSelected} cutFunc={diagram.cutSelected}
				zoomIn={zoomIn} zoomOut={zoomOut} undoFunc={diagram.undo} redoFunc={diagram.redo} />
		</ThemeProvider >

	);

}



