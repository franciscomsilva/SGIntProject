/*VARIAVEIS GLOBAIS*/
var coresBackground = ["orange","#6495ED","red","white","#e4e6e7"];
var i = 0, j = 0;
var displayHelp = 1;
var displayInfo = 1;
var objeto = 1; //1=casaco 2=saia
var clipes = [];
var acoes = [];
var misturador = null;

//CRIA CENA
var cena = new THREE.Scene()
cena.receiveShadow = true
cena.castShadow = true

//CRIA CAMARA
var camara = new THREE.PerspectiveCamera(70, 800 / 600, 0.1, 500)
camara.position.set(0, 3,10)
camara.lookAt(0, 0, 0)

//CRIAR MIXER
misturador = new THREE.AnimationMixer(cena);

//CRIAR RELOGIO
var relogio = new THREE.Clock();

//OPCOES DE RENDERIZACAO
var meuCanvas = document.getElementById('meuCanvas')
var renderer = new THREE.WebGLRenderer({ canvas: meuCanvas, alpha: true })
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth,650)

/*LUZES*/
var luzPonto1 = new THREE.PointLight("white")
luzPonto1.position.set(0, 1, 5)
luzPonto1.castShadow = true
luzPonto1.visible = true;
cena.add(luzPonto1)

var luzAmbiente = new THREE.AmbientLight( "white" )
cena.add(luzAmbiente)

var luzSpotlight = new THREE.SpotLight('white',2);
luzSpotlight.position.set(0,5,2);
luzSpotlight.visible = true;
cena.add(luzSpotlight);

var luzDirecional = new THREE.DirectionalLight("white",1);
luzDirecional.position.set(0,5,0).normalize();
luzDirecional.visible = true;
cena.add(luzDirecional);

//ORBIT CONTROLS
var controlos = new THREE.OrbitControls(camara, renderer.domElement);


//FUNCAO DO CARREGADOR DA CENA
var carregador = new THREE.GLTFLoader();
carregador.load(
	    'blender/objects.gltf',
	    function (gltf) {
	        cena.add(gltf.scene)
	        clipes.push(THREE.AnimationClip.findByName(gltf.animations,'casacoAction'));
	       	clipes.push(THREE.AnimationClip.findByName(gltf.animations,'saiaAction'));
	        acoes.push(misturador.clipAction(clipes[0]));
	        acoes.push(misturador.clipAction(clipes[1]));

	        //OBJETOS 3D
	        var casaco = cena.getObjectByName('casaco')
	        var saia = cena.getObjectByName('saia');
	     
	        //BOTOES DO HTML
			var btnAnimation = document.getElementById('btnAnimation');
			var btnModelColor = document.getElementById('btnModelColor');
			var btnLight = document.getElementById('btnLight');
			var btnBackground = document.getElementById('btnBackground');
			var btnUp = document.getElementById('btnUp');
			var btnLeft = document.getElementById('btnLeft');
			var btnDown = document.getElementById('btnDown');
			var btnRight = document.getElementById('btnRight');
			var btnRotateLeft = document.getElementById('btnRotateLeft');
			var btnRotateRight = document.getElementById('btnRotateRight');
			var btnHelp = document.getElementById('btnHelp');
			var btnInformation = document.getElementById('btnInformation');
			var btnCasaco = document.getElementById('btnCasaco');
			var btnSaia = document.getElementById('btnSaia');

			//TRIGGERS DOS BOTOES
			btnBackground.addEventListener('click', mudarBackground);
			btnLight.addEventListener('click',mudarLight);
			btnModelColor.addEventListener('click',mudarCor);
			btnAnimation.addEventListener('click',Animation);
			btnUp.addEventListener('click',Up);
			btnLeft.addEventListener('click',Left);
			btnDown.addEventListener('click',Down);
			btnRight.addEventListener('click',Right);
			btnRotateLeft.addEventListener('click',RotateLeft);
			btnRotateRight.addEventListener('click',RotateRight);
			btnHelp.addEventListener('click',onClickHelp);
			btnInformation.addEventListener('click',onClickInfo);
			btnCasaco.addEventListener('click',showCasaco);
			btnSaia.addEventListener('click',showSaia);

			//VARIAVEIS DO BOTAO DE AJUDA
			var helpTitle = document.getElementById('helpTitle');
			var helpBody = document.getElementById('helpBody');
			var headingHelp = document.getElementById('headingHelp');
			var helpText = document.getElementById('helpText');

			//VARAVEIS DO BOTAO DE INFORMAÇAO
			var infoTitle = document.getElementById('infoTitle');
			var infoBody = document.getElementById('infoBody');
			var headingInfo = document.getElementById('headingInfo');
			var infoText = document.getElementById('infoText');

			
			//CONFIGURACOES INICIAIS DO OBJETOS
			saia.visible = false;
			btnCasaco.style.backgroundColor = '#FCAD26';
			btnCasaco.style.color = '#fff';


			//FUNCOES BOTOES
			function showCasaco(){
				objeto = 1;
				btnSaia.style.backgroundColor = '#fff';
				btnSaia.style.color = '#FCAD26';
				btnCasaco.style.backgroundColor = '#FCAD26';
				btnCasaco.style.color = '#fff';
				saia.visible = false;
				casaco.visible = true;
			}

			function showSaia(){
				objeto = 2;
				btnCasaco.style.backgroundColor = '#fff';
				btnCasaco.style.color = '#FCAD26';
				btnSaia.style.backgroundColor = '#FCAD26';
				btnSaia.style.color = '#fff';
				casaco.visible = false;
				saia.visible = true;
			}

			function onClickInfo(){
				displayInfo++;

				if(displayInfo % 2 == 0){
					showInfo();
				}else{
					hideInfo();
				}
			}

			function showInfo(){
				hideHelp();
				var titleWidth = 0;
				var bodyHeight = 0;
				var id = setInterval(frame,1);
				function frame(){
					if(titleWidth == 270){
						clearInterval(id);
						headingInfo.style.display='block';
						headingInfo.style.animation = "fadein-right 0.3s";
						var id2 = setInterval(frame2,1);
						function frame2(){
							if(bodyHeight == 270){
								clearInterval(id2);
								infoText.style.display = 'block';
								infoText.style.animation = 'fadein-bottom 0.3s';
							}else{
								bodyHeight +=5;
								infoBody.style.height = bodyHeight + 'px';
							}
						}

					}else{
						titleWidth += 5;
						infoTitle.style.width = titleWidth + 'px';
					}
				}
			}

			function hideInfo(){
				infoText.style.animation = 'fadeout-bottom 0.6s';
				headingInfo.style.animation = 'fadeout-right 0.6s';
				var bodyHeight = 270;
				var titleWidth = 270;
				var id2 = setInterval(frame2,1);

				function frame2(){
					if(bodyHeight == 0){
						clearInterval(id2);
						var id1 = setInterval(frame1,1);

						function frame1(){
							if(titleWidth == 0){
								clearInterval(id1);
							}else{
								headingInfo.style.display = 'none';
								titleWidth -= 5;
								infoTitle.style.width = titleWidth + 'px';
							}
						}
					}else{
						infoText.style.display = 'none';
						bodyHeight -= 5;
						infoBody.style.height = bodyHeight + 'px';
					}
				}
			}


			function onClickHelp(){
				displayHelp++;

				if(displayHelp % 2 == 0){
					showHelp();
				}else{
					hideHelp();
				}
			}

			function showHelp(){
				hideInfo();
				var titleWidth = 0;
				var bodyHeight = 0;
				var id = setInterval(frame,1);
				btnInformation.style.display = 'none';
				function frame(){
					if(titleWidth == 270){
						clearInterval(id);
						headingHelp.style.display='block';
						headingHelp.style.animation = "fadein-right 0.3s";
						var id2 = setInterval(frame2,1);
						function frame2(){
							if(bodyHeight == 270){
								clearInterval(id2);
								helpText.style.display = 'block';
								helpText.style.animation = 'fadein-bottom 0.3s';
							}else{
								bodyHeight +=5;
								helpBody.style.height = bodyHeight + 'px';
							}
						}

					}else{
						titleWidth += 5;
						helpTitle.style.width = titleWidth + 'px';
					}
				}
			}

			function hideHelp(){
				helpText.style.animation = 'fadeout-bottom 0.6s';
				headingHelp.style.animation = 'fadeout-right 0.6s';
				var bodyHeight = 270;
				var titleWidth = 270;
				var id2 = setInterval(frame2,1);

				function frame2(){
					if(bodyHeight == 0){
						clearInterval(id2);
						var id1 = setInterval(frame1,1);

						function frame1(){
							if(titleWidth == 0){
								clearInterval(id1);
							}else{
								headingHelp.style.display = 'none';
								titleWidth -= 5;
								helpTitle.style.width = titleWidth + 'px';
							}
						}
					}else{
						helpText.style.display = 'none';
						bodyHeight -= 5;
						helpBody.style.height = bodyHeight + 'px';
					}
				}
				btnInformation.style.display = 'block';

			}	

			function Up(){
				camara.position.y = camara.position.y - 0.5;
			}

			function Left(){
				camara.position.x = camara.position.x + 0.5;
			}

			function Down(){
				camara.position.y = camara.position.y + 0.5;
			}

			function Right(){
				camara.position.x = camara.position.x - 0.5;
			}

			function RotateLeft(){
				if(objeto == 1){
					casaco.rotateZ(0.3)
				}else{
					saia.rotateY(0.3);
				}
			}

			function RotateRight(){
				if(objeto == 1){
					casaco.rotateZ(-0.3)
				}else{
					saia.rotateY(-0.3);
				}
			}

			function Animation(){
				acoes.forEach(function(i){
					i.setLoop(THREE.LoopOnce);
                	i.clampWhenFinished = true;
					i.reset();
					i.play();
				});
					
			}

			function mudarCor() {
				if(i > 4){
					i = 0;
				}
				if(objeto == 1){
			    	casaco.material.color = new THREE.Color(coresBackground[i]);
			    }else{
			    	saia.children[0].material.color = new THREE.Color(coresBackground[i]);
			    }
				i++;
			}

			function mudarLight() {
				switch(j){
					case 1:
						luzPonto1.visible = false;
						break;

					case 2:
						luzPonto1.visible = true;
						break;

					case 3:
						luzPonto1.visible = false;
						luzSpotlight.visible = true;
						break;

					case 4:
						luzSpotlight.visible = false;
						break;

					case 5:
						luzAmbiente.visible = false;
						break;

					case 6:
						luzDirecional.visible = true;
						break;

					case 7:
						luzDirecional.visible = false;
						break;

					case 8:
						luzPonto1.visible = true;
						luzSpotlight.visible = true;
						break;

					case 9:
						luzDirecional.visible = true;
						break;

					case 10:
						luzSpotlight.visible = false;
						break;

					default:
						luzPonto1.visible = false;
						luzSpotlight.visible = false;
						luzDirecional.visible = false;
						luzAmbiente.visible = false;
						j = 0;
				}
				
				j++; 
				  
			}

			function mudarBackground() {
				if(i > 4){
					i = 0;
				}
				document.body.style.background = coresBackground[i];
				i++;
			}

	    }
	)




//FUNCAO QUE ANIMA E RENDERIZA A CENA
function animar(){
	misturador.update(relogio.getDelta())
	requestAnimationFrame( animar )
	renderer.render( cena, camara )
}


animar()

