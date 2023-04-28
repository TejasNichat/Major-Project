import './App.css';
import BackendAPI from './components/BackendApi';


function App() {
	return (
		<div className="App ">
			<header className="App-header bg">
				<h1>YouTube Transcript Summarizer</h1>
				{/* <pre><div class="line"></div></pre> */}
				<BackendAPI />
			</header>
		</div>
	);
}

export default App;
