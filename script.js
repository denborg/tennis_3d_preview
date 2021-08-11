var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas, true);

BABYLON.SceneLoader.Load("//raw.githubusercontent.com/denborg/tennis_3d_preview/main/", "scene.gltf", engine, function (scene) {

	var camera = new BABYLON.ArcRotateCamera("camera1", 4.716, 1.156,33, BABYLON.Vector3(0.192244,13.692957,30.368917), scene);
	camera.lowerBetaLimit = 1.156;
	camera.upperBetaLimit = 1.156;
	camera.lowerRadiusLimit = 33;
	camera.upperRadiusLimit = 33;
	/* var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(50, 5, -30), scene);
		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7; */
	//camera.attachControl(canvas, false);
	scene.activeCamera.attachControl(canvas)
/* 1.5644661323117803
script.js:147 1.147212303805618 */
	scene.setGlobalEnvTexture = false;
	var colors = [
		'royal_blue',
		'stone_gray',
		'amer_clay',
		'olympic_blue',
		'forest_green',
		'adobe_tan',
		'summer_red',
		'spring_green',
		'winter_green',
		'tour_purple'
	]

	var colors_to_hex = {
		'adobe_tan':'#CB9832',
		'forest_green': '#036635',
		'olympic_blue': '#0C7B97',
		'amer_clay': '#BF673B',
		'royal_blue': '#254B95',
		'spring_green':'#318540',
		'stone_gray': '#B8BFBB',
		'summer_red': '#AE4025',
		'tour_purple': '#362063',
		'winter_green': '#027D41'
	}

	custom_materials = Object();
	
	
	for (var materil of scene.materials) {
		custom_materials[materil.name] = materil;
		console.log(materil.name);
		materil.reflectionTexture = null;
		materil.specularColor = new BABYLON.Color3(0, 0, 0);
	}
	
	for (var materil in custom_materials) {
		custom_materials[materil].specularColor = new BABYLON.Color3(0,0,0);
	}

	var ground = [];
	var banners = [];
	var borders = [];
	var field = [];
	var chairs = [];
	var lounges = [];
	var walls = [];
	

	var colorable_list = [
		'field',
		'ground',
		'borders',
		'chairs'
	]
	
	var grib_to_hooman = {
		'chairs':'Сиденья',
		'ground':'Забеги',
		'borders':'Борты',
		'field':'Игровое поле'
	}

	var colorable_elements = {
		'chairs': chairs,
		'ground': ground,
		'borders': borders,
		'field': field,
		'banners': banners
	}

	for (var mesh of scene.meshes){
		if (mesh.name.includes('border')){
			borders.push(mesh);
		}
		if (mesh.name.includes('ground')){
			ground.push(mesh);
		}
		if (mesh.name.includes('banner')){
			banners.push(mesh);
		}
		if (mesh.name == 'field'){
			field.push(mesh);
		}
		if (mesh.name.includes('chairs')){
			chairs.push(mesh);
		} 
		if (mesh.name.includes('lounge')){
			lounges.push(mesh)
		}
		if (mesh.name.includes('wall') || mesh.name.includes('wing')){
			walls.push(mesh);
		}
	}
	
	for (var gr of ground) {
		gr.receiveShadows = true;
	}
	for (var lounge of lounges) {
		lounge.receiveShadows = true;
	}
	for (var fi of field) {
		fi.receiveShadows = true;
	}
	
	
	
	
	var ground_material = new BABYLON.StandardMaterial("ground_mat", scene);
	ground_material.diffuseColor = new BABYLON.Color3.FromInts(59,161,77);
	var field_material = new BABYLON.StandardMaterial("field_mat", scene);
	field_material.diffuseColor = new BABYLON.Color3.FromInts(45,91,179);


	var text_on_black = new BABYLON.DynamicTexture("text_b", 500,scene, true);
	var text_on_white = new BABYLON.DynamicTexture("text_w", 50,scene, true);
	var black_bar_material = new BABYLON.StandardMaterial("bar_mat_b", scene);
	var white_bar_material = new BABYLON.StandardMaterial("bar_mat_w", scene);
	black_bar_material.diffuseTexture = text_on_black;
	white_bar_material.diffuseTexture = text_on_white;
	var material = new BABYLON.StandardMaterial("mat",scene);
	material.diffuseColor = new BABYLON.Color3.White;
	//material.ambientTexture = new BABYLON.Texture("https://raw.githubusercontent.com/esa08/virtual-gallery/master/3d-models/img/luk1.jpg");

	/* createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

	createRectangle().verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	createRectangle().verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	 */
	var selected_element = 'field';
	var color_buttons = [];
	var element_buttons = Object();
	function get_color_callback(color){
		return function() {
			element_buttons[selected_element].background = colors_to_hex[color];
			for (var el of colorable_elements[selected_element]){
				el.material = custom_materials[color];
				console.log(custom_materials[color])
			}
		}
	}
	
	function get_element_callback(elem) {
		return function() {
			for (var el in element_buttons){
				if (el == elem){
					element_buttons[el].color = 'black';
				} else {
					element_buttons[el].color = 'white';
				}
			}
			selected_element = elem;
		}
	}


	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");


	for (var elem of colorable_list){
		element_buttons[elem] = BABYLON.GUI.Button.CreateSimpleButton(elem + '_button', grib_to_hooman[elem]);
		element_buttons[elem].width = "150px"
		element_buttons[elem].height = "40px";
		element_buttons[elem].color = "white";
		element_buttons[elem].cornerRadius = 0;
		element_buttons[elem].thickness = 3;
		element_buttons[elem].background = "gray";
		element_buttons[elem].top = (20 + (Object.keys(element_buttons).length - 1) * 50).toString() + 'px';
		element_buttons[elem].left = '20px';
		element_buttons[elem].onPointerUpObservable.add(
			get_element_callback(elem)
		);
		advancedTexture.addControl(element_buttons[elem]);
		element_buttons[elem].horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		element_buttons[elem].verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	}
	
	for (var color of colors){
		current_index = color_buttons.push(BABYLON.GUI.Button.CreateSimpleButton(color + '_button', '')) - 1;
		color_buttons[current_index].width = "40px"
		color_buttons[current_index].height = "40px";
		color_buttons[current_index].color = "white";
		color_buttons[current_index].cornerRadius = 0;
		color_buttons[current_index].thickness = 3;
		color_buttons[current_index].background = colors_to_hex[color];
		color_buttons[current_index].top = '20px';
		color_buttons[current_index].left = (200 + (color_buttons.length - 1) * 55).toString() + 'px';
		color_buttons[current_index].right = '40px';
		color_buttons[current_index].onPointerUpObservable.add(
			get_color_callback(color)
			
		);
		advancedTexture.addControl(color_buttons[current_index]);
		color_buttons[current_index].horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		color_buttons[current_index].verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	}


	//var a_light = new BABYLON.HemisphericLight("a_light", new BABYLON.Vector3(0, 0, 0), scene);
	//a_light.intensity = 0.05;
	var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-15, -5, -5), scene);
	var light1 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(7, -5, 5), scene);
	light1.position = new BABYLON.Vector3(0, 40, -50);
	light1.density = 3.5;
	light.position = new BABYLON.Vector3(0, 40, 50);
	light1.intensity = 3.5;
	//light1.range = 1;
	var shadowGenerator = new BABYLON.ShadowGenerator(4096, light1);
	for (var mesh of scene.meshes) {
		shadowGenerator.addShadowCaster(mesh);
	}
	for (var border of borders){
		border.material = custom_materials['summer_red'];
	}
	for (var chair of chairs){
		chair.material = custom_materials['olympic_blue'];
	}
	
	ground[0].material = custom_materials['olympic_blue'];
	field[0].material = custom_materials['summer_red'];
	element_buttons['chairs'].background = colors_to_hex['olympic_blue'];
	element_buttons['field'].background = colors_to_hex['summer_red'];
	element_buttons['field'].color = 'black';
	element_buttons['borders'].background = colors_to_hex['summer_red'];
	element_buttons['ground'].background = colors_to_hex['olympic_blue'];
	
	//scene.lights[0].dispose()
	shadowGenerator.bias = 150;
	shadowGenerator.blurScale = 10;
	shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP;
	var lightSphere1 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
	lightSphere1.position = light1.position;
	lightSphere1.material = new BABYLON.StandardMaterial("light", scene);
	lightSphere1.material.emissiveColor = new BABYLON.Color3.FromInts(255, 218, 121);
	shadowGenerator.usePoissonSampling = true;
	shadowGenerator.bias = 0.0000000001;
	//custom_materials['Material'].diffuseColor = new BABYLON.Color3.FromInts(142,46,30);
	wall_mat = new BABYLON.StandardMaterial('wall_mat', scene);
	//wall_mat.diffuseColor = new BABYLON.Color3.FromInts(255, 218, 121);
	//wall_mat.backFaceCulling = false; */
	for (var wall of walls) {
		wall.material.backFaceCulling = false;
	}
	var lounge_mat = new BABYLON.StandardMaterial("lounge", scene);
	lounge_mat.diffuseTexture = new BABYLON.Texture("//mastertennis.info/modules/md_tennis/files/texture.jpg", scene);
	lounge_mat.diffuseTexture.vScale = 10;
	lounge_mat.diffuseTexture.uScale = 10;
	lounge_mat.specularColor = new BABYLON.Color3(0, 0, 0.2);
	ground[0].material.specularColor = BABYLON.Color3(0,0,0);
	for (var lounge of lounges) {
		lounge.material = custom_materials['wing_mat'];
		lounge.receiveShadows = false;
	}
	
	
	
	console.log(scene.lights);
	
	//scene.environmentTexture = null
	scene.clearColor = BABYLON.Color3.FromInts(153,204,255);
	engine.runRenderLoop(function () {
		scene.render();
	});
	window.addEventListener("resize", function () {
        engine.resize();
    });

});