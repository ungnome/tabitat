<script lang="ts">
	import { search, total } from './tabs';
</script>

<header id="header">
	<h2 id="title">Tabitat</h2>
	<input
		id="search-input"
		type="search"
		placeholder="Search"
		bind:value={$search}
		autofocus />

	<p class="self-center mb-1 text-base">Total Tabs: {$total}</p>
</header>

<style lang="postcss">
	#header {
		@apply sticky top-0 z-50 w-screen flex flex-col content-center drop-shadow-sm bg-white dark:bg-neutral-800 dark:text-white;
	}

	#title {
		@apply m-3 text-2xl font-semibold;
	}

	#search-input {
		@apply mx-4 mb-4 p-1 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-2 focus:border-indigo-400 focus:ring-indigo-200 dark:bg-neutral-800;
	}
</style>
