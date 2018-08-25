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
			)
			reader.readAsDataURL(props.file)
		}
	}
	handleCrop(cropper){
		this.state.onCrop(this.state.cropper.crop());
	}
	render() {
		const src = this.state.src;
		const cropperWrap =
		src?
			<div>
				<Cropper src={this.state.src} fixedRatio={false} ref={ ref => { this.state.cropper = ref }}/>
				<button type="button" onClick={this.handleCrop.bind(this)}>crop!</button>
			</div>
		:"";
		return (
			<div>
				{cropperWrap}
			</div>
		)
	}
}