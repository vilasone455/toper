import React, { FunctionComponent, useEffect , useState } from 'react'


import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { DemoCanvasWidget } from './components/CanvasDiagram';


import { Toolbar } from './components/Toolbar'
import { AppToolbar } from './components/AppToolbar'
import {  DiagramModel } from "@projectstorm/react-diagrams";

import { ExportEditor } from './components/ExportEditor'
import {FileMenu}  from './components/FileMenu'

import { ContextMenus } from './components/ContextMenus/ContextMenus'
import { MenuProvider } from 'react-contexify';

import { DiagramController } from './DiagramController/DiagramCtr'
import { TableEditor } from './components/TableEditor'

import SimpleContext from './components/ContextMenus/SimpleContext'
import * as htmlToImage from 'html-to-image';
import BaseGenerate from './api/export/BaseGenerate';
import MySqlGenerate from './api/export/MySqlGenerate';

import {getAllTable} from './libs/tableUtil'
import { v4 as uuidv4 } from 'uuid';

import Cookies from 'js-cookie'

import axios from 'axios'

import {User , defaultUser , jsonToUser} from './interface/user'

import {Project , defaultProjects , jsonToProject} from './interface/project'

enum VisibleStatus {
	Public,
	Private,
	Protected
}



export const App: FunctionComponent = () => {

	const [user, setuser] = useState(defaultUser())

	const [update, setupdate] = useState(false)

	const [isLogin, setisLogin] = useState(true)

	const [diagram, setDiagram] = useState(new DiagramController())

	const [toggleFileMenu, settoggleFileMenu] = useState(true)

	const [projectList, setprojectList] = useState(defaultProjects())

	const [currentProject, setcurrentProject] = useState(initProject())

	const [isExportOpen, setisExportOpen] = useState(false)

	const [saveData, setsaveData] = useState("")

	const [isEdit, setEdit] = useState(false)

	useEffect(() => {
		diagram.getEngine().registerListener({
			onDoubleClick: () => ToggleEditor()
		})
		isLogger()
	}, [])

	

	function isLogger(){
	
		let token = Cookies.get("ertoken")
		if(token === undefined || token === "") {
			setisLogin(false)
			settoggleFileMenu(true)
		}else{
			alert("set token")
			axios.defaults.headers.common['Authorization'] = "Bearer " + token
			loaduserAndProject()
		}
	}

	const loaduserAndProject = () => {
		let baseUrl = "https://toperbackend.herokuapp.com/"
		let userApi = "user/getuser"
		let projectApi = "project/getprojects"

		axios.all([
			axios.get(baseUrl + userApi), 
			axios.get(baseUrl + projectApi)
		  ])
		  .then(axios.spread((data1, data2) => {
			alert("fetch success")
			if(data1.data.length > 0){
				let userrs = data1.data[0]
				
				setuser(user)

			}

			let projects : Project[] = []

			data2.data.forEach((projectrs : any) =>{
				const project : Project = jsonToProject(projectrs)
				projects.push(project)
			})

			setprojectList(projects)

			console.log(projectList)
			
			
		  }));
	}

	const onLogOut = () => {
		Cookies.set("ertoken" , "")
		isLogger()
	}

	const onLogin = (userName : string , userPassword : string) => {
		let url = "https://toperbackend.herokuapp.com/auth/login"
	
		axios.post(url , {userName , userPassword}).then(rs=>{
			if(rs.status == 200){
		
				if(rs.data.access_token !== ""){
					alert('login success')
					let data = rs.data
					let userdata : User = jsonToUser(data)
					setisLogin(true)
					setuser(userdata)
					Cookies.set("ertoken" , rs.data.access_token)
				}
			}
		})
		
	}

	function exportPng(filename : string) {
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

	function initProject() : Project{
		let pid = uuidv4()
		let project : Project = {
			Id : pid,
			ProjectName : "Project",
			ProjectDescription : "",
			ProjectDetail : "",
			VisibleStatus : VisibleStatus.Private,
			UserId : user.Id,
			ShareUrl : ""
			
		}
		return project
	}

	function openExport() { setisExportOpen(true) }

	function ToggleEditor() {
		setEdit(!isEdit)
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

		//new code
		let rs : Project = {
			Id : "",
			ProjectName : currentProject.ProjectName,
			ProjectDescription : currentProject.ProjectDescription,
			VisibleStatus : currentProject.VisibleStatus,
			ShareUrl : "",
			UserId : currentProject.UserId,
			ProjectDetail : modelStr
		}

		setsaveData(modelStr)

		console.log(modelJson)

		downloadFile("someer.er" , modelStr)
		//new code
		downloadFile(rs.ProjectName + ".er" , JSON.stringify(rs))
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

	function downloadFile(fileName : string , content : string){
		var a = document.createElement('a');
		// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
		a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		a.setAttribute('download', fileName);

		a.style.display = 'none';
		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	}

	function exportSelect(filename : string,codeGen : BaseGenerate){
		let tbs = getAllTable(diagram)
		//alert(JSON.stringify(tbs))
		let str = codeGen.export(tbs)
		alert(str)

		downloadFile(filename , str)
	}

	function exportSql(filename : string){exportSelect(filename , new MySqlGenerate())}

	function zoomIn() {diagram.doZoom(20)}

	function zoomOut() {diagram.doZoom(-20)}

	function testEx(e : string){alert(e)}

	return (
		<React.Fragment>

			<AppToolbar onExport={openExport}/>
			<Toolbar onZoomIn={zoomIn}
			onZoomOut={zoomOut} onZoomFit={loadOpenFile} newTable={newTable} onSave={saveSerial} 
			onLoad={loadOpenFile} />
			<ExportEditor 
				isOpen={isExportOpen} onclose={() => setisExportOpen(false)} exportTest={testEx}
				exportPng={exportPng} exportPdf={exportPng} exportSql={exportSql} fileName={currentProject.ProjectName}
			/>
			<input type="file" id="fileinput" style={{ display: "none" }} onChange={onLoadFile}/>
			<FileMenu isOpen={toggleFileMenu} onLogin={onLogin} onclose={() => settoggleFileMenu(!toggleFileMenu)} 
			isLogin={isLogin} projects={projectList} />
			<TableEditor isOpen={isEdit} diagramctr={diagram} 
			onclose={ToggleEditor} forceUpdate={update} />

			<MenuProvider id="diagram" storeRef={false} >
				<DemoCanvasWidget background="#E9E9E9" color="#808080" >
					<CanvasWidget engine={diagram.engine} className="canvas" />
				</DemoCanvasWidget>
			</MenuProvider>

			<SimpleContext  />

			<ContextMenus copyFunc={diagram.copySelected} pasteFunc={diagram.pasteSelected} deleteFunc={diagram.deleteSelected}
			duplicateFunc={diagram.duplicateSelected} cutFunc={diagram.cutSelected} 
			zoomIn={zoomIn} zoomOut={zoomOut}/>

		</React.Fragment>

	);

}



