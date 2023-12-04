import PPUndoEditor from "./components/Note/PP-UndoEditor/layout"

export default function Home() {
	return (
		<div style={{ display: 'flex' }}>
			<PPUndoEditor />
			<div>
				<div
					style={{
						width: '30vw',
						height: '100vh',
						padding: 8,
						background: '#eee',
						border: 'none',
						fontFamily: 'monospace',
						fontSize: 12,
						borderLeft: 'solid 2px #333',
						display: 'flex',
						flexDirection: 'column-reverse',
						overflow: 'auto',
					}}
				>
				</div>
			</div>
		</div>
	)
}