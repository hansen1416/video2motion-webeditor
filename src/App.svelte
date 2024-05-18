<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import ThreeEditor from "./routes/ThreeEditor.svelte";
</script>

<Router>
	<div>
		<Route path="editor">
			<ThreeEditor />
		</Route>
	</div>
</Router>
