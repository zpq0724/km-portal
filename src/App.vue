<template>
	<div id="app">
  	<router-view/>
  </div>
</template>

<script>
	 import {mapState} from 'vuex'
	export default {

		name: 'App',
	}
</script>

<style scoped>
	#app {
		height: 100%;
	}
</style>
