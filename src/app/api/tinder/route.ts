import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const cookieStore = cookies();
        const supabase = createServerComponentClient({ cookies: () => cookieStore });
        const { data: { users }, error } = await supabase.auth.admin.listUsers()
        return NextResponse.json(users);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}