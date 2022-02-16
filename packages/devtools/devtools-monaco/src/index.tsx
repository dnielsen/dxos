import { render } from 'react-dom'
import React, { useState } from 'react'
import { Editor } from './Editor';

const initialContent: string[] = ['function x() {', '\tconsole.log("Hello world!");', '}'];
const App = () => {
  const [code, setCode] = useState(initialContent.join('\n'))
	console.log('------- code', code);

  return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100vw', height: '100vh' }}>
			<Editor
				language='javascript'
				theme="vs-dark"
				height={'100%'}
				value={code}
				onChange={(value, event) => {
					console.log('value', value);
					
					console.log('event', event);
					
					console.log('setCode', setCode);
				}}
			/>
			<div>
				{/* {code} */}
			</div>
		</div>
  )
}

render(<App />, document.getElementById('root'))
