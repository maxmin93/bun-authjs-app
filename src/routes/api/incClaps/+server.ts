import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const data = await request.formData();

  return json({ success: true });
}
