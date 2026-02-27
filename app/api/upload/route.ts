import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert the file to a buffer (required for storage upload in this route format)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique name
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to 'product_images' bucket 
        const { data, error } = await supabaseAdmin.storage
            .from('product_images')
            .upload(filePath, buffer, {
                contentType: file.type || 'image/png',
                upsert: false
            });

        if (error) {
            console.error("Supabase storage error:", error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product_images')
            .getPublicUrl(filePath);

        return Response.json({ publicUrl });

    } catch (error: any) {
        console.error("Upload route error:", error);
        return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
