import React from 'react';

import config from '../../services/config';
import server from '../../services/server';
import './ScanContacts.scss';
import EventPicker from '../../UIComponents/EventPicker/EventPicker';
import ImageUploader from '../../UIComponents/ImageUploader/ImageUploader';
import ia from "../../services/canvas/imageAdjustor";

export default class ScanForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onPublish: this.props.onPublish,
            pendingServerResponse: false,
            selectedImage: false,
            selectedImageSrc: false,
            scanUrl: null,
            scanWidth: 1000, //this is a constant - the uploaded scan will be this many pixels wide
            width: 1000, //this stays 1000 throughout
            height: 1000, //this changes according to the aspect ratio of the uploaded picture
            eventId: null,
        };
        this.canvasRef = React.createRef();
        this.imgRef = React.createRef();
    }
    loadImageToCanvasWrap() {
        //this is the canvas we draw on
        const canvas = this.canvasRef.current;
        //this is the image being scanned
        const scanImage = this.imgRef.current;
        //initialize wrapper canvas to have the same size as the image it's wrapping
        canvas.width = this.state.scanWidth;
        canvas.height = Math.floor(scanImage.height/scanImage.width*this.state.scanWidth);
        const ctx = canvas.getContext('2d');
        //initialize canvas to have a white background to prevent transparent areas messing with the detection
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw the image onto a wrapping canvas - this allows us to access the pixel data directly later on
        ia.drawImage(ctx, scanImage, 0, 0, canvas.width, canvas.height);
        //storing the canvases in the state. Once done, perform minor contrast/saturation adjustments.
        this.setState({width:canvas.width, height:canvas.height});
    }
    rotateScan(dir){
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ia.rotateImg(ctx, dir);
    }
    handleImageSelection(file) {
        const reader = new FileReader();
        reader.onload = ()=>{
            this.setState({selectedImageSrc: reader.result}, ()=>{
                const scanImage = this.imgRef.current;
                scanImage.src = this.state.selectedImageSrc;
                if(scanImage.complete)
                    this.loadImageToCanvasWrap();
                else
                    scanImage.onload = ()=>{
                        this.loadImageToCanvasWrap();
                    };
            });
        };
        reader.readAsDataURL(file);
        this.setState({selectedImage: file});
    }
    handleEventSelection(id){
        this.setState({eventId: id});
    }
    handlePost(){
        if(this.state.pendingServerResponse)
            return;
        this.setState({pendingServerResponse: true});
        this.canvasRef.current.toBlob(file => {
            const formWrap = new FormData();
            formWrap.append("scan", file);
            fetch(config.serverPath+"api/contactScan/upload", {
                headers: {
                    'Accept': 'application/json, application/xml, text/play, text/html, *.*'
                },
                credentials: 'same-origin',
                method: 'POST',
                body: formWrap
            })
                .then(res => res.json())
                .then(json => {
                    this.publishScan(json.url);
                });
        }, 'image/jpeg');
    }
    publishScan(imgUrl){
        const data ={"scanUrl":imgUrl, "eventId":this.state.eventId};
        server.post('contactScan', data)
            .then((res) => {
                if(res.err){
                    alert(res.err);
                    return;
                }
                this.reset();
                this.setState({pendingServerResponse: false});
                this.state.onPublish(res.id);
            });
    }
    reset() {
        this.setState ({
            selectedImage: false,
            selectedImageSrc: false,
            croppedImage: false,
            normalizedImg: false,
            scanUrl: null,
            horizontalBorders: [],
            verticalBorders: [],
            detectedCells: [],
            scanFailed: false,
            width: 1000,
            height: 1000,
        });
    }
    render() {
        const selectedImage = this.state.selectedImage;
        const imgUploadUI = <div className="contact-scan-uploader">
            <ImageUploader onSelect={this.handleImageSelection.bind(this)} labelText={selectedImage?"⇪ تحميل صفحة اتصال העלאה מחדש ⇪":"⇪ اعادة تحميل העלאת דף קשר ⇪"}/>
        </div>;
        const postButton = <button type={"button"} className="post-scan-button" onClick={this.handlePost.bind(this)}>העלאת המסמך למערכת</button>;
        const scanPreview = <div>
            <div className={"rotation-controls"}>
                <button type={"button"} onClick={()=>{this.rotateScan(true)}}>↻</button>
                <button type={"button"} onClick={()=>{this.rotateScan(false)}}>↺</button>
            </div>
            <canvas ref={this.canvasRef} className="img-preview"/>
        </div>;
        return (
            <div className={"page-wrap-scan-contacts"}>
                <div className={"main-content"}>
                    <div className="scan-selection-wrap">
                        <h3>اضافة مسح صفحة اتصال</h3>
                        <h3>העלו סריקה של דף הקשר</h3>
                        {imgUploadUI}
                        {this.state.selectedImageSrc ? scanPreview : ""}
                    </div>
                    <div className="event-selection-wrap">
                        <h3>اختر الحدث الذي جمعت به جهات الاتصال</h3>
                        <h3>בחרו את האירוע שבמסגרתו הופק דף הקשר</h3>
                        <EventPicker handleSelection={this.handleEventSelection.bind(this)} selected={this.state.eventId}/>
                    </div>
                </div>
                {(selectedImage && this.state.eventId) ? postButton : ""}
                {/** I use this img tag simply because it is impossible to dynamically generate one in nodejs.
                 It is hidden from the user. The actual scan is displayed on a canvas **/}
                <img alt="hidden" src="" ref={this.imgRef} className="hidden"/>
            </div>
        )
    }

}