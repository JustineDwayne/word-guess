import { getWords } from '@/lib/getWords';

export async function GET(req){
    const { searchParams } = new URL(req.url);
    const word = searchParams.get('word');

    if ( !word ) return new Response(JSON.stringify({ error: 'Word unavailable'}), { status: 400 })

    try { 
        const wordData = await getWords(word);

        return new Response(JSON.stringify(wordData), { 
            status: 200 , 
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}