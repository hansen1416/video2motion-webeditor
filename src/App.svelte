<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import ThreeEditor from "./routes/ThreeEditor.svelte";
	import Recorder from "./routes/Recorder.svelte";
</script>

<Router>
	<div>
		<Route path="editor">
			<ThreeEditor />
		</Route>
		<Route path="recorder">
			<Recorder />
		</Route>
	</div>
</Router>
