import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { name, description, image_url } = await request.json();

        if (!name) {
            return Response.json({ error: 'Name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('collections')
            .insert([{ name, description, image_url }])
            .select()
            .single();

        if (error) throw error;

        return Response.json({ data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('collections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return Response.json({ data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
