import React from 'react';
import ia from "../../services/canvas/imageAdjustor";
import style from "./CitySelector.css";

export default class CitySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: this.props.cities,
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            bottom: this.props.bottom,
            left: this.props.left,
            right: this.props.right,
            mouseX: 0,
            mouseY: 0,
            mousePressed: false,
            mousePressTime: 0,
            additiveSelection: false,
            rectSelectionMode: true,
            rectSelectionStart: null,
            polygonSelectionMode: false,
            polygonSelectionPoints: [],
            highlightedCity: null,
            canvas: null,
            ctx: null
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
        //initialize wrapper canvas to have the same size as the image it's wrapping
        canvas.width = this.state.width;
        canvas.height = Math.floor(this.state.width/(right-left)*(top-bottom));
        const ctx = canvas.getContext('2d');
        this.setState({ctx: ctx, canvas: canvas}, ()=>{
            this.draw();
        });
        //animation loop configuration
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
        })();
    }

    componentWillReceiveProps(nextProps){
        if(!this.state.cities || this.state.cities.length !== nextProps.cities.length || this.cities !== nextProps.cities){
            this.setState({cities: nextProps.cities}, this.loadMapToCanvas);
        }
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
        ctx.fillStyle="#90278E";
        ctx.strokeStyle="#50003E";
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(!city.location || !city.location.lat || !city.location.lng)
                continue;
            const cityPosition = this.coordinatesToPosition(ctx.canvas, city.location.lng, city.location.lat);
            ctx.beginPath();
            ctx.arc(cityPosition.x, cityPosition.y, (city.selected || city.toBeSelected) ? 10 : 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
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
        const vertices = this.state.polygonSelectionPoints.slice();
        if(!vertices.length)
            return;
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        ctx.strokeStyle="#005544";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for(let i = 0; i < vertices.length; i++){
            const vertex = vertices[i];
            ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle="#fff";
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawCityHighlight(ctx){
        const cities = this.state.cities.slice();
        const highlighted = this.state.highlightedCity;
        if(highlighted !== null){
            ctx.fillStyle="#60278E30";
            ctx.strokeStyle="#005544";
            const cityPosition = this.coordinatesToPosition(ctx.canvas, cities[highlighted].location.lng, cities[highlighted].location.lat);
            ctx.beginPath();
            ctx.arc(cityPosition.x, cityPosition.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    draw = function() {
        const canvas = this.state.canvas;
        const ctx = this.state.ctx;
        this.drawMap(ctx, canvas.width, canvas.height);
        this.drawCities(ctx);
        if(this.state.rectSelectionMode)
            this.drawRectSelectionArea(ctx);
        if(this.state.polygonSelectionMode)
            this.drawPolygonSelectionArea(ctx);
        this.drawCityHighlight(ctx);
        requestAnimFrame(this.draw);
    }.bind(this);

    coordinatesToPosition(canvas, lng, lat){
        const top = this.state.top;
        const bottom = this.state.bottom;
        const left = this.state.left;
        const right = this.state.right;
        const x = (lng - left)/(right-left)*canvas.width;
        const y = canvas.height - (lat - bottom)/(top-bottom)*canvas.height;
        return {x: x, y: y};
    }

    getClosestCity(x, y, cutoffDist){
        const cities = this.state.cities.slice();
        const canvas = this.state.canvas;
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        let closestToCursor = null;
        let minDistFromCursor = cutoffDist * 2;
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(!city.location || !city.location.lat || !city.location.lng)
                continue;
            const cityPosition = this.coordinatesToPosition(canvas, city.location.lng, city.location.lat);
            let distFromCursor = (Math.abs(cityPosition.y - mouseY) + Math.abs(cityPosition.x - mouseX));
            if(minDistFromCursor > distFromCursor){
                minDistFromCursor = distFromCursor;
                closestToCursor = i;
            }
        }
        return closestToCursor;
    }

    previewSelection(indexesToSelect){
        const cities = this.state.cities.slice();
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            city.toBeSelected = false;
        }
        for(let i = 0; i < indexesToSelect.length; i++){
            const city = cities[indexesToSelect[i]];
            city.toBeSelected = true;
        }
        this.setState({cities: cities});
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
            const cityPosition = this.coordinatesToPosition(this.state.canvas, city.location.lng, city.location.lat);
            if(cityPosition.x >= minX && cityPosition.x <= maxX && cityPosition.y >= minY && cityPosition.y <= maxY){
                selectedCities.push(i);
            }
        }
        this.previewSelection(selectedCities);
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
                const cityPosition = this.coordinatesToPosition(this.state.canvas, city.location.lng, city.location.lat);
                if((cityPosition.y < start.y && cityPosition.y < end.y) || (cityPosition.y > start.y && cityPosition.y > end.y))
                    continue;
                const intersectionX = start.x + ((cityPosition.y - start.y) / (end.y - start.y) * (end.x - start.x));
                if(intersectionX >= cityPosition.x){
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
        const highlighted = this.getClosestCity(this.state.mouseX, this.state.mouseY, 10);
        this.setState({highlightedCity: highlighted});
    }

    //track mouse
    getPosition = function(evt) {
        const canvas = this.state.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
        const mouseY = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        if(this.state.rectSelectionMode){
            this.updateRectSelection();
        }
        this.highlightCity();
        this.setState({mouseX: mouseX, mouseY: mouseY});
    }.bind(this);

    onPress = function(evt) {
        if(this.state.rectSelectionMode)
            this.setState({rectSelectionStart: {x: this.state.mouseX, y: this.state.mouseY}, selectionEnd:{}});
        this.setState({mousePressTime: new Date()});
    }.bind(this);

    onRelease = function(evt) {
        if(this.state.rectSelectionStart){
            this.commitSelection();
            this.setState({rectSelectionStart: null});
        }
        if(this.state.polygonSelectionMode){
            const points = this.state.polygonSelectionPoints;
            points.push({x: this.state.mouseX, y: this.state.mouseY});
            this.setState({polygonSelectionPoints: points})
        }
    }.bind(this);

    onClick = function(evt) {
        //this practically fires whenever a mouse release is detected
        //so a timediff is used to filter out long presses
        if(new Date() - this.state.mousePressTime > 300)
            return;
        //and a position diff to detect quick selections
        if(this.state.rectSelectionMode && this.state.rectSelectionStart)
            if(this.state.rectSelectionStart.x - this.state.mouseX > 5 || this.state.rectSelectionStart.x - this.state.mouseX > 5 )
            return;
        //if a click was detected, we find the closest city, and select it
        const cityToSelect = this.getClosestCity(this.state.mouseX, this.state.mouseY, 10);
        if(cityToSelect !== null)
            this.commitSelection([cityToSelect]);
        else
            this.commitSelection([]);
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

    render() {
        const cities = this.state.cities.slice();
        const highlightedCity = this.state.highlightedCity ? cities[this.state.highlightedCity] : null;
        const highlightedCityLabel = highlightedCity ? highlightedCity.nameAr + " - " + highlightedCity.nameHe : "";
        const highlightedCityPosition = highlightedCity ? this.coordinatesToPosition(this.state.canvas, highlightedCity.location.lng, highlightedCity.location.lat) : {};
        return (
            <div>
                <style jsx global>{style}</style>
                <div className={"map-selector-wrap"}>
                    <canvas ref={this.canvasRef} className="map-view"/>
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
                {/** I use this img tag simply because it is impossible to dynamically generate one in nodejs.
                 It is hidden from the user. The actual scan is displayed on a canvas **/}
                <img src="/static/map.jpg" ref={this.imgRef} className="hidden"/>
            </div>
        )
    }

}