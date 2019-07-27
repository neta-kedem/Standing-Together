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
            isSelecting: false,
            selectionStart: null,
            selectionEnd: null,
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
    draw = function() {
        const cities = this.state.cities.slice();
        const top = this.state.top;
        const bottom = this.state.bottom;
        const left = this.state.left;
        const right = this.state.right;
        const scanImage = this.imgRef.current;
        const canvas = this.state.canvas;
        const ctx = this.state.ctx;
        //initialize canvas to have a white background to prevent transparent areas messing with the detection
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
        ia.drawImage(ctx, scanImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle="#90278E";
        ctx.strokeStyle="#50003E";
        for(let i = 0; i < cities.length; i++){
            const city = cities[i];
            if(!city.location || !city.location.lat || !city.location.lng)
                continue;
            const cityX = (city.location.lng - left)/(right-left)*canvas.width;
            const cityY = canvas.height - (city.location.lat - bottom)/(top-bottom)*canvas.height;
            ctx.beginPath();
            ctx.arc(cityX, cityY, city.selected ? 10 : 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        ctx.beginPath();
        const mouseX = this.state.mouseX;
        const mouseY = this.state.mouseY;
        const selectionStart = this.state.selectionStart;
        const isSelecting = this.state.isSelecting;
        if(selectionStart && !isSelecting){
            ctx.fillStyle="#90278E90";
            ctx.fillRect(
                Math.min(mouseX, selectionStart.x),
                Math.min(mouseY, selectionStart.y),
                Math.abs(mouseX - selectionStart.x),
                Math.abs(mouseY - selectionStart.y)
            )
        }
        if(!(selectionStart && !isSelecting)){
            //highlighted city
            const highlighted = this.state.highlightedCity;
            if(highlighted !== null){
                ctx.fillStyle="#60278E30";
                ctx.strokeStyle="#005544";
                const cityX = (cities[highlighted].location.lng - left)/(right-left)*canvas.width;
                const cityY = canvas.height - (cities[highlighted].location.lat - bottom)/(top-bottom)*canvas.height;
                ctx.beginPath();
                ctx.arc(cityX, cityY, 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        }
        //storing the canvases in the state. Once done, perform minor contrast/saturation adjustments.
        this.setState({width: canvas.width, height: canvas.height});
        requestAnimFrame(this.draw);
    }.bind(this);
    //track mouse
    getPosition = function(evt) {
        const canvas = this.state.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouseX = Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
        const mouseY = Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        const top = this.state.top;
        const bottom = this.state.bottom;
        const left = this.state.left;
        const right = this.state.right;
        const isSelecting = this.state.isSelecting;
        if(this.state.selectionStart){
            const maxX = Math.max(this.state.selectionStart.x, isSelecting?this.state.selectionEnd.x:this.state.mouseX);
            const maxY = Math.max(this.state.selectionStart.y, isSelecting?this.state.selectionEnd.y:this.state.mouseY);
            const minX = Math.min(this.state.selectionStart.x, isSelecting?this.state.selectionEnd.x:this.state.mouseX);
            const minY = Math.min(this.state.selectionStart.y, isSelecting?this.state.selectionEnd.y:this.state.mouseY);
            const cities = this.state.cities.slice();
            let closestToCursor = 0;
            let minDistFromCursor = 30;
            for(let i = 0; i < cities.length; i++){
                const city = cities[i];
                if(!city.location || !city.location.lat || !city.location.lng)
                    continue;
                const cityX = (city.location.lng - left)/(right-left)*canvas.width;
                const cityY = canvas.height - (city.location.lat - bottom)/(top-bottom)*canvas.height;
                if(cityX >= minX && cityX <= maxX && cityY >= minY && cityY <= maxY){
                    city.selected = true;
                }
                else{
                    city.selected = false;
                }
                let distFromCursor = (Math.abs(cityY - mouseY) + Math.abs(cityX - mouseX));
                if(minDistFromCursor > distFromCursor){
                    minDistFromCursor = distFromCursor;
                    closestToCursor = i;
                }
            }
            let highlightedCity = null;
            if(closestToCursor){
                highlightedCity = closestToCursor;
            }
            this.setState({cities: cities, highlightedCity: highlightedCity});
        }
        this.setState({mouseX: mouseX, mouseY: mouseY});
    }.bind(this);
    onPress = function(evt) {
        if(this.state.isSelecting)
            this.setState({selectionStart: {x: this.state.mouseX, y: this.state.mouseY}, selectionEnd:{}, isSelecting: false});
    }.bind(this);
    onRelease = function(evt) {
            this.setState({selectionEnd: {x: this.state.mouseX, y: this.state.mouseY}, isSelecting: true});
    }.bind(this);
    render() {
        const cities = this.state.cities.slice();
        const highlightedCity = this.state.highlightedCity ? cities[this.state.highlightedCity] : null;
        const highlightedCityLabel = highlightedCity ? highlightedCity.nameAr + " - " + highlightedCity.nameHe : "";
        return (
            <div>
                <style jsx global>{style}</style>
                <div className={"map-selector-wrap"}>
                    <canvas ref={this.canvasRef} className="map-view"/>
                    <div className={"highlighted-city-label"}>
                        {highlightedCityLabel}
                    </div>
                </div>
                {/** I use this img tag simply because it is impossible to dynamically generate one in nodejs.
                 It is hidden from the user. The actual scan is displayed on a canvas **/}
                <img src="/static/map.jpg" ref={this.imgRef} className="hidden"/>
            </div>
        )
    }

}