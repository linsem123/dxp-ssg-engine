export const dynamic = 'force-static'
 
export async function GET() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const posts = await res.json();

    return new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' }
    });
}