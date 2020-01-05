import React from 'react';
import ia from "../../services/canvas/imageAdjustor";
import af from "../../services/arrayFunctions"
import "./CitySelector.scss";
import map from "../../static/israelPalestineLow.svg";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes, faPlus} from '@fortawesome/free-solid-svg-icons'
library.add(faTimes, faPlus);

export default class CitySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: this.props.cities,
            onSelect: this.props.onSelect,
            width: this.props.width,
            height: this.props.height,
            //the north-most coordinate visible in the map
            top: this.props.top,
            //the south-most coordinate visible in the map
            bottom: this.props.bottom,
            //the west-most coordinate visible in the map
            left: this.props.left,
            //the east-most coordinate visible in the map
            right: this.props.right,
            //the mouse position on the canvas, adjusted for zoom and translate transforms
            mouseX: 0,
            mouseY: 0,
            //the mouse position on the canvas, not adjusted for zoom and translate transforms (used for further zoom)
            mouseXOffset: 0,
            mouseYOffset: 0,
            //is the left-mouse currently pressed
            mousePressed: false,
            mousePressTime: 0,
            additiveSelection: false,
            rectSelectionMode: true,
            rectSelectionStart: null,
            polygonSelectionMode: false,
            polygonSelectionPoints: [],
            highlightedCity: null,
            canvas: null,
            ctx: null,
            translateX: 0,
            translateY: 0,
            zoom: 1,
            translateDragStart: null
        };
        this.canvasRef = React.createRef();
        this.imgRef = React.createRef();
    }
    componentDidMount() {
        const top = this.state.top;
        const bottom = this.state.bottom;
        const left = this.state.left;
        const right = this.state.right;
        //this is the canvas we draw on
        const canvas = this.canvasRef.current;
        canvas.addEventListener("mousemove", this.getPosition, false);
        canvas.addEventListener("mousedown", this.onPress, false);
        canvas.addEventListener("mouseup", this.onRelease, false);
        canvas.addEventListener("click", this.onClick, false);
        canvas.addEventListener("dblclick", this.onDblClick, false);
        window.addEventListener('keydown',this.onKeyPress,false);
        window.addEventListener('keyup',this.onKeyRelease,false);
        canvas.addEventListener('DOMMouseScroll', this.handleScroll,false);
        canvas.addEventListener('mousewheel', this.handleScroll,false);
        //initialize wrapper canvas to have the same size as the image it's wrapping
        canvas.width = this.state.width;
        canvas.height = Math.floor(this.state.width/(right-left)*(top-bottom));
        const ctx = canvas.getContext('2d');
        this.setState({ctx: ctx, canvas: canvas}, ()=>{
            this.draw();
        });
        this.setState({drawInterval: setInterval(this.draw, 100)});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const cities = nextProps.cities;
        if(!cities.length) {
            return null;
        }
        if(prevState.length) {
            return null;
        }
        const width = prevState.width;
        const height = prevState.height;
        const top = prevState.top;
        const bottom = prevState.bottom;
        const left = prevState.left;
        const right = prevState.right;
        cities.forEach(c => {
            if(c.location && c.location.lng && c.location.lat) {
                let pos = CitySelector.coordinatesToPosition(width, height, top, bottom, left, right, c.location.lng, c.location.lat, true);
                c.x = pos.x;
                c.y = pos.y;
            }
        });
        if(prevState.providedSelection !== nextProps.selected){
            const selected = nextProps.selected || [];
            const selectedDict = af.toDict(selected);
            for(let i = 0; i < cities.length; i++){
                let city = cities[i];
                city.selected = !!(selectedDict[city.nameHe]);
            }
        }
        return {
            cities: cities,
            providedSelection: nextProps.selected
        };
    }

    static coordinatesToPosition(width, height, top, bottom, left, right, lng, lat, floor){
        const x = (lng - left)/(right-left)*width;
        const y = height - (lat - bottom)/(top-bottom)*height;
        return {x: floor ? Math.floor(x) : x, y: floor ? Math.floor(y) : y};
    }

    componentWillUnmount() {
        if(this.state.drawInterval)
            clearInterval(this.state.drawInterval);
    }

    drawMap(ctx, width, height){
        const scanImage = this.imgRef.current;
        //initialize canvas to have a white background to prevent transparent areas messing with the detection
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        //draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
        ia.drawImage(ctx, scanImage, 0, 0, width, height);
    }

    drawCities(ctx){
        const cities = this.state.cities.slice();
        ctx.lineWidth = 3;
        ctx.fillStyle="#90278E";
        ctx.strokeStyle="#40005e";
        ctx.beginPath();
        cities.filter(city => !city.selected).forEach(city=>{
            if(!city.location || !city.location.lat || !city.location.lng)
                return;
            ctx.moveTo(city.x + 5, city.y);
            ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
        });
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle="#409584";
        ctx.strokeStyle="#005544";
        ctx.beginPath();
        cities.filter(city => city.selected).forEach(city=>{
            if(!city.location || !city.location.lat || !city.location.lng)
                return;
            ctx.moveTo(city.x + 10, city.y);
            ctx.arc(city.x, city.y, 10, 0, 2 * Math.PI);
        });
        ctx.stroke();
        ctx.fill();
    }

    drawRectSelectionArea(ctx){
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        const selectionStart = this.state.rectSelectionStart;
        if(selectionStart){
            ctx.fillStyle="#90278E90";
            ctx.fillRect(
                Math.min(mouseX, selectionStart.x),
                Math.min(mouseY, selectionStart.y),
                Math.abs(mouseX - selectionStart.x),
                Math.abs(mouseY - selectionStart.y)
            )
        }
    }

    drawPolygonSelectionArea(ctx){
        const zoom = this.state.zoom;
        const vertices = this.state.polygonSelectionPoints.slice();
        if(!vertices.length)
            return;
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for(let i = 0; i < vertices.length; i++){
            const vertex = vertices[i];
            ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle="#ffffff80";
        ctx.lineWidth = Math.floor(16 / zoom);
        ctx.stroke();
        ctx.strokeStyle="#409584";
        ctx.lineWidth = Math.floor(10 / zoom);
        ctx.stroke();
    }

    drawCityHighlight(ctx){
        const cities = this.state.cities.slice();
        const highlighted = this.state.highlightedCity;
        if(highlighted !== null){
            ctx.lineWidth = 3;
            ctx.fillStyle="#60278E70";
            ctx.strokeStyle="#005544";
            ctx.beginPath();
            ctx.arc(cities[highlighted].x, cities[highlighted].y, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw = function() {
        const canvas = this.state.canvas;
        const ctx = this.state.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(this.state.translateX, this.state.translateY);
        ctx.scale(this.state.zoom, this.state.zoom);
        this.drawMap(ctx, canvas.width, canvas.height);
        this.drawCities(ctx);
        if(this.state.rectSelectionMode)
            this.drawRectSelectionArea(ctx);
        if(this.state.polygonSelectionMode)
            this.drawPolygonSelectionArea(ctx);
        this.drawCityHighlight(ctx);
        ctx.scale(1/this.state.zoom, 1/this.state.zoom);
        ctx.translate(-this.state.translateX, -this.state.translateY);
    }.bind(this);

    getClosestCity(x, y, cutoffDist){
        const cities = this.state.cities.slice();
        //const canvas = this.state.canvas;
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        let closestToCursor = null;
        let minDistFromCursor = cutoffDist * 2;
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(!city.location || !city.location.lat || !city.location.lng)
                continue;
            let distFromCursor = (Math.abs(city.y - mouseY) + Math.abs(city.x - mouseX));
            if(minDistFromCursor > distFromCursor){
                minDistFromCursor = distFromCursor;
                closestToCursor = i;
            }
        }
        return closestToCursor;
    }

    commitSelection(indexesToSelect){
        const additiveSelection = this.state.additiveSelection;
        const cities = this.state.cities.slice();
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(city.toBeSelected || (indexesToSelect && indexesToSelect.indexOf(i) !== -1)){
                city.selected = true;
            }
            else if(!additiveSelection){
                city.selected = false;
            }
            city.toBeSelected = false;
        }
        this.setState({cities: cities}, ()=>{
            this.sendSelection();
        })
    }
    
    sendSelection(){
        const cities = this.state.cities.slice();
        const selectedCities = cities.filter(c => c.selected);
        const selectedCitiesNames = selectedCities.map(c => c.nameHe);
        this.state.onSelect(selectedCitiesNames);
    }

    updateRectSelection(){
        if(!this.state.rectSelectionMode || this.state.rectSelectionStart === null){
            return;
        }
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        const selectionStartX = this.state.rectSelectionStart.x;
        const selectionStartY = this.state.rectSelectionStart.y;
        const maxX = Math.max(selectionStartX, mouseX);
        const maxY = Math.max(selectionStartY, mouseY);
        const minX = Math.min(selectionStartX, mouseX);
        const minY = Math.min(selectionStartY, mouseY);
        const cities = this.state.cities.slice();
        let selectedCities = [];
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(!city.location || !city.location.lat || !city.location.lng)
                continue;
            if(city.x >= minX && city.x <= maxX && city.y >= minY && city.y <= maxY){
                selectedCities.push(i);
            }
        }
        this.commitSelection(selectedCities);
    }

    updatePolygonSelection(){
        const points = this.state.polygonSelectionPoints.slice();
        const selectedPoints = [];
        if(points.length < 3)
            return;
        const cities = this.state.cities.slice();
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            let intersectionToTheRight = 0;
            for(let j = 0; j < points.length; j++){
                const start = points[j];
                const end = points[(j + 1) % points.length];
                if((city.y < start.y && city.y < end.y) || (city.y > start.y && city.y > end.y))
                    continue;
                const intersectionX = start.x + ((city.y - start.y) / (end.y - start.y) * (end.x - start.x));
                if(intersectionX >= city.x){
                    intersectionToTheRight++;
                }
            }
            if(intersectionToTheRight % 2 === 1){
                selectedPoints.push(i);
            }
        }
        this.commitSelection(selectedPoints);
    }

    highlightCity(){
        const highlightedCity = this.getClosestCity(this.state.mouseX, this.state.mouseY, 10);
        if(highlightedCity !== this.state.highlightedCity)
            this.setState({highlightedCity});
    }

    //track mouse
    getPosition = function(evt) {
        const canvas = this.state.canvas;
        const zoom = this.state.zoom;
        let translateX = this.state.translateX;
        let translateY = this.state.translateY;
        const rect = canvas.getBoundingClientRect();
        //calculate the mouse position, disregarding zoom and translation
        const mouseXOffset = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
        const mouseYOffset = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        //calculate the mouse position including zoom and translation
        const mouseX = (mouseXOffset - translateX) / zoom;
        const mouseY = (mouseYOffset - translateY) / zoom;
        //this.highlightCity();
        const translateDragStart = this.state.translateDragStart;
        if(translateDragStart){
            translateX += mouseX - translateDragStart.x;
            translateY += mouseY - translateDragStart.y;
            // Make sure the slide stays in its container area when zooming out
            if(translateX>0)
                translateX = 0;
            if(translateX+canvas.width*zoom<canvas.width)
                translateX = -canvas.width*(zoom-1);
            if(translateY>0)
                translateY = 0;
            if(translateY+canvas.height*zoom<canvas.height)
                translateY = -canvas.height*(zoom-1);
        }
        this.setState({mouseX, mouseY, mouseXOffset, mouseYOffset, translateX, translateY});
    }.bind(this);

    onPress = function(evt) {
        if(evt.button === 0) {
            if (this.state.rectSelectionMode)
                this.setState({rectSelectionStart: {x: this.state.mouseX, y: this.state.mouseY}, selectionEnd: {}});
            this.setState({mousePressTime: new Date()});
        }
        if(evt.button === 1) {
            this.setState({translateDragStart: {x: this.state.mouseX, y: this.state.mouseY}})
            evt.preventDefault();
        }
    }.bind(this);

    onRelease = function(evt) {
        if(evt.button === 0) {
            if (this.state.rectSelectionStart) {
                this.updateRectSelection();
                this.setState({rectSelectionStart: null});
            }
            if (this.state.polygonSelectionMode) {
                const points = this.state.polygonSelectionPoints;
                points.push({x: this.state.mouseX, y: this.state.mouseY});
                this.setState({polygonSelectionPoints: points})
            }
        }
        if(evt.button === 1) {
            this.setState({translateDragStart: null})
            evt.preventDefault();
        }
    }.bind(this);

    onClick = function(evt) {
        if(evt.button === 0) {
            //this practically fires whenever a mouse release is detected
            //so a timediff is used to filter out long presses
            if (new Date() - this.state.mousePressTime > 300)
                return;
            //and a position diff to detect quick selections
            if (this.state.rectSelectionMode && this.state.rectSelectionStart)
                if (this.state.rectSelectionStart.x - this.state.mouseX > 5 || this.state.rectSelectionStart.x - this.state.mouseX > 5)
                    return;
            //if a click was detected, we find the closest city, and select it
            const cityToSelect = this.getClosestCity(this.state.mouseX, this.state.mouseY, 10);
            if (cityToSelect !== null)
                this.commitSelection([cityToSelect]);
            else
                this.commitSelection([]);
        }
    }.bind(this);

    onDblClick = function(evt) {
        if(this.state.polygonSelectionMode){
            this.updatePolygonSelection();
            this.setState({polygonSelectionPoints: []});
        }
    }.bind(this);

    onKeyPress = function(evt) {
        if(evt.keyCode === 16){
            this.setState({additiveSelection: true})
        }
    }.bind(this);

    onKeyRelease = function(evt) {
        if(evt.keyCode === 16)
            this.setState({additiveSelection: false})
    }.bind(this);

    handleScroll = function(e){
        const factor = 0.1;
        const max_scale = 6;
        const mouseX = this.state.mouseXOffset;
        const mouseY = this.state.mouseYOffset;
        const width = this.state.canvas.width;
        const height = this.state.canvas.height;
        let translateX = this.state.translateX;
        let translateY = this.state.translateY;
        let zoom = this.state.zoom;
        let delta = e.delta || e.wheelDeltaY;
        if (delta === undefined && e.originalEvent) {
            delta = e.originalEvent.wheelDelta;
        }
        if(delta === undefined && e.originalEvent){
            //we are on firefox
            delta = e.originalEvent.detail;
        }
        delta = Math.max(-1,Math.min(1, delta)); // cap the delta to [-1,1] for cross browser consistency

        // determine the point on where the slide is zoomed in
        const zoomTargetX = (mouseX - translateX)/zoom;
        const zoomTargetY = (mouseY - translateY)/zoom;

        // apply zoom
        zoom += delta * factor * zoom;
        zoom = Math.max(1,Math.min(max_scale,zoom));

        // calculate x and y based on zoom
        translateX = -zoomTargetX * zoom + mouseX;
        translateY = -zoomTargetY * zoom + mouseY;


        // Make sure the slide stays in its container area when zooming out
        if(translateX>0)
            translateX = 0;
        if(translateX+width*zoom<width)
            translateX = -width*(zoom-1);
        if(translateY>0)
            translateY = 0;
        if(translateY+height*zoom<height)
            translateY = -height*(zoom-1);
        this.setState({translateX, translateY, zoom});
        e.preventDefault();
    }.bind(this);

    selectCityById = function(id){
        const cities = this.state.cities.slice();
        for(let i = 0; i < cities.length; i++){
            if(cities[i]._id === id)
                cities[i].selected = true;
        }
        this.setState({cities: cities}, ()=>{
            this.sendSelection();
        })
    }.bind(this);

    render() {
        const cities = this.state.cities.slice();
        const highlightedCity = this.state.highlightedCity ? cities[this.state.highlightedCity] : null;
        const highlightedCityLabel = highlightedCity ? highlightedCity.nameAr + " - " + highlightedCity.nameHe : "";
        return (
            <div dir={"rtl"} className={"city-selector"}>
                <div className={"map-selector-wrap"}>
                    <canvas ref={this.canvasRef} className="map-view" style={{cursor: this.state.translateDragStart ? "move" : "crosshair"}}/>
                    <div className={"highlighted-city-label"}>
                        {highlightedCityLabel}
                    </div>
                    <div className={"selection-mechanism"}>
                        <button type={"button"}
                                className={"selection-mode rect-selection " + (this.state.rectSelectionMode ? "active-mode" : "")}
                                onClick={()=>{this.setState({polygonSelectionMode: false, rectSelectionMode: true})}}>
                        </button>
                        <button type={"button"}
                                className={"selection-mode poly-selection " + (this.state.polygonSelectionMode ? "active-mode" : "")}
                                onClick={()=>{this.setState({polygonSelectionMode: true, rectSelectionMode: false})}}>
                        </button>
                    </div>
                </div>
                <div className={"selected-cities-list"}>
                    <div className={"select-city-wrap"}>
                        <FontAwesomeIcon icon={faPlus}/>
                        <select className="select-city" value="" onChange={(e)=>{this.selectCityById(e.target.value)}}>
                            <option value={""}/>
                            {cities.filter(city => !city.selected && city.nameHe && city.nameHe.length).map(city => {
                                return <option key={"city-he-" + city._id} value={city._id}>{city.nameHe}</option>
                            })}
                            {cities.filter(city => !city.selected && city.nameAr && city.nameAr.length).map(city => {
                                return <option key={"city-ar-" + city._id} value={city._id}>{city.nameAr}</option>
                            })}
                        </select>
                    </div>
                    {
                        cities.filter(city => city.selected).map(city => {
                            return <div className={"selected-city"} key={"city-" + city._id}>
                                <div className={"deselect-city"}
                                     onClick={()=>{
                                         city.selected = false;
                                         this.sendSelection();
                                         this.forceUpdate();
                                     }}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </div>
                                <div className={"selected-city-name"}>{city.nameAr + " - " + city.nameHe}</div>
                            </div>
                        })
                    }
                </div>
                {/** I use this img tag simply because it is impossible to dynamically generate one in nodejs.
                 It is hidden from the user. The actual scan is displayed on a canvas **/}
                <img alt={"ma"} src={map} ref={this.imgRef} className="hidden"/>
            </div>
        )
    }

}