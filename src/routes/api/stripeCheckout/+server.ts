import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET_STRIPE_KEY = process.env.SECRET_STRIPE_API_KEY ?? '';
const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2022-11-15'
});
// we are in localhost:5173/api/stripeCheckout

//POST /stripeCheckout data: items
//return -> url created by Strip for our user to use

export const POST: RequestHandler = async ({ request }) => {
	//items: [{id: "1", quantity: 4}, {id: "2", quantity: 1}]
	const data = await request.json();
	const items = data.items;

	interface LineItem {
		price: string;
		quantity: number;
	}

	/**
	 * we have: [{id: "1", quantity: 4}, {id: "2", quantity: 3}]
	 * stripe wants: [{price: "1", quantity: 4}, {price: "2", quantity: 3}]
	 */

	const lineItems: LineItem[] = [];
	items.forEach((item: { id: string; price: string; quantity: number }) => {
		lineItems.push({
			price: item.id,
			quantity: item.quantity
		});
	});

	// It gives us a URL for the person to check out with
	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		success_url: 'http://localhost:5173/success',
		cancel_url: 'http://localhost:5173/cancel'
	});

	return new Response(
		JSON.stringify({ url: session.url }), // frontend will get this url to redirect
		{
			status: 200,
			headers: { 'content-type': 'application/json' }
		}
	);
};
