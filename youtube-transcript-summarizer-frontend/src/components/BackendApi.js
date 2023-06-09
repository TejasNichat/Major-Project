import braille from 'braille';
import React from 'react';
import Tabs from "./Tabs";
import ET from "../transcripts/English.txt";
import HT from "../transcripts/Hindi.txt";
import GT from "../transcripts/Gujarati.txt";

class BackendAPI extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			error: null,
			isLoaded: false,
			isLoading: false,
			failedMessage: null,
			message: '',
		};
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}
	
	handleSubmit = (event) => {
		this.setState({
			isLoading: true,
			isLoaded: false
		});

		var FinalURL = `http://127.0.0.1:5000/api/?video_url=${this.state.name}`;

		fetch(FinalURL, { timeout: 10000 })
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result.data)
					if (result.data.message === "Success") {
						this.setState({
							isLoaded: true,
							isLoading: false,
							message: result.data.message,
							englishTranscript: result.data.eng_summary,
							hindiTranscript: result.data.hind_summary,
							gujaratiTranscript: result.data.guj_summary,
							originalTextLength: result.data.original_txt_length,
							summarizedTextLength: result.data.final_summ_length,
							brailleText: braille.toBraille(result.data.eng_summary)
						});
					} else {
						this.setState({
							isLoaded: true,
							isLoading: false,
							failedMessage: result.data.error
						});
					}
				},

				(error) => {
					alert('An Error occured: ' + this.state);
					this.setState({
						isLoaded: true,
						isLoading: false,
						error: error
					});
				}
			)

		event.preventDefault();
	}

	stopAudio = () => {

		window.speechSynthesis.cancel();
	}

	textToAudio = () => {

		var synth = window.speechSynthesis;
		var utterance = new SpeechSynthesisUtterance(this.state.englishTranscript);
		synth.speak(utterance);

	}

	render() {

		const { isLoaded, isLoading, message, englishTranscript, hindiTranscript, gujaratiTranscript, brailleText, originalTextLength, summarizedTextLength } = this.state;

		if (isLoading) {
			console.log("inside loading")

			return (
				<>
					<form onSubmit={this.handleSubmit}>
						<label>
							Video URL:
						</label>
						<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
						<input className="submit-1" type="submit" value="Summarize" />

					</form>
					<center>
						<div className="lds-ripple"><div></div><div></div></div>
					</center>
					<Tabs>
						<div label="English">
							<div className="tab-content-1">
								English Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Hindi">
							<div className="tab-content-1">
								Hindi Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Gujarati">
							<div className="tab-content-1">
								Gujarati Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Braille">
							<div className="tab-content-1">
								{braille.toBraille("Braille Summarized Text Will be Shown Here...")}
							</div>
						</div>
					</Tabs>
				</>
			);
		} else if (isLoaded) {
			console.log("inside loaded")

			if (message === "Success") {
				console.log("inside loaded success")

				return (
					<>
						<form onSubmit={this.handleSubmit}>
							<label>
								Video URL:
							</label>
							<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
							<input className="submit-1" type="submit" value="Summarize" />
						</form>
						<p>{originalTextLength}<i className="arrow right"></i>{summarizedTextLength}</p>
						<Tabs>
							<div label="English">
								<div className="tab-content">
									<div>
										<center>
											<button className="btn-1" type="button" onClick={this.textToAudio}>Speak</button>
											<button className="btn-1" type="button" onClick={this.stopAudio}>Stop</button>
										</center>
										<center>
											<a href={ET} className="buttonDownload" download="English_Transcript.txt" type="button">Download</a>
										</center>
									</div>
									{englishTranscript}
								</div>
							</div>
							<div label="Hindi">
								<div className="tab-content">
									<div>
										<center>
											<a href={HT} className="buttonDownload" download="Hindi_Transcript.txt" type="button">Download</a>
										</center>
									</div>
									{hindiTranscript}
								</div>
							</div>
							<div label="Gujarati">
								<div className="tab-content">
									<div>
										<center>
											<a href={GT} className="buttonDownload" download="Gujarati_Transcript.txt" type="button">Download</a>
										</center>
									</div>
									{gujaratiTranscript}
								</div>
							</div>
							<div label="Braille">
								<div className="tab-content">
									<div>
										<center>
											<a href={ET} className="buttonDownload" download="Braille_Transcript.txt" type="button">Download</a>
										</center>
									</div>
									{brailleText}
								</div>
							</div>
						</Tabs>
					</>
				);
			}

			else {
				console.log("inside loaded not success")

				return (
					<>
						<form onSubmit={this.handleSubmit}>
							<label>
								Video URL:
							</label>
							<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
							<input className="submit-1" type="submit" value="Summarize" />
						</form>
						<div>
							<br />
							An Error occured: {this.state.failedMessage}.
						</div>
						<Tabs>
							<div label="English">
								<div className="tab-content-1">
									English Summarized Text Will be Shown Here...
								</div>
							</div>
							<div label="Hindi">
								<div className="tab-content-1">
									Hindi Summarized Text Will be Shown Here...
								</div>
							</div>
							<div label="Gujarati">
								<div className="tab-content-1">
									Gujarati Summarized Text Will be Shown Here...
								</div>
							</div>
							<div label="Braille">
								<div className="tab-content-1">
									{braille.toBraille("Braille Summarized Text Will be Shown Here...")}
								</div>
							</div>
						</Tabs>
					</>
				);
			}

		}

		else {
			console.log("inside else screen")


			return (
				<>
					<form onSubmit={this.handleSubmit}>
						<label>
							Video URL:
						</label>
						<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
						<input className="submit-1" type="submit" value="Summarize" />
					</form>
					<p>Original Length<i className="arrow right"></i>Final Length</p>
					<Tabs>
						<div label="English">
							<div className="tab-content-1">
								English Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Hindi">
							<div className="tab-content-1">
								Hindi Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Gujarati">
							<div className="tab-content-1">
								Gujarati Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Braille">
							<div className="tab-content-1">
								{braille.toBraille("Braille Summarized Text Will be Shown Here...")}
							</div>
						</div>
					</Tabs>

				</>
			);
		}

	}
}

export default BackendAPI;