<script lang='ts'>
	import ProductCard from "$lib/productCard.svelte";
	import { get } from 'svelte/store';
	import { cartItems } from "../cart";

	const products: Product[] = [
		{
			id: 'price_1MoBtkInLejVwk4CxcH1PrR9',
			name: "Coffee",
			price: 2,
		},
		{
			id: 'price_1MoBumInLejVwk4CaO7U7Iiw',
			name: "Sunglasses",
			price: 10,
		},
		{
			id: 'price_1MoBv9InLejVwk4CpRNL8qPP',
			name: "T-Shirt",
			price: 15,
		}
	]

	async function checkout(){
		await fetch('api/stripeCheckout',{ //this is looking at http://localhost:5173/api/stripeCheckout
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				items: get(cartItems)
			})
		}).then((data) => {
			return data.json()
		}).then((data) => {
			window.location.replace(data.url);
		});
	}
</script>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-3">
			<h1>Sveltekit 1.0 store</h1>
		</div>
		{#each products as product}
			<ProductCard product={product}/>
		{/each}
		<div class="col-span-3">
			<button class='btn variant-filled-primary' on:click={()=> checkout()}> Checkout with Stripe</button>
		</div>
	</div>
</div>
