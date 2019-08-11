import React from 'react'
import ReactDOM from 'react-dom'
import {Cropper} from 'react-image-cropper'


export default class ImageCropper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cropper: "",
			onCrop: props.onCrop
		};
		if(props.file)
		{
			const reader = new FileReader();
			reader.addEventListener(
				'load',
				() =>
					this.setState({
						src: reader.result,
					}),
				false
			);
			reader.readAsDataURL(props.file)
		}
	}
	handleImageLoad(){
		this.setState({baseImg: this.state.cropper.img});
	}
	handleCrop(cropper){
		this.state.onCrop(this.state.cropper.crop());
	}
	render() {
		const src = this.state.src;
		const imageWidth = this.state.baseImg?this.state.baseImg.clientWidth:1;
		const imageHeight = this.state.baseImg?this.state.baseImg.clientHeight:1;
		const cropperWrap =
		src?
			<div>
				<Cropper src={this.state.src} onImgLoad={this.handleImageLoad.bind(this)} originX={imageWidth/20} originY={imageHeight/20} width={imageWidth/20*18} height={imageHeight/20*18} fixedRatio={false} ref={ ref => { this.state.cropper = ref }}/>
				<button className="crop-button" type="button" onClick={this.handleCrop.bind(this)}>crop!</button>
			</div>
		:"";
		return (
			<div>
				<style>{/**
					.crop-button{
						color: white;
						background-color: #90278e;
						border: none;
						outline: none;
						font-size: 1.5em;
						display: block;
						padding: 0.25em 0.5em;
						margin: 0.5em auto;
						transition: background-color 0.25s;
						cursor: pointer;
					}
					.crop-button:hover{
						background-color: #731f72;
					}
					.crop-button:active{
						background-color: #561755;
					}**/}</style>
				{cropperWrap}
			</div>
		)
	}
}