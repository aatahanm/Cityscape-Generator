
var canvas;
var gl;

var maxNumVertices  = 800;
var index = 0;
var text = "";

var cindex = 1;
var bindex = 1;
var totalFloor = 0;
var scene = 0;

var loadColor = [];
var loadFloor = [];


var sky = [
		vec2(-1.0,-0.4 ),
        vec2(-1.0, 1.0 ),
        vec2( 1.0,-0.4 ),
        vec2( 1.0, 1.0 ) 
];

var skyColor = vec4(0.0,0.718,0.785, 0.9 );

var ground = [
		vec2(-1.0,-0.4 ),
        vec2(-1.0, -1.0 ),
        vec2( 1.0,-0.4 ),
        vec2( 1.0, -1.0 ) 
];

var groundColor = vec4(0.625,0.278,0.209,1.0);

var colors = [

    vec4( 1.0, 1.0, 1.0, 1.0 ),  // black
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];    
var t;

var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

var findex = [];
findex[0] = 0;
var counter = 0;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    document.getElementById("slider").onchange = function() {
        cindex = event.srcElement.value;
        cindex++;
    };

    document.getElementById("slider2").onchange = function() {
        bindex = event.srcElement.value;
        bindex++;
    };
        
    var a = document.getElementById("Button1")
    a.addEventListener("click", function(){
  		numPolygons++;
    	numIndices[numPolygons] = 0;
    	start[numPolygons] = index;
    	render();
    });

    var b = document.getElementById("Button2")
    b.addEventListener("click", function(){
    	loadColor = [];
        loadFloor = [];
    	generateScene(cindex,bindex,loadColor,loadFloor);
    });

function generateScene(cindex,bindex,loadColor,loadFloor){
    index = 0;
    numPolygons = 0;
    numIndices[0] = 0;
    start = [0];

    findex = [0];
    counter = 0;
    floorLevel = 0;
    totalFloor = 0;
    text = "";
        
    //Generating the sky
    for ( var skyy = 0 ; skyy < 4 ; skyy++){
		t = sky[skyy];
        addBuffer(bufferId);

        t = skyColor;
        addCBuffer(cBufferId);

        numIndices[numPolygons]++;
        index++;
		}
 
    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = index;
    findex[counter] = numPolygons;
    counter ++;

    //Generating a sun by taking a center point and increasing the 
    //x and y axis by cos(PI/36*i),sin(PI/32*i) respectively
    for (var i = 0; i <Math.PI*2; i+=Math.PI/36) {
        
        t  = vec2(0.75 + Math.cos(i)/10,
                  0.60 + Math.sin(i)/10*(canvas.width/canvas.height));
        addBuffer(bufferId);
       
        t = vec4(1.0, 0.7, 0.0, 1.0 );
        addCBuffer(cBufferId);
        
        numIndices[numPolygons]++;
        index++; 
	}
	numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = index;

    //Generating a ground
	for ( var gr = 0 ; gr < 4 ; gr++){
       	t = ground[gr];
       	addBuffer(bufferId);
       	t = groundColor;
        addCBuffer(cBufferId);

        numIndices[numPolygons]++;
        index++;
	} 

    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = index;

    text += cindex + "," + bindex;
        
    //Generating houses according cindex number if a drawing is
    //loaded the color and floor numbers will be given respectively.
    //If not the floor will be chosen randomly from 1-to-bindex and
    //the color will be chosen randomly from the predefined collection
    var initial = -0.85;
    var houseWidth = 0.15*(canvas.width/canvas.height);
    var houseGap = 0.25*(canvas.width/canvas.height);
    
    for (var i=0;i<cindex;i++){
        
        if (loadColor.length != 0){
        	randomColor = loadColor[i];
        }else{
            var randomColor = Math.floor(Math.random() * 6);
        	}
            
        if(loadFloor.length != 0){
          	randomFloor = (loadFloor[i]-1);
        }else{
            var randomFloor = Math.floor(Math.random() * bindex );
            }
        //saving the color and floor number for each house    
        text += "\r\n" + randomColor + "," + (randomFloor+1);
        totalFloor += randomFloor+1;
        var rooftop = -0.4;
        for (var j=0;j<2;j++){
            
            t = vec2((initial + j*houseWidth),
                -0.4*(canvas.width/canvas.height));
            addBuffer(bufferId);
            
            t = vec4(colors[randomColor]);
        	addCBuffer(cBufferId);

            numIndices[numPolygons]++;
            index++; 


            t = vec2((initial + j*houseWidth),
                rooftop + 0.15*randomFloor*(canvas.width/canvas.height));      
            addBuffer(bufferId);
         
            t = vec4(colors[randomColor]);	
            addCBuffer(cBufferId);

            numIndices[numPolygons]++;
            index++; 
        } 

        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;

        //Adding a roof
        for (var k=0;k<1.5;k+=0.5){
            if(k==0.5)
            	t = vec2((initial + 0.15*k*(canvas.width/canvas.height)),
                (rooftop + 0.15*randomFloor*(canvas.width/canvas.height)) 
                + 0.3*k*(canvas.width/canvas.height));
                else
            	t = vec2((initial + 0.15*k*(canvas.width/canvas.height)),
            	(rooftop + 0.15*randomFloor*(canvas.width/canvas.height)));
            addBuffer(bufferId);
            
            t = vec4(0.8, 0.0, 0.0, 1.0 );
        	addCBuffer(cBufferId);

            numIndices[numPolygons]++;
            index++; 
        }

        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;

        //Generating tree bodies. If there is a single house no tree body
        //will be generated.
        if(cindex != 1 && i < cindex - 1 ){
            for(var l=0;l<2;l++){
            	t = vec2((initial + 0.41 - 0.02*l),(-0.8));        
            	addBuffer(bufferId);
            	t = vec4( 0.625,0.278,0.209,0.7 );
        		addCBuffer(cBufferId);

            	numIndices[numPolygons]++;
            	index++;  

            	t = vec2((initial + 0.82/2 - 0.02*l),-0.58);        
            	addBuffer(bufferId);
            	t = vec4( 0.625,0.278,0.209,0.7 );
        		addCBuffer(cBufferId);

            	numIndices[numPolygons]++;
            	index++;   
            }
        }

        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;
        findex[counter] = numPolygons;
        counter++;

        //Generating the tree circles. Used the same principle 
        //as the sun.
        if(cindex != 1 && i < cindex - 1 ){
        	for (var s= 0; s <Math.PI*2; s+=Math.PI/18) {
        		t  = vec2(initial + 0.82/2 - 0.01 + Math.cos(s)/12, 
                  -0.48 + Math.sin(s)/12*(canvas.width/canvas.height));
        		addBuffer(bufferId);
        		
        		t = vec4(0.4, 0.8, 0.2, 1.0 );
       			addCBuffer(cBufferId);

        		numIndices[numPolygons]++;
        		index++; 
        	}
        }

        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index; 

        //Adding fences to houses each floor level will generate 2
        //fences
         var fence = initial + 0.04 ;
         var fenceBreak = 0.1;
         var floorLevel = -0.7;
         for(var o=0; o<2;o++){
         	for (var p=0;p<=randomFloor;p++){
         		for (var u=0;u<2;u++){
            		t = vec2((fence + 0.1*u +o*0.13), floorLevel + p*0.1);
            		addBuffer(bufferId);
            		t = vec4(0.6, 0.6, 0.6, 0.8 );
        			addCBuffer(cBufferId);

            		numIndices[numPolygons]++;
            		index++; 


            		t = vec2((fence + 0.1*u + o*0.13), floorLevel + 0.2 + p*0.1);
            		addBuffer(bufferId);
            		t = vec4(0.6, 0.6, 0.6, 0.8);
        			addCBuffer(cBufferId);

            		numIndices[numPolygons]++;
            		index++; 
            	}
            floorLevel += 0.2; 
            numPolygons++;
            numIndices[numPolygons] = 0;
            start[numPolygons] = index;
        }
        floorLevel = -0.7;
    }

    initial += houseGap; 

}

    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = index;

    loadColor = [];
    loadFloor = [];

    //total number of polygons excluding clouds
	scene = numPolygons ;
        render();
    }    
    //on every click add the point to the buffer
    canvas.addEventListener("mousedown", function(event){
        t  = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        
        addBuffer(bufferId);
        t = vec4(0.6, 0.6, 0.6, 0.7 );
        
        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

        numIndices[numPolygons]++;
        index++;
    } );

    var save = document.getElementById("save");

    //save the number of houses their color and floor number as a txt file
    save.onclick = function(){
    
        var filename = "Cityscape.txt";

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
     };

     //initialize cindex,bindex and match the houses with their color according the selected file.
     var load = document.getElementById("load");

     load.onchange = function(event){

        var file = event.target.files[0]; // File object

        var reader = new FileReader();
        reader.onload = function(progressEvent){
        
        var starts = this.result.split('\n');

		var stop = starts.length-1;
		
        cindex = convertText(starts[0])[0];
        bindex = convertText(starts[0])[1];
        
        for (var cc=1; cc < stop+1 ; cc++){
        	loadColor[cc-1] = convertText(starts[cc])[0];
        	loadFloor[cc-1] = convertText(starts[cc])[1];
        	 
        }
        generateScene(cindex,bindex,loadColor,loadFloor);
        };
        reader.readAsText(file);
     };

function convertText(text)
{

    var values = text.split(',');
    var point = [];
    for(i = 0; i< values.length; i++)
    	
    point.push(parseFloat(values[i]))

    return point;
}
function addBuffer(bufferId){
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));
}

function addCBuffer(cBufferId){
	gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
}     

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0 , 1.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    //print the sun and sky first so that we can get clouds in front of them
    gl.drawArrays( gl.TRIANGLE_STRIP, start[0], numIndices[0] );
	gl.drawArrays(gl.TRIANGLE_FAN, start[1], numIndices[1]);

	//draw clouds
    for(var j = scene ; j < numPolygons; j++) {
        gl.drawArrays( gl.TRIANGLE_FAN, start[j], numIndices[j] );
    }
    counter = 1;
    //draw the houses, trees and ground
    for(var i = 2; i < scene ; i++) {
        gl.drawArrays( gl.TRIANGLE_STRIP, start[i], numIndices[i] );
       	if(i == findex[counter] ){
            gl.drawArrays( gl.TRIANGLE_FAN, start[i], numIndices[i] );
            counter++;
       }
    }
}
          

